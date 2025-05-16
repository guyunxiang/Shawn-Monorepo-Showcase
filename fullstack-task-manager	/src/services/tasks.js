const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { promisify } = require("util");

// initialize the SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, "../db/database.db"));

// promisify database methods for async/await usage
const allAsync = promisify(db.all.bind(db));
const getAsync = promisify(db.get.bind(db));

// run a SQL query that returns the result of the operation (e.g., lastID, changes)
function runWithResult(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// fetch all tasks with optional sorting, status filtering, and user-specific filtering
async function getAllTasks(sort = null, statusFilter = null, userId = null) {
  let query = `
    SELECT tasks.*, users.username
    FROM tasks
    JOIN users ON tasks.userId = users.id
  `;
  const params = [];
  const conditions = [];

  // filter tasks by user id if provided
  if (userId !== null) {
    conditions.push("tasks.userId = ?");
    params.push(userId);
  }

  // filter tasks by status if provided
  if (statusFilter) {
    conditions.push("tasks.status = ?");
    params.push(statusFilter);
  }

  // add conditions to the query if any exist
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // apply sorting if specified
  if (sort === "asc") {
    query += " ORDER BY tasks.status ASC";
  } else if (sort === "desc") {
    query += " ORDER BY tasks.status DESC";
  }

  // execute the query and return the results
  return await allAsync(query, params);
}

// fetch a single task by its id
async function getTaskById(id) {
  return await getAsync("SELECT * FROM tasks WHERE id = ?", [id]);
}

// create a new task with the provided details
async function createTask({ name, description, status = "pending", userId }) {
  const result = await runWithResult(
    "INSERT INTO tasks (name, description, status, userId) VALUES (?, ?, ?, ?)",
    [name, description, status, userId]
  );
  return await getTaskById(result.lastID);
}

// update an existing task with new details
async function updateTask(id, updates) {
  const existing = await getTaskById(id);
  if (!existing) return null;

  // merge existing task details with updates
  const updated = {
    name: updates.name || existing.name,
    description: updates.description || existing.description,
    status: updates.status || existing.status,
  };

  // update the task in the database
  await runWithResult(
    "UPDATE tasks SET name = ?, description = ?, status = ? WHERE id = ?",
    [updated.name, updated.description, updated.status, id]
  );

  // return the updated task
  return await getTaskById(id);
}

// delete a task by its id
async function deleteTask(id) {
  const result = await runWithResult("DELETE FROM tasks WHERE id = ?", [id]);
  return result.changes > 0; // return true if a task was deleted
}

// export all task-related functions
module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
