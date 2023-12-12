// Import dependencies
const express = require('express');
const cors = require('cors');
const database = require('./database/database.js');
const router = express.Router();

// Initialize the application
const app = express();

// Setup the application
app.use(cors());
app.use(express.json());
database.initializeDB();

app.get('/groups', cors() , async (req, res, next) => {
  try {
    const events = await database.getAllGroups();
    console.log(events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the data from the server
app.get('/events', cors() , async (req, res, next) => {
  try {
    const events = await database.getAllEvents();
    console.log(events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the data between a day and 7 days
app.get('/events/date/:day', cors(), async (req, res) => {
  try {
    const day = req.params.day;
    const events = await database.getNextWeekFromDay(day);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//test data
app.get('/events/:id', async (req, res) => {
  try {
    const data = await database.getEvent(req.params.id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching test events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Posting data and saving it to the server
app.post('/events', cors(), async (req, res) => {
  try {
    const newEventData = req.body;
    await database.insertEvent(newEventData);
    res.status(201).json({ message: 'Event data successfully added' });
  } catch (error) {
    console.error('Error handling post request for events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
const server = app.listen(process.env.PORT || 3010, () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});

module.exports = router;
