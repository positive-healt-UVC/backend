-- Create table handicaps
CREATE TABLE IF NOT EXISTS handicaps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    instruction TEXT NOT NULL,
    imagePath TEXT NOT NULL
);
