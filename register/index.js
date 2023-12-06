// Import necessary modules
const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Import database-related logic
const sqlite3 = require('sqlite3').verbose();

// Connect to the database
function connectDB() {
  try {
    const db = new sqlite3.Database('./database/register.db');
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

  // Run the command to create the "register" table if not exists
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

// Get all events from the database
function getAllEvents() {
  const db = connectDB();

  // Setup error handling
  db.on("error", function(error) {
    console.log("Error reading events: ", error);
  }); 

  // Get all rows from the "register" table and return them
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM register', (error, rows) => {
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

// Insert an event into the "register" table
function insertEvent(user) {
  const db = connectDB();
  
  // Insert user data into the "register" table
  db.serialize(() => {
    const insertStmt = db.prepare(
      'INSERT INTO register (name, password, age, handicap) VALUES (?, ?, ?, ?)'
    );

    // Insert user data into the database
    insertStmt.run(user.name, user.password, user.age, user.handicap);

    // Finalize the insertion
    insertStmt.finalize();
    console.log('User data inserted into the "register" table.');
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

// Get all user data from the "register" table
app.get('/register', cors(), async (req, res, next) => {
  try {
    const users = await getAllEvents();
    res.json(users);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Test data endpoint
app.get('/register/test', async (req, res) => {
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
app.post('/register', cors(), async (req, res) => {
  try {
    const newUserData = req.body;
    await insertEvent(newUserData);
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
    url: 'http://register:3011/register',
    headers: { 'Content-Type': 'application/json' },
    data: {
      apiName: "register",
      protocol: "http",
      host: 'register',
      port: 3011,
    }
  }).then((response) => {
    console.log(response.data);
  });

  console.log(`🍿 Express running → PORT ${server.address().port}`);
});
