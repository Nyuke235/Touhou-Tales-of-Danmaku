import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server', 'data', 'game.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
	CREATE TABLE IF NOT EXISTS users (
		id       INTEGER PRIMARY KEY,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL
	);

	CREATE TABLE IF NOT EXISTS settings (
		user_id    INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
		controls   TEXT,
		music_vol  REAL NOT NULL DEFAULT 0.7,
		sfx_vol    REAL NOT NULL DEFAULT 0.8
	);

	CREATE TABLE IF NOT EXISTS scores (
		id      INTEGER PRIMARY KEY,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		score   INTEGER NOT NULL,
		stage   INTEGER NOT NULL,
		date    INTEGER NOT NULL,
		slow    REAL NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_scores_user ON scores(user_id);

	CREATE TABLE IF NOT EXISTS sessions (
		token      TEXT PRIMARY KEY,
		user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		created_at INTEGER NOT NULL
	);
`);

export default db;
