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
    { name: 'Event 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper mollis dolor ac interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id ligula nisi. Nunc viverra velit congue nibh varius, eu rhoncus est cursus. Nunc finibus maximus enim, at blandit orci ornare nec. Nam sagittis luctus quam, a bibendum odio venenatis eget. Vestibulum fermentum ac urna vitae euismod', date: '2023-01-01', startingTime: '12:01', endingTime: '13:01', location: 'Location 1' },
    { name: 'Event 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper mollis dolor ac interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id ligula nisi. Nunc viverra velit congue nibh varius, eu rhoncus est cursus. Nunc finibus maximus enim, at blandit orci ornare nec. Nam sagittis luctus quam, a bibendum odio venenatis eget. Vestibulum fermentum ac urna vitae euismod', date: '2023-01-01', startingTime: '13:01', endingTime: '14:01', location: 'Location 2' },
  ];

  // Insert sample data into the "events" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO events (name, description, date, startingTime, endingTime, location) VALUES (?, ?, ?, ?, ?, ?)'
    );

    // Go over all events and insert them to the database
    eventsData.forEach((event) => {
      insertStmt.run(event.name, event.description, event.date, event.startingTime, event.endingTime, event.location);
    });

    // Finalize the insertion and inform the app
    insertStmt.finalize();
    console.log('Sample data inserted into the "events" table.');
  });

  // Close the database connection
  db.close();
}

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
    console.log('Sample data inserted into the "events" table.');
  });

  // Close the database connection
  db.close();
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'populateDB': populateDB,
  'getAllEvents': getAllEvents,
  'insertEvent': insertEvent
};