const sqlite3 = require('sqlite3').verbose();

function connectDB() {
  try {
    const db = new sqlite3.Database('./database/members.db');
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
  }
}

function createMembersTable() {
  const db = connectDB();

  const createTable = `
    CREATE TABLE IF NOT EXISTS allmembers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INT,
      groupId INTEGER,
      userId INTEGER,
      handicapId INTEGER,
      FOREIGN KEY(groupId) REFERENCES groups(id),
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(handicapId) REFERENCES handicaps(id)
    );
  `;

  db.serialize(() => {
    db.exec(createTable, function (err) {
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

async function getAllMembers() {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading members: ", error);
  });

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM allmembers', (error, rows) => {
      resolve(rows);
    });
  });
}

async function getMembersByGroupId(groupId) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading members by groupId: ", error);
  });

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM allmembers WHERE groupId = ?', [groupId], (error, rows) => {
      resolve(rows);
    });
  });
}

/**
 * Update a member in the database by id.
 * 
 * @param {number} id - The id of the member you want to update.
 * @param {object} updatedMember - The updated member object.
 */
function updateMember(id, updatedMember) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error updating member: ", error);
  });

  db.serialize(() => {
    const updateStmt = db.prepare(
      'UPDATE allmembers SET name = ?, groupId = ?, userId = ? WHERE id = ?'
    );
    updateStmt.run(updatedMember.name, updatedMember.groupId, updatedMember.userId, id);

    updateStmt.finalize();
  });

  db.close();
}

/**
 * Delete a member from the database by id.
 * 
 * @param {number} id - The id of the member you want to delete.
 */
function deleteMember(id) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error deleting member: ", error);
  });

  db.serialize(() => {
    const deleteStmt = db.prepare('DELETE FROM allmembers WHERE id = ?');
    
    deleteStmt.run(id);

    deleteStmt.finalize();
  });

  db.close();
}


/**
 * Add a new member to the database.
 * 
 * @param {object} newMember - The new member object.
 */
async function addMember(newMember) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error adding member: ", error);
  });

  db.serialize(() => {
    const addStmt = db.prepare(
      'INSERT INTO allmembers (name, handicapId, groupId,) VALUES (?, ?, ?)'
    );
    addStmt.run(newMember.name, newMember.age, newMember.groupId, newMember.userId);

    addStmt.finalize();
  });

  db.close();
}

module.exports = {
  createMembersTable,
  getAllMembers,
  getMembersByGroupId,
  updateMember,
  deleteMember
};

