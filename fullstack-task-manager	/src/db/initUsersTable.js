const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

// define user data to insert
const users = [
  {
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
  { username: "user", password: bcrypt.hashSync("user123", 10), role: "user" },
];

function initUsers() {
  const db = new sqlite3.Database(path.resolve(__dirname, "database.db"));

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL
      );
    `);

    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
      if (err) return console.error("User count check error:", err);
      if (row.count === 0) {
        const stmt = db.prepare(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)"
        );
        users.forEach((user) => {
          stmt.run(user.username, user.password, user.role);
        });
        stmt.finalize(() => {
          console.log("Users table initialized with sample data.");
          db.close();
        });
      } else {
        console.log("Users table already initialized. Skipping.");
        db.close();
      }
    });
  });
}

module.exports = initUsers;
