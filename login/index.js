// Import necessary modules
const express = require('express');
const cors = require('cors');
const database  = require('./database/database');

// Initialize the application
const app = express();

// Setup CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

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
    const users = await database.getAllUsers();
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
app.post('/users', cors(), async (req, res) => {
  try {
    const newUserData = req.body;
    await database.insertUser(newUserData);
    res.status(201).json({ message: 'User data successfully added' });
  } catch (error) {
    console.error('Error handling post request for user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Modify the route to handle login
app.post('/users/login', cors(), async (req, res) => {
  try {
    const userCredentials = req.body;
    const loginResult = await database.loginUser(userCredentials);
    
    res.json(loginResult);
  } catch (error) {
    console.error('Error handling login request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3011, () => {
  // Tell the user about the state of the server 
  console.log(`🍿 Express running → PORT ${server.address().port}`);
  
  // Initialize the database on startup
  database.initializeDB();
});
