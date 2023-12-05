const assert = require('assert');
const { connectDB, initializeDB } = require('../database/database');

describe('Database Tests', function () {

    it('Database should have the "events" table', function (done) {
        initializeDB();
        const db = connectDB();

        // Query to check if the "events" table exists
        db.all("PRAGMA table_info(events)", function (error, columns) {
            if (error) {
                done(error);
            } else {
                // Check if there are columns, indicating that the table exists
                assert.ok(columns && columns.length > 0, 'Expected "events" table to exist and has ', columns.length, ' columns');
                done();
            }

            db.close();
            });
    });

});
