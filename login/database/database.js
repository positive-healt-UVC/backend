// Import the SQLite library without messages
const sqlite3 = require('sqlite3').verbose();
let currentUser = null;

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
    name TEXT,
    password TEXT,
    age INTEGER,
    phoneNum TEXT,
    handicap TEXT
  )`);

  // Close the database connection
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
      resolve(rows);
    });
  });
}

/**
 * Populate the database with initial data.
 */
function populateDB() {
  // Connect to the database
  const db = connectDB();
}

/**
 * Inserts a user into the database.
 *
 * @param {Object} user - The user object to be inserted.
 * @returns {Promise<Object>} - A promise that resolves with a message indicating the success of the operation.
 * @returns {string} message - The message indicating the success of the operation.
 */
async function insertUser(user) {
  // Connect to the database
  const db = connectDB();

  // Check if the user already exists
  const existingUser = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE name = ? AND password = ?', [user.name, user.password], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });

  if (existingUser) {
    // User exists, return success response
    return { message: 'User logged in successfully' };
  }

  // Insert the user into the database
  db.run('INSERT INTO users (name, password, age, phoneNum, handicap) VALUES (?, ?, ?, ?, ?)',
    [user.name, user.password, user.age || null, user.phoneNum, user.handicap || null], // Use an array for values

    // Callback function to handle errors
    function (error) {
      if (error) {
        console.error('Error inserting user:', error);
      }

      // Close the database connection
      db.close();
    }
  );

  return { message: 'User registered successfully' };
}

/**
 * Logs in a user by checking if their username and password match the ones stored in the database.
 *
 * @param {Object} user The user object containing the username and password.
 *
 * @returns {Promise<{message: string}|{message: string, userId}>} - A promise that resolves with an object containing a success message and the user ID if the login is successful, or
 * an object containing an error message if the login is unsuccessful.
 */
async function loginUser(user) {
  // Connect to the database
  const db = connectDB();

  // Check if the user exists and the password matches
  const existingUser = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE name = ? AND password = ?', [user.username, user.password], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });

  // Close the database connection
  db.close();

  if (existingUser) {
    currentUser = existingUser.id;

    // User exists, return success response with user ID
    return { message: 'User logged in successfully', userId: existingUser.id };
  } else {
    // User does not exist or incorrect password, return error response
    return { message: 'Invalid credentials' };
  }
}

// gets current user that's logged in
function currentLoggedInUser() {
  return currentUser;
}

// Export the different parts of the modules
module.exports = {
  'connectDB': connectDB,
  'initializeDB': initializeDB,
  'populateDB': populateDB,
  'getAllUsers': getAllUsers,
  'insertUser': insertUser,
  'loginUser': loginUser,
  'currentLoggedInUser': currentLoggedInUser
};
