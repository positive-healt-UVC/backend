const { initializeDB, getAllEvents } = require('../database/database');

describe('Database Tests', function () {
    test('Connect', () => {
        initializeDB();
        const events = getAllEvents();

        expect(typeof events).toBe('object');
    })
});
