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
      { name: 'Event 1', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper mollis dolor ac interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id ligula nisi. Nunc viverra velit congue nibh varius, eu rhoncus est cursus. Nunc finibus maximus enim, at blandit orci ornare nec. Nam sagittis luctus quam, a bibendum odio venenatis eget. Vestibulum fermentum ac urna vitae euismod', date: '2023-01-01', startingTime: '12:01', endingtime: '13:01', location: 'Location 1' },
      { name: 'Event 2', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ullamcorper mollis dolor ac interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras id ligula nisi. Nunc viverra velit congue nibh varius, eu rhoncus est cursus. Nunc finibus maximus enim, at blandit orci ornare nec. Nam sagittis luctus quam, a bibendum odio venenatis eget. Vestibulum fermentum ac urna vitae euismod', date: '2023-01-01', startingTime: '13:01', endingtime: '14:01', location: 'Location 2' },
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
