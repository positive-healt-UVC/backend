const cors = require('cors')
const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/', routes.router);

app.listen(PORT, () =>{
  console.log(`🍿 Gateway running → PORT ${PORT}`);
});