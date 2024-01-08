-- Create table handicaps
CREATE TABLE IF NOT EXISTS handicaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    instruction TEXT NOT NULL
);

-- Create table handicapImages
CREATE TABLE IF NOT EXISTS handicapImages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    handicap INTEGER NOT NULL,
    path TEXT NOT NULL,
    alt TEXT NOT NULL,
    FOREIGN KEY(handicap) REFERENCES handicaps(id)
);
