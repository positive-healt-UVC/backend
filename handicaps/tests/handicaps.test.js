const { initializeDatabase, getHandicaps, getHandicap } = require('../data/database');

describe('Database Tests', function () {
  /** Initialize the database before running any tests. */
  beforeAll(() => {
    initializeDatabase();
  });

  /** Test whether you can get all the handicaps from the database. */
  test('Get all handicaps', async () => {
    const handicaps = await getHandicaps();
    expect(Array.isArray(handicaps)).toBe(true);
  });

  /** Test whether you can get a single handicap. */
  test('Get a single handicap', async () => {
    const handicap = await getHandicap(1);
    expect(Array.isArray(handicap)).toBe(true);
    expect(handicap.length).toBe(1);
  });
});