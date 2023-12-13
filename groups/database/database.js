// Import the SQLite library without messages
const sqlite3 = require('sqlite3').verbose();

/**
 * Connect to the database.
 * 
 * @returns the database object to use, null on error.
 */
function connectDB() {
  // Try to connect to the database and return the object
  try {
    const db = new sqlite3.Database('./database/groups.db');
    return db;
  }

  // Whenever there is an error opening the database, show it in the console
  catch (error) {
    console.error('Error opening database:', err);
  }
}

/** Initialize the database */
function initializeDB() {
  // Connect to the database
  const db = connectDB();

  // Setup the error
  db.on("error", function (error) {
    console.log("Error initializing table: ", error);
  });
  // Close the database connection
  console.log('Database initialized.');
  db.close();
}

function fillDatabase() {
  const db = connectDB();

  const createTable1 =
    `CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    carer INT NOT NULL  
  );`
    ;

  const createTable2 = `
      CREATE TABLE IF NOT EXISTS groupMembers (
      groupId INTEGER NOT NULL,
      userId INTEGER NOT NULL
      );
  `;

  db.serialize(() => {
    db.exec(createTable1, function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table 1 created successfully');
      }
    });

    db.exec(createTable2, function (err) {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Table 2 created successfully');
      }

      db.close((err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Database connection closed');
        }
      });
    });
  });
}

/**
 * Get all the group saved into the database.
 * 
 * @returns the group present inside the database.
 */
async function getAllGroups() {
  // Connect to the database
  const db = connectDB();

  // Setup the error
  db.on("error", function (error) {
    console.log("Error reading groups: ", error);
  });

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM groups', (error, rows) => {
      console.log(rows);
      resolve(rows);
    });
  });
}

/**
 * Get all the groupMembers saved into the database.
 * 
 * @returns the groupMembers present inside the database.
 */
async function getAllGroupMembers() {
  // Connect to the database
  const db = connectDB();

  // Setup the error
  db.on("error", function (error) {
    console.log("Error reading groupMembers: ", error);
  });

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM groupMembers', (error, rows) => {
      console.log(rows);
      resolve(rows);
    });
  });
}
/**
 * Get a single event from the database by id.
 * 
 * @param {number} id the id of the event you want to get.
 * @returns the event.
 */
async function getGroup(id) {
  // Connect to the database
  const db = connectDB();

  // Setup an error for when things for wrong
  db.on("error", function (error) {
    console.log("Error reading group: ", error);
  });

  // Return the data from the API
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM groups WHERE id=${id}`, (errors, rows) => {
      resolve(rows);
    });

    db.close();
  })
}

/**
 * Add a single event to the database.
 * 
 * @param {object} group the group you want to add to the database.  
 */
function insertGroup(group) {
  // Connect to the database
  const db = connectDB();

  // Insert sample data into the "events" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO groups (carer, name) VALUES (?, ?)'
    );

    // Insert the event into the database
    insertStmt.run(group.carer, group.name);

    // Finalize the insertion and inform the app
    insertStmt.finalize();
  });

  // Close the database connection
  db.close();
}

function getUserGroups(userId) {
  // Connect to the database
  const db = connectDB();

  // Setup an error for when things for wrong
  db.on("error", function (error) {
    console.log("Error reading user group: ", error);
  });

  // Return the data from the API
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM groups, groupMembers WHERE userId=${userId} and groupId=id;`, (errors, rows) => {
      resolve(rows);
    });

    db.close();
  })
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'getAllGroups': getAllGroups,
  'getGroup': getGroup,
  'getAllGroupMembers': getAllGroupMembers,
  'insertGroup': insertGroup,
  'fillDatabase': fillDatabase,
  'getUsersGroups': getUserGroups
};