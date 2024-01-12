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
app.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await database.getUserDataPerUser(userId);

    // Check if userData is not empty (user found)
    if (userData && userData.length > 0) {
      // Send the user data in the response
      res.status(200).json({ user: userData[0] });
    } else {
      // Handle case where user is not found
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
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

// Update user data by ID
app.put('/users/:id', cors(), async (req, res) => {
  try {
    const updatedUserData = req.body;
    const userId = req.params.id;

    const result = await database.updateUser({
      id: userId,
      ...updatedUserData,
    });

    if (result.message === 'User updated successfully') {
      res.status(200).json({ message: 'User data successfully updated' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error handling put request for user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3011, () => {
  // Tell the user about the state of the server 
  console.log(`🍿 Login service running → PORT ${server.address().port}`);
  
  // Initialize the database on startup
  database.initializeDB();
});
