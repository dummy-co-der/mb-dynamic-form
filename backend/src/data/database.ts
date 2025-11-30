import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1';
// const dbPath = isVercel ? path.join('/tmp', 'submissions.sqlite') : path.join(__dirname, 'submissions.sqlite');
const dbPath = path.join('/tmp', 'submissions.sqlite');
// const dbPath = path.join(__dirname, 'submissions.sqlite'); 

if (!fs.existsSync(dbPath)) fs.writeFileSync(dbPath, '');

const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    createdAt TEXT,
    data TEXT
  )
`).run();

export default db;
