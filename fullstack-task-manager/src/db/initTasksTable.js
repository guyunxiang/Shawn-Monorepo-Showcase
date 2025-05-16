const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// define task data to insert
const tasks = [
  {
    id: 1,
    name: "Task 1",
    description: "Description for Task 1",
    status: "pending",
    userId: 1,
  },
  {
    id: 2,
    name: "Task 2",
    description: "Description for Task 2",
    status: "completed",
    userId: 1,
  },
  {
    id: 3,
    name: "Write Report",
    description: "Complete the monthly sales report",
    status: "pending",
    userId: 1,
  },
  {
    id: 4,
    name: "Email Client",
    description: "Follow up with the client about the design approval",
    status: "completed",
    userId: 2,
  },
  {
    id: 5,
    name: "Team Meeting",
    description: "Discuss Q3 goals with the team",
    status: "pending",
    userId: 2,
  },
  {
    id: 6,
    name: "Fix Bug #122",
    description: "Resolve login redirect issue",
    status: "completed",
    userId: 2,
  },
  {
    id: 7,
    name: "Code Review",
    description: "Review pull requests on GitHub",
    status: "pending",
    userId: 2,
  },
  {
    id: 8,
    name: "Design Banner",
    description: "Create a new banner for the landing page",
    status: "completed",
    userId: 1,
  },
];

function initTasks() {
  const db = new sqlite3.Database(path.resolve(__dirname, "database.db"));

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
        userId INTEGER
      );
    `);

    db.get("SELECT COUNT(*) AS count FROM tasks", (err, row) => {
      if (err) return console.error("Count check error:", err);
      if (row.count === 0) {
        const stmt = db.prepare(
          `INSERT INTO tasks (id, name, description, status, userId) VALUES (?, ?, ?, ?, ?)`
        );
        tasks.forEach((task) => {
          stmt.run(
            task.id,
            task.name,
            task.description,
            task.status,
            task.userId
          );
        });
        stmt.finalize(() => {
          console.log("Tasks table initialized with sample data.");
          db.close();
        });
      } else {
        db.close(); 
        console.log("Tasks table already initialized. Skipping.");
      }
    });
  });
}

module.exports = initTasks;
