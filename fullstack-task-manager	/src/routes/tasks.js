const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../services/tasks");
const {
  createTaskSchema,
  updateTaskSchema,
  validate,
} = require("../utils/validators");
const { success, error } = require("../utils/response");
const authGuard = require("../hooks/authGuard");

module.exports = async function (fastify, options) {
  // GET /tasks - Returns all tasks owned by the user or all if admin
  fastify.get("/tasks", { onRequest: [authGuard] }, async (request, reply) => {
    const sort = request.query.sort;
    const status = request.query.status || null;
    const userId = request.user.role === "admin" ? null : request.user.id;
    const tasks = await getAllTasks(sort, status, userId);
    return success("Tasks retrieved", tasks);
  });

  // create a new task (validate title and description)
  fastify.post("/tasks", { onRequest: [authGuard] }, async (request, reply) => {
    const validation = validate(createTaskSchema, request.body);
    if (!validation.success) {
      return reply
        .code(400)
        .send({ success: false, message: validation.message });
    }
    const userId = request.user.id;
    const task = await createTask({ ...validation.data, userId });
    return reply.code(201).send(success("Task created", task));
  });

  // update task status (only if owned by user)
  fastify.put(
    "/tasks/:id",
    { onRequest: [authGuard] },
    async (request, reply) => {
      const task = await getTaskById(request.params.id);
      if (
        !task ||
        (request.user.role !== "admin" && task.userId !== request.user.id)
      ) {
        return reply
          .code(403)
          .send(error("You don't have permission to modify this task"));
      }
      const validation = validate(updateTaskSchema, request.body);
      if (!validation.success) {
        return reply
          .code(400)
          .send({ success: false, message: validation.message });
      }
      const updated = await updateTask(request.params.id, validation.data);
      return success("Task updated", updated);
    }
  );

  // delete a task by id (only if owned by user)
  fastify.delete(
    "/tasks/:id",
    { onRequest: [authGuard] },
    async (request, reply) => {
      const task = await getTaskById(request.params.id);
      if (
        !task ||
        (request.user.role !== "admin" && task.userId !== request.user.id)
      ) {
        return reply
          .code(403)
          .send(error("You don't have permission to delete this task"));
      }
      await deleteTask(request.params.id);
      return reply.send(success("Task deleted"));
    }
  );
};
