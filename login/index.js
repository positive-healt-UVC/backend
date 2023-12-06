// Import necessary modules
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Import database-related logic
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
function connectDB() {
  try {
    const db = new sqlite3.Database('./database/users.db'); // Change to "users.db"
    return db;
  } catch (error) {
    console.error('Error opening database:', error);
  }
}

// Initialize the database
function initializeDB() {
  const db = connectDB();

  // Setup error handling
  db.on("error", function(error) {
    console.log("Error initializing table: ", error);
  }); 

  // Run the command to create the "users" table if not exists
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

// Get all users from the database
function getAllUsers() {
  const db = connectDB();

  // Setup error handling
  db.on("error", function(error) {
    console.log("Error reading users: ", error);
  }); 

  // Get all rows from the "users" table and return them
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', (error, rows) => { // Change to "users"
      console.log(rows);
      resolve(rows);
    });
  });
}

// Populate the database with dummy data
function populateDB() {
  const db = connectDB();
  // Your logic for populating the database
}

// Insert a user into the "users" table
function insertUser(user) {
  const db = connectDB();
  
  // Insert user data into the "users" table
  db.serialize(() => {
    const insertStmt = db.prepare(
      'INSERT INTO users (name, password, age, handicap) VALUES (?, ?, ?, ?)'
    );

    // Insert user data into the database
    insertStmt.run(user.name, user.password, user.age, user.handicap);

    // Finalize the insertion
    insertStmt.finalize();
    console.log('User data inserted into the "users" table.');
  });

  // Close the database connection
  db.close();
}

// Initialize the application
const app = express();

// Setup CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Initialize the database on startup
initializeDB();

// Save dummy data to the server
app.post('/populate-database', async (req, res) => {
  try {
    await populateDB();
    res.json({ message: 'Database populated successfully' });
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all user data from the "users" table
app.get('/users', cors(), async (req, res, next) => { // Change to "/users"
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Test data endpoint
app.get('/users/test', async (req, res) => { // Change to "/users/test"
  try {
    const testData = [
      // Your test data
    ];

    console.log('Test Data:', testData);
    res.json(testData);
  } catch (error) {
    console.error('Error fetching test data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register a new user
app.post('/users', cors(), async (req, res) => { // Change to "/users"
  try {
    const newUserData = req.body;
    await insertUser(newUserData);
    res.status(201).json({ message: 'User data successfully added' });
  } catch (error) {
    console.error('Error handling post request for user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3011, () => {
  // Send a registration request to another service (if needed)
  axios({
    method: 'POST',
    url: 'http://login:3011/users', // Change to "/users"
    headers: { 'Content-Type': 'application/json' },
    data: {
      apiName: "users",
      protocol: "http",
      host: 'login',
      port: 3011,
    }
  }).then((response) => {
    console.log(response.data);
  });

  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
