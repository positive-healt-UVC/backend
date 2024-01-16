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

/**
 * Fills the database with the necessary tables and initial data.
 */
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
      }
    });

    db.exec(createTable2, function (err) {
      if (err) {
        console.error(err.message);
      }

      db.close((err) => {
        if (err) {
          console.error(err.message);
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
      resolve(rows);
    });
  });
}

/**
 * Retrieves users based on their ids.
 *
 * @param {Array<number>} ids An array of user ids.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects that match the given ids.
 */
async function getUsers(ids) {
  let users = await fetch("http://login:3011/users");
  users = await users.json();
  return users.filter((user) => ids.includes(user.id));
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

/**
 * Fetches the user groups for a given user.
 *
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of user groups.
 */
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

/**
 * Delete a group from the database by id.
 * 
 * @param {number} id - The id of the group you want to delete.
 */
function deleteGroup(id) {
  // Connect to the database
  const db = connectDB();

  // Setup an error for when things go wrong
  db.on("error", function (error) {
    console.log("Error deleting group: ", error);
  });

  // Delete the group from the database
  db.serialize(() => {
    const deleteStmt = db.prepare('DELETE FROM groups WHERE id = ?');
    
    // Execute the deletion
    deleteStmt.run(id);

    // Finalize the deletion
    deleteStmt.finalize();
  });

  // Close the database connection
  db.close();
}

/**
 * Update a group in the database by id.
 * 
 * @param {number} id - The id of the group you want to update.
 * @param {object} updatedGroup - The updated group object.
 */
function updateGroup(id, updatedGroup) {
  // Connect to the database
  const db = connectDB();

  // Setup an error for when things go wrong
  db.on("error", function (error) {
    console.log("Error updating group: ", error);
  });

  // Update the group in the database
  db.serialize(() => {
    const updateStmt = db.prepare(
      'UPDATE groups SET carer = ?, name = ? WHERE id = ?'
    );

    // Execute the update
    updateStmt.run(updatedGroup.carer, updatedGroup.name, id);

    // Finalize the update
    updateStmt.finalize();
  });

  // Close the database connection
  db.close();
}

async function getGroupMembers(groupId) {
  // Connect to the database
  const db = connectDB();

  // Setup the error
  db.on("error", function (error) {
    console.log("Error reading groupMembers: ", error);
  });

  // Get all the rows for the specified groupId and return them to the application
  return new Promise((resolve, reject) => {
    db.all(`SELECT userId FROM groupMembers WHERE groupId = ${groupId};`, (error, rows) => {
      resolve(rows);
    });
  });
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'getAllGroups': getAllGroups,
  'getGroup': getGroup,
  'getGroupMembers': getGroupMembers,
  'getUsers': getUsers,
  'insertGroup': insertGroup,
  'fillDatabase': fillDatabase,
  'getUsersGroups': getUserGroups,
  'deleteGroup': deleteGroup,
  'updateGroup': updateGroup,
};