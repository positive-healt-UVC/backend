const sqlite3 = require('sqlite3').verbose();

function connectDB() {
  const db = new sqlite3.Database('./database/events.db', (err) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to the database.');
      // Create the "events" table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          date TEXT,
          location TEXT
        )
      `, (createErr) => {
        if (createErr) {
          console.error('Error creating "events" table:', createErr);
        } else {
          console.log('Table "events" is ready.');
        }
      });
    }
  });

  return db;
}

function getAllEvents() {
  const db = connectDB();

  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM events', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        console.log(rows); // Console log the rows
        resolve(rows);
      }
    });
  });
}

const db = connectDB();

function populateDatabase() {
  // Sample data to insert
  const eventsData = [
    { name: 'Event 1', date: '2023-01-01', location: 'Location 1' },
    { name: 'Event 2', date: '2023-02-01', location: 'Location 2' },
    // Add more sample events as needed
  ];

  // Insert sample data into the "events" table
  db.serialize(() => {
    const insertStmt = db.prepare('INSERT INTO events (name, date, location) VALUES (?, ?, ?)');

    eventsData.forEach((event) => {
      insertStmt.run(event.name, event.date, event.location);
    });

    insertStmt.finalize();

    console.log('Sample data inserted into the "events" table.');

    // Close the database connection
    db.close();
  });
}

module.exports = connectDB;
module.exports = populateDatabase;
module.exports = getAllEvents;