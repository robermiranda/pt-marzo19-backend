import Database from 'better-sqlite3'
import type BetterSqlite3 from 'better-sqlite3'

const db: BetterSqlite3.Database = new Database('database.db', { verbose: console.log })

const schema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );
`;

db.exec(schema)

export default db

// npm install better-sqlite3
// npm install -D @types/better-sqlite3