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
  db.on("error", function(error) {
    console.log("Error initializing table: ", error);
  }); 

  // Run the command
  db.run(`CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          date TEXT,
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
async function getAllEvents() {
  // Connect to the database
  const db = connectDB();
  const results = []

  // Setup the error
  db.on("error", function(error) {
    console.log("Error reading events: ", error);
  }); 

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events', (error, rows) => {
      console.log(rows);
      resolve(rows);
    });
  });
}


function populateDB() {
  // Connect to the database
  const db = connectDB();

  // Create some sample data to insert to the database
  const eventsData = [
    { name: 'Event 1', date: '2023-01-01', location: 'Location 1' },
    { name: 'Event 2', date: '2023-02-01', location: 'Location 2' },
  ];

  // Insert sample data into the "events" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO events (name, date, location) VALUES (?, ?, ?)'
    );

    // Go over all events and insert them to the database
    eventsData.forEach((event) => {
      insertStmt.run(event.name, event.date, event.location);
    });

    // Finalize the insertion and inform the app
    insertStmt.finalize();
    console.log('Sample data inserted into the "events" table.');
  });

  // Close the database connection
  db.close();
}

// Export the different parts of the modules
module.exports = {
  'initializeDB': initializeDB,
  'populateDB': populateDB,
  'getAllEvents': getAllEvents
};