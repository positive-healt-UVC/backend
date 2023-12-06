const assert = require('assert');
const { initializeDB, getAllEvents } = require('../database/database');

describe('Database Tests', function () {
    beforeEach(() => {
        initializeDB();
    });

    test('Connect', async () => {
        const events = await getAllEvents();
        expect(Array.isArray(events)).toBe(true);
    });
});
