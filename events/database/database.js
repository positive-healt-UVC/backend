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
          location TEXT);`
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
function getAllEvents(selectedDay) {
  const db = connectDB();

  db.on("error", function (error) {
    console.log("Error reading events: ", error);
  });

  return new Promise((resolve, reject) => {
    const endDate = new Date(selectedDay);
    endDate.setDate(endDate.getDate() + 7);

    // Set the default year to 2023
    const defaultYear = 2023;
    const selectedDate = new Date(selectedDay);
    selectedDate.setFullYear(defaultYear);
    endDate.setFullYear(defaultYear);

    const formattedSelectedDay = formatDate(selectedDate);
    const formattedEndDate = formatDate(endDate);

    db.all('SELECT * FROM events WHERE date BETWEEN ? AND ?', [formattedSelectedDay, formattedEndDate], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }

      db.close();
    });
  });
}

function formatDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  let month = (formattedDate.getMonth() + 1).toString();
  let day = formattedDate.getDate().toString();

  month = month.length === 1 ? '0' + month : month;
  day = day.length === 1 ? '0' + day : day;

  return `${year}-${month}-${day}`;
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
      'INSERT INTO events (name, description, date, startingTime, endingTime, location) VALUES (?, ?, ?, ?, ?, ?)'
    );

    // Insert the event into the database
    insertStmt.run(event.name, event.description, event.date, event.startingTime, event.endingTime, event.location);

    // Finalize the insertion and inform the app
    insertStmt.finalize();
  });

  // Close the database connection
  db.close();
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'getAllEvents': getAllEvents,
  'getEvent': getEvent,
  'insertEvent': insertEvent
};