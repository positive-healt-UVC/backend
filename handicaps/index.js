// Import dependencies
const express = require('express');
const cors = require('cors');
const database = require('./data/database.js');

// Initialize the application
const app = express();

// Setup the application
app.use(cors());
app.use(express.json());

// Initialize the database
database.initializeDatabase();

// Start the server
const server = app.listen(process.env.PORT || 3015, () => {
  console.log(`🍿 Handicap service running → PORT ${server.address().port}`);
});