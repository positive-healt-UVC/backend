// Import dependencies
const express = require('express');
const cors = require('cors');
const database = require("./database/database");
const console = require("console");
const router = express.Router();
const membersDatabase = require('./database/members');

// Initialize the application
const app = express();

// Setup the application
app.use(cors());
app.use(express.json());
database.fillDatabase();
membersDatabase.createMembersTable();

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

// Get a group with all it's members
app.get('/groups/with-members/:id', cors(), async (req, res) => {
  try {
      const group = await database.getGroup(req.params.id);
      const groupMembers = await database.getGroupMembers(req.params.id);
      group.members = await database.getUsers(groupMembers.map((member) => member.userId))
      res.json(group);
    } catch (error) {
      console.error('Error fetching groupMembers:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
})

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

// Get all members
app.get('/members', cors(), async (req, res) => {
  try {
    const members = await membersDatabase.getAllMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get members by groupId
app.get('/members/group/:groupId', cors(), async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const members = await membersDatabase.getMembersByGroupId(groupId);
    res.json(members);
  } catch (error) {
    console.error('Error fetching members by groupId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a member by id
app.delete('/members/:id', cors(), async (req, res) => {
  try {
    const memberId = req.params.id;
    
    // Call the deleteMember function
    await membersDatabase.deleteMember(memberId);

    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update a member by id
app.put('/members/:id', cors(), async (req, res) => {
  try {
    const memberId = req.params.id;
    const updatedMemberData = req.body;

    await membersDatabase.updateMember(memberId, updatedMemberData);

    res.status(200).json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new member
app.post('/members', cors(), async (req, res) => {
  try {
    const newMember = req.body;
    await membersDatabase.addMember(newMember);
    res.status(201).json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(process.env.PORT || 3012, () => {
  console.log(`🍿 Groups service running → PORT ${server.address().port}`);
});

module.exports = router;
