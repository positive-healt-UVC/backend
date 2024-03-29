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
 * If there are no items in the database,
 * the basic data is inserted.
 */
async function initializeDatabase() {
  runSqlFile('./database/create_tables.sql');

  if (!(await hasHandicaps())) {
    runSqlFile('./database/fill_tables.sql');
  }
}

/**
 * Get a list of handicaps from the database.
 * This includes all the data from the handicaps table.
 * @returns {Promise} the data from the database.
 */
function getHandicaps() {
  const database = connectDatabase();
  setError(database, 'Error getting all handicaps');

  return new Promise((resolve) => {
    database.all('SELECT * FROM handicaps', (_, rows) => {
      resolve(rows);
    })
  });
}

/**
 * Get a single handicap together with its images.
 * This is a union between the handicaps and the handicapImages table.
 * The handicap retrieved is of the given id.
 * @param {number} id the id of the handicap to retrieve
 * @returns {Promise} the data from the database. 
 */
function getHandicap(id) {
  const database = connectDatabase();
  setError(database, 'Error getting handicap');

  return new Promise((resolve) => {
    database.all(`SELECT * FROM handicaps WHERE id = ${id}`, (_, rows) => {
      resolve(rows);
    })
  });
}

/**
 * Check whether there are handicaps present in the database.
 * @returns {Promise} true if there are handicaps present, false otherwise.
 */
function hasHandicaps() {
  const database = connectDatabase();
  setError(database, 'Error checking if handicaps exist');

  return new Promise((resolve) => {
    database.all('SELECT * FROM handicaps', (_, rows) => {
      resolve(rows !== undefined && rows.length > 0);
    })
  });
}

module.exports = {
  'initializeDatabase': initializeDatabase,
  'getHandicaps': getHandicaps,
  'getHandicap': getHandicap
};
