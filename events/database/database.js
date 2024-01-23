const sqlite3 = require('sqlite3').verbose();

/**
 * Connects to the database and returns a database instance.
 *
 * @returns {Database} The connected database instance.
 */
function connectDB() {
  try {
    const db = new sqlite3.Database('./database/events.db');
    return db;
  } catch (error) {
    console.error('Error opening database:', err);
  }
}

/**
 * Initializes the database by creating the 'events' table if it does not already exist.
 */
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
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (groupId) REFERENCES groups(id)
        );`
  );

  db.close();
}

/**
 * Retrieves all groups from the server.
 *
 * @returns {Promise<any>} A promise that resolves with the retrieved groups data.
 * @throws {Error} If there is an error during the fetch operation.
 */
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

/**
 * Retrieves all groups from the server.
 *
 * @returns {Promise<any>} A promise that resolves with the retrieved groups data.
 * @throws {Error} If there is an error during the fetch operation.
 */
async function getAllUserGroups(userId) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading groups: ", error);
  });

  try {
    const res = await fetch(`http://gateway:3000/groups/groups/user/${userId}`);
    const values = await res.json();
    return values;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}

/**
 * Retrieves all events from the database.
 *
 * @returns {Promise} A promise that resolves with an array of event objects.
 */
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

/**
 * Gets the events for the next week starting from the given day.
 *
 * @param {string} day The day to start the next week from. Should be in 'YYYY-MM-DD' format.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of events for the next week or an error.
 */
async function getNextWeekFromDay(day) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading events: ", error);
  });

  try {
    // Fetch all groups for the user
    const currentLoggedInUser = await getCurrentLoggedInUser()
    const userGroups = await getAllUserGroups(currentLoggedInUser);

    const eventsPromises = userGroups.map(async (group) => {
      const beginDate = new Date(day);
      beginDate.setDate(beginDate.getDate() + 1);
      const beginFormattedDate = beginDate.toISOString().split('T')[0];

      const endDate = new Date(beginDate);
      endDate.setDate(beginDate.getDate() + 6);
      const endFormattedDate = endDate.toISOString().split('T')[0];

      // Fetch events for each group within the specified date range
      const events = await new Promise((resolve, reject) => {
        db.all(
          'SELECT * FROM events WHERE date BETWEEN ? AND ? AND groupId = ? ORDER BY date',
          [beginFormattedDate, endFormattedDate, group.groupId],
          (error, rows) => {
            if (error) {
              reject(error);
            } else {
              resolve(rows);
            }
          }
        );
      });

      return events;
    });

    const allEvents = await Promise.all(eventsPromises);

    // Combines the array of arrays into 1 single array
    const AllEvents = allEvents.reduce((acc, events) => acc.concat(events), []);
    return AllEvents;
  } finally {
    db.close();
  }
}

/**
 * Retrieves current logged in user.
 *
 * @returns {Promise<any>} A promise that resolves with the retrieved user data.
 * @throws {Error} If there is an error during the fetch operation.
 */
async function getCurrentLoggedInUser() {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading user: ", error);
  });

  try {
    const res = await fetch(`http://gateway:3000/login/users/currentLoggedInUser`);
    const values = await res.json();
    return values;
  } catch (error) {
    console.error("Error during fetch:", error);
    throw error;
  }
}

/**
 * Retrieves an event from the database based on the provided event ID.
 *
 * @param {number} id The ID of the event to retrieve.
 * @returns {Promise<object>} A promise that resolves to the retrieved event object.
 */
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

/**
 * Inserts an event into the database.
 *
 * @param {Object} event The event object to be inserted.
 */
function insertEvent(event) {
  const db = connectDB();

  db.serialize(() => {
    const insertStmt = db.prepare(
      'INSERT INTO events (user_id, name, description, date, startingTime, endingTime, location, groupId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );

    insertStmt.run(event.user_id, event.name, event.description, event.date, event.startingTime, event.endingTime, event.location, event.groupId);

    insertStmt.finalize();
  });

  db.close();
}

/**
 * Deletes an event with the specified ID from the database.
 *
 * @param {number} id The ID of the event to be deleted.
 * @returns {Promise<object>} A promise that resolves with an object containing the result message of the deletion.
 *.
 */
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

/**
 * Updates an event in the database with the given id.
 *
 * @param {string} id The id of the event to be updated.
 * @param {Object} updatedEvent The updated event object containing the new values.
 * @returns {Promise<Object>} A Promise that resolves to a message indicating the success of the operation.
 */
async function updateEvent(id, updatedEvent) {
  const db = connectDB();

  return new Promise((resolve, reject) => {
    const updateStmt = db.prepare(`
      UPDATE events
      SET name = ?, description = ?, date = ?, startingTime = ?, endingTime = ?, location = ?, groupId = ?
      WHERE id = ?
    `);

    updateStmt.run(
      updatedEvent.name,
      updatedEvent.description,
      updatedEvent.date,
      updatedEvent.startingTime,
      updatedEvent.endingTime,
      updatedEvent.location,
      updatedEvent.groupId,
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

/**
 * Retrieves all appointments for a given user ID from the database.
 *
 * @param {number} userId The ID of the user.
 * @returns {Promise<unknown>} A promise that resolves with an array of appointment objects or rejects with an error.
 */
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
