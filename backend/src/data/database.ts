import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use ephemeral /tmp for Vercel deployment
const isProd = process.env.VERCEL === '1';
const dbPath = isProd
    ? path.join('/tmp', 'submissions.sqlite')    // ephemeral
    : path.join(__dirname, 'submissions.sqlite'); // local persistent file

// Initialize file if it does not exist
if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '');

const db = new Database(dbPath);

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    createdAt TEXT,
    data TEXT
  )
`).run();

export default db;
