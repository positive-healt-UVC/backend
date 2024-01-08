const sqlite3 = require('sqlite3').verbose();
const fileSystem = require('fs');

/**
 * Connects to the database and returns a database instance.
 * @returns {Database} The connected database instance.
 */
function connectDatabase() {
  try {
    const database = new sqlite3.Database('./database/handicaps.db');
    return database;
  } catch (error) {
    console.error('Error opening database:', err);
  }
}

/**
 * Set the error handler for the database.
 * @param {Database} database the instance of the database to set the error on. 
 * @param {string} errorMessage the message to print when the error occurs.
 */
function setError(database, errorMessage) {
  database.on("error", function (error) {
    console.log(errorMessage, '\n', error);
  });
}

/**
 * Run an SQL file on the database.
 * @param {string} filename The path to the file to run. 
 */
function runSqlFile(filename) {
  const database = connectDatabase();
  const sql = fileSystem.readFileSync(filename).toString();

  setError(database, 'Error running SQL file: ');
  database.exec(sql);
  database.close();
}

/**
 * Initializes the database.
 * The function makes sure that the database file exists,
 * including the required tables for operation.
 */
function initializeDatabase() {
  runSqlFile('./database/create_tables.sql');
}

module.exports = {
  'initializeDatabase': initializeDatabase
};
