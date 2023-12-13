const sqlite3 = require('sqlite3').verbose();

function connectDB() {
  try {
    const db = new sqlite3.Database('./database/events.db');
    return db;
  } catch (error) {
    console.error('Error opening database:', err);
  }
}

function initializeDB() {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error initializing table: ", error);
  });

  db.run(`CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          date TEXT,
          startingTime TEXT,
          endingTime TEXT,
          location TEXT,
          groupId INT,
          user_id INTEGER,
          FOREIGN KEY (user_id) REFERENCES users(id)
       );`
  );

  console.log('Database initialized.');
  db.close();
}

async function getAllGroups() {
  try {
    const res = await fetch("http://gateway:3000/groups/groups/");
    const values = await res.json();
    return values;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}

async function getAllEvents() {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading events: ", error);
  });

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events', (error, rows) => {
      resolve(rows);
    });
  });
}

function getNextWeekFromDay(day) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading events: ", error);
  });

  return new Promise((resolve, reject) => {
    const beginDate = new Date(day);
    beginDate.setDate(beginDate.getDate() + 1)
    const beginFormattedDate = beginDate.toISOString().split('T')[0]

    const endDate = new Date(beginDate);
    endDate.setDate(beginDate.getDate() + 6)
    const endFormattedDate = endDate.toISOString().split('T')[0]

    db.all('SELECT * FROM events WHERE date BETWEEN ? AND ? ORDER BY date', [beginFormattedDate, endFormattedDate], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }

      db.close();
    });
  });
}

async function getEvent(id) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading event: ", error);
  });

  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM events WHERE id=${id}`, (errors, rows) => {
      resolve(rows);
    });

    db.close();
  })
}

function insertEvent(event) {
  const db = connectDB();

  db.serialize(() => {
    const insertStmt = db.prepare(
      'INSERT INTO events (user_id, name, description, date, startingTime, endingTime, location) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    insertStmt.run(event.user_id, event.name, event.description, event.date, event.startingTime, event.endingTime, event.location);

    insertStmt.finalize();
  });

  db.close();
}

async function deleteEvent(id) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error deleting event: ", error);
  });

  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM events WHERE id=${id}`, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve({ message: 'Event deleted successfully' });
      }
    });

    db.close();
  });
}

async function updateEvent(id, updatedEvent) {
  const db = connectDB();

  return new Promise((resolve, reject) => {
    const updateStmt = db.prepare(`
      UPDATE events
      SET name = ?, description = ?, date = ?, startingTime = ?, endingTime = ?, location = ?
      WHERE id = ?
    `);

    updateStmt.run(
      updatedEvent.name,
      updatedEvent.description,
      updatedEvent.date,
      updatedEvent.startingTime,
      updatedEvent.endingTime,
      updatedEvent.location,
      id,
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve({ message: 'Event updated successfully' });
        }
      }
    );

    updateStmt.finalize();
  });
}

async function getAppointmentsForUser(userId) {
  const db = connectDB();

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM appointments WHERE user_id = ?', [userId], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
}

module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'getAllGroups': getAllGroups,
  'getAllEvents': getAllEvents,
  'getNextWeekFromDay': getNextWeekFromDay,
  'getEvent': getEvent,
  'insertEvent': insertEvent,
  'deleteEvent': deleteEvent,
  'updateEvent': updateEvent,
  'getAppointmentsForUser': getAppointmentsForUser
};
