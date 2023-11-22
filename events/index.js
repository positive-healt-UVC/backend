// Import dependencies
const express = require('express');
const cors = require('cors');
const database = require('./database/database.js');

// Initialize the application
const app = express();

// Setup the application
app.use(cors());
database.initializeDB();

// Get the data from the server
app.get('/', async (req, res) => {
  try {
    const events = await database.getAllEvents();
    console.log(events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save dummy data to the server
app.post('/populate-database', async (req, res) => {
  try {
    await database.populateDB();
    res.json({ message: 'Database populated successfully' });
  } catch (error) {
    console.error('Error populating database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3010, () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});