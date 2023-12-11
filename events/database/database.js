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
    const db = new sqlite3.Database('./database/events.db');
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

  // Run the command
  db.run(`CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          date TEXT,
          startingTime TEXT,
          endingTime TEXT,
          location TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id));`
  );

  // Close the database connection
  console.log('Database initialized.');
  db.close();
}

/**
 * Get all the events saved into the database.
 * 
 * @returns the events present inside the database.
 */
async function getAllEvents() {
  // Connect to the database
  const db = connectDB();

  // Setup the error
  db.on("error", function(error) {
    console.log("Error reading events: ", error);
  }); 

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events', (error, rows) => {
      resolve(rows);
    });
  });
}

/**
 * Get all the events between a provided day and 7 days later.
 * The date provided is the starting day. 
 * The app looks between this day and 7 days laters for events.
 * 
 * @param day the day the application start searching from.
 * @returns the events present inside the database.
 */
function getNextWeekFromDay(day) {
  // connect to the dabatase
  const db = connectDB();

  // setup the error
  db.on("error", function (error) {
    console.log("Error reading events: ", error);
  });

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    // Get the start day of the week, make sure the week starts at a monday
    const beginDate = new Date(day);
    beginDate.setDate(beginDate.getDate() + 1)
    const beginFormattedDate = beginDate.toISOString().split('T')[0]

    // Get the final day of the week
    const endDate = new Date(beginDate);
    endDate.setDate(beginDate.getDate() + 6)
    const endFormattedDate = endDate.toISOString().split('T')[0]
    
    // Return the data from the API
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

/**
 * Get a single event from the database by id.
 * 
 * @param {number} id the id of the event you want to get.
 * @returns the event.
 */
async function getEvent(id) {
  // Connect to the database
  const db = connectDB();

  // Setup an error for when things for wrong
  db.on("error", function (error) {
    console.log("Error reading event: ", error);
  });

  // Return the data from the API
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM events WHERE id=${id}`, (errors, rows) => {
      resolve(rows);
    });

    db.close();
  })
}

/**
 * Add a single event to the database.
 * 
 * @param {object} event the event you want to add to the database.  
 */
function insertEvent(event) {
  // Connect to the database
  const db = connectDB();

  // Insert sample data into the "events" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO events (user_id, name, description, date, startingTime, endingTime, location) VALUES (?, ?, ?, ?, ?, ?)'
    );

    // Insert the event into the database
    insertStmt.run(event.user_id, event.name, event.description, event.date, event.startingTime, event.endingTime, event.location);

    // Finalize the insertion and inform the app
    insertStmt.finalize();
  });

  // Close the database connection
  db.close();
}

// Fetch appointments for a specific user
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

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'getAllEvents': getAllEvents,
  'getNextWeekFromDay': getNextWeekFromDay,
  'getEvent': getEvent,
  'insertEvent': insertEvent,
  'getAppointmentsForUser': getAppointmentsForUser
};
