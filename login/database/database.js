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
    const db = new sqlite3.Database('./database/users.db');
    return db;
  } 
  
  // Whenever there is an error opening the database, show it in the console
  catch (error) {
    console.error('Error opening database:', error);
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
  db.run(`CREATE TABLE IF NOT EXISTS users (
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
 * Get all the users saved into the database.
 * 
 * @returns the users present inside the database.
 */
async function getAllUsers() {
  // Connect to the database
  const db = connectDB();
  const results = []

  // Setup the error
  db.on("error", function(error) {
    console.log("Error reading users: ", error);
  }); 

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (error, rows) => {
      console.log(rows);
      resolve(rows);
    });
  });
}


function populateDB() {
  // Connect to the database
  const db = connectDB();
}

function insertUser(user) {
  // Connect to the database
  const db = connectDB();
  
  // Insert sample data into the "users" table
  db.serialize(() => {
    // Create a template string for the database
    const insertStmt = db.prepare(
      'INSERT INTO users (name, password, age, handicap) VALUES (?, ?, ?, ?)'
    );

    // Insert the user into the database
    insertStmt.run(user.name, user.password, user.age, user.handicap);

    // Finalize the insertion and inform the app
    insertStmt.finalize();
    console.log('Sample data inserted into the "users" table.');
  });

  // Close the database connection
  db.close();
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'populateDB': populateDB,
  'getAllUsers': getAllUsers,
  'insertUser': insertUser
};
