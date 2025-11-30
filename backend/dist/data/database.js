"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isVercel = process.env.VERCEL === '1';
// const dbPath = isVercel ? path.join('/tmp', 'submissions.sqlite') : path.join(__dirname, 'submissions.sqlite');
const dbPath = path_1.default.join('/tmp', 'submissions.sqlite');
// const dbPath = path.join(__dirname, 'submissions.sqlite'); 
if (!fs_1.default.existsSync(dbPath))
    fs_1.default.writeFileSync(dbPath, '');
const db = new better_sqlite3_1.default(dbPath);
db.prepare(`
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    createdAt TEXT,
    data TEXT
  )
`).run();
exports.default = db;
