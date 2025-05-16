const initTasksTable = require("./initTasksTable");
const initUsersTable = require("./initUsersTable");

let initialized = false;

function initDB() {

  if (initialized) {
    console.log("Database already initialized. Skipping.");
    return;
  }
  initialized = true;

  // initialize the tasks database
  initTasksTable();

  // initialize the users database
  initUsersTable();
}

module.exports = initDB;