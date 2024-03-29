// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const database = require('./data/database.js');


/**************
 * INITIALIZE *
 **************/

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
database.initializeDatabase();


/**********
 * ROUTES *
 **********/

app.get('/handicaps', cors(), async(request, response) => {
  const data = await performGetRequest(database.getHandicaps, response);
  setImagePaths(data, request);
  response.json(data);
});

app.get('/handicaps/:id', cors(), async(request, response) => {
  const data = await performGetRequest(() => database.getHandicap(request.params.id), response);
  setImagePaths(data, request);
  response.json(data);
});

app.get('/images/:image', cors(), async(request, response) => {
  response.sendFile(path.join(__dirname, 'public', 'images', request.params.image));
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
    return await callback();
  } catch (error) {
    console.error('Error fetching:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Set the image path for each handicap.
 * This function enables the user to request the correct image.
 * @param {Array} handicaps the list of handicaps to set the image paths for. 
 * @param {} request the request object from the original request.
 */
function setImagePaths(handicaps, request) {
  handicaps.map(handicap => {
    handicap.imagePath = `http://${request.headers.host}/handicaps/images/${handicap.imagePath}`;
  });
}