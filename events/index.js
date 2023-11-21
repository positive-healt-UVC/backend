const express = require('express')
const app = express()
const cors = require('cors');
const connectDB = require('./adapter/db.js')
const db = connectDB();

// Enable CORS
app.use(cors());

app.get('/', function(req, res) {
  res.send(db);
});

const getAllEvents = require('./adapter/db.js');
const populateDatabase = require('./adapter/db.js');

app.get('/1', function(req, res) {
  populateDatabase();
  res.send(getAllEvents());
});

app.set('port', process.env.PORT || 3010);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});