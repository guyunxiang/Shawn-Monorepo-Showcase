const authGuard = require("../hooks/authGuard");

module.exports = async function (fastify, opts) {
  const { getAllTasks, getTaskById } = require("../services/tasks");

  // task list page
  fastify.get("/", { onRequest: [authGuard] }, async (req, reply) => {
    const status = req.query.status || null;
    const userId = req.user.role === "admin" ? null : req.user.id;
    const tasks = await getAllTasks(null, null, userId);
    return reply.view("/src/pages/index.hbs", {
      tasks,
      selectedStatus: status,
      statusIsPending: status === "pending",
      currentUser: req.user,
    });
  });

  // login page
  fastify.get("/login", async (req, reply) => {
    return reply.view("/src/pages/login.hbs");
  });

  // add task page
  fastify.get("/tasks/new", { onRequest: [authGuard] }, async (req, reply) => {
    return reply.view("/src/pages/task.hbs");
  });

  // update task page
  fastify.get("/tasks/:id", { onRequest: [authGuard] }, async (req, reply) => {
    const task = await getTaskById(req.params.id);
    if (!task) return reply.code(404).send("Task not found");
    console.log(task);
    return reply.view("/src/pages/task.hbs", {
      task,
      statusIsPending: task.status === "pending"
    });
  });
};
