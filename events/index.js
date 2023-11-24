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

app.options('/events', (req, res, next) => {
  try {
    //set header before response
    res.header({
      allow: 'GET, POST, OPTIONS',
      'Content-type': 'application/json',
      Data: Date.now(),
      'Content-length': 0,
    });
    //response
    res.sendStatus(200);
  } catch (err) {
    next(err);
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

//test data
app.get('/events/test', async (req, res) => {
  try {
    const testData = [
      { id: 1, name: 'Test Event 1', date: '2023-03-01', location: 'Test Location 1' },
      { id: 2, name: 'Test Event 2', date: '2023-03-15', location: 'Test Location 2' },
    ];

    console.log('Test Data:', testData);
    res.json(testData);
  } catch (error) {
    console.error('Error fetching test events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/events', cors(), async (req, res) => {
  try {
    const newEventData = req.body;
    // res.send(req.body);
    console.log(req);
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
