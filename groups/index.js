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
database.fillDatabase();

// Get the data from the server
app.get('/groups', cors() , async (req, res, next) => {
  try {
    const groups = await database.getAllGroups();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the data from the server
app.get('/groups/user/:id', cors() , async (req, res) => {
  try {
    const data = await database.getUsersGroups(req.params.id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching test groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/groupMembers', cors() , async (req, res, next) => {
  try {
    const groupMembers = await database.getAllGroupMembers();
    res.json(groupMembers);
  } catch (error) {
    console.error('Error fetching groupMembers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//test data
app.get('/groups/:id', async (req, res) => {
  try {
    const data = await database.getGroup(req.params.id);
    res.json(data);
  } catch (error) {
    console.error('Error fetching test groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//posting data and saving it to the server
app.post('/groups', cors(), async (req, res) => {
  try {
    const newGroupData = req.body;
    await database.insertGroup(newGroupData);
    res.status(201).json({ message: 'Group data successfully added' });
  } catch (error) {
    console.error('Error handling post request for groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a group by id
app.delete('/groups/:id', cors(), async (req, res) => {
  try {
    const groupId = req.params.id;
    
    // Call the deleteGroup function
    await database.deleteGroup(groupId);

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a group by id
app.put('/groups/:id', cors(), async (req, res) => {
  try {
    const groupId = req.params.id;
    const updatedGroupData = req.body;
    
    await database.updateGroup(groupId, updatedGroupData);

    res.status(200).json({ message: 'Group updated successfully' });
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3012, () => {
  console.log(`🍿 Groups service running → PORT ${server.address().port}`);
});

module.exports = router;
