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
    const db = new sqlite3.Database('./database/register.db');
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
  db.run(`CREATE TABLE IF NOT EXISTS register (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    age INTEGER NOT NULL,
    handicap TEXT NOT NULL
  )`);

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
    db.all('SELECT * FROM register', (error, rows) => {
      console.log(rows);
      resolve(rows);
    });
  });
}


function populateDB() {
  // Connect to the database
  const db = connectDB();
}

function insertEvent(user) {
  // Connect to the database
  const db = connectDB();
  
  // Insert sample data into the "events" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO register (name, password, age, handicap) VALUES (?, ?, ?, ?)'
    );

    // Insert the event into the database
    insertStmt.run(user.name, user.password, user.age, user.handicap);

    // Finalize the insertion and inform the app
    insertStmt.finalize();
    console.log('Sample data inserted into the "register" table.');
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