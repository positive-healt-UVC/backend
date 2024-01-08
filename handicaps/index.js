// Import dependencies
const express = require('express');
const cors = require('cors');
const database = require('./data/database.js');


/**************
 * INITIALIZE *
 **************/
const app = express();
app.use(cors());
app.use(express.json());
database.initializeDatabase();


/**********
 * ROUTES *
 **********/
app.get('/handicaps', cors(), async(_, response) => {
  performGetRequest(database.getHandicaps(), response);
});

app.get('/handicaps/:id', cors(), async(request, response) => {
  performGetRequest(() => database.getHandicap(request.params.id), response);
});


/**********
 * SERVER *
 **********/
const server = app.listen(process.env.PORT || 3015, () => {
  console.log(`🍿 Handicap service running → PORT ${server.address().port}`);
});

/**
 * Handle a get request.
 * @param {*} callback the function to call that gets the data from the database. 
 * @param {*} response the response object from the original request.
 */
async function performGetRequest(callback, response) {
  try {
    const data = await callback();
    response.json(data);
  } catch (error) {
    console.error('Error fetching:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};