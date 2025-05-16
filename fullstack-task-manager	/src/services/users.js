const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { promisify } = require("util");

// initialize the SQLite database
const db = new sqlite3.Database(path.resolve(__dirname, "../db/database.db"));

// promisify database methods for async/await usage
const getAsync = promisify(db.get.bind(db));
const runAsync = promisify(db.run.bind(db));

// find a user by their username
async function findUserByUsername(username) {
  return await getAsync("SELECT * FROM users WHERE username = ?", [username]);
}

// find a user by their id
async function findUserById(id) {
  return await getAsync("SELECT * FROM users WHERE id = ?", [id]);
}

// create a new user with the provided username, hashed password, and role
async function createUser(username, hashedPassword, role = "user") {
  const result = await runAsync(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username, hashedPassword, role]
  );

  // return the newly created user
  return await findUserById(result.lastID);
}

// export all user-related functions
module.exports = {
  findUserByUsername,
  findUserById,
  createUser,
};
