const cors = require('cors')
const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = 3000;

app.use(cors());
app.use(express.json());
// app.get('/', function(req, res) {
  //   res.send('hello world');
  // })
app.use('/', routes)


app.listen(PORT, () =>{
  console.log(`Gateway has started on ${PORT}`);
})