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
  } catch (error) {
    console.error('Error opening database:', error);
    return null;
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

  // Setup the error
  db.on("error", function(error) {
    console.log("Error reading users: ", error);
  }); 

  // Get all the rows and return them to the application
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });

    // Don't forget to close the database connection when done
    db.close();
  });
}

async function getUserDataPerUser(id) {
  const db = connectDB();

  db.on("error", function(error) {
    console.log("Error reading users: ", error);
  });

  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE id = ?`;

    db.all(query, [id], (error, rows) => {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    });

    // Don't forget to close the database connection when done
    db.close();
  });
}

/**
 * Populate the database with initial data.
 */
function populateDB() {
  // Connect to the database
  const db = connectDB();

  // Your populate logic here

  // Close the database connection
  db.close();
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
    // User exists, return success response with user ID
    return { message: 'User logged in successfully', userId: existingUser.id };
  } else {
    // User does not exist or incorrect password, return error response
    return { message: 'Invalid credentials' };
  }
}

// Update user data by ID in the updateUser function
async function updateUser(user) {
  // Connect to the database
  const db = connectDB();

  // Check if the user already exists
  const existingUser = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [user.id], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });

  if (existingUser) {
    // User exists, update specific fields in the database
    db.run('UPDATE users SET name = ?, age = ?, handicap = ?, phoneNum = ? WHERE id = ?',
      [user.name, user.age || null, user.handicap || null, user.phoneNum, user.id],

      // Callback function to handle errors
      function (error) {
        if (error) {
          console.error('Error updating user:', error);
        }

        // Close the database connection
        db.close();
      }
    );

    return { message: 'User updated successfully' };
  } else {
    // User does not exist, return an error message
    return { message: 'User not found. Unable to update.' };
  }
}
// Export the different parts of the module
module.exports = {
  connectDB,
  initializeDB,
  populateDB,
  getAllUsers,
  getUserDataPerUser,
  insertUser,
  loginUser,
  updateUser,
};
