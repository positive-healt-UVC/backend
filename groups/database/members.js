const sqlite3 = require('sqlite3').verbose();

function connectDB() {
  try {
    const db = new sqlite3.Database('./database/allmembers.db');
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
      age INT NOT NULL,
      groupId INTEGER,
      userId INTEGER,
      FOREIGN KEY(groupId) REFERENCES groups(id),
      FOREIGN KEY(userId) REFERENCES users(id)
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

module.exports = {
  createMembersTable,
  getAllMembers,
  getMembersByGroupId
};
