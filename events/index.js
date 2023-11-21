const express = require('express')
const app = express()

app.get('/', function(req, res) {
  res.send('hello world');
});

app.set('port', process.env.PORT || 3010);
const server = app.listen(app.get('port'), () => {
  console.log(`🍿 Express running → PORT ${server.address().port}`);
});