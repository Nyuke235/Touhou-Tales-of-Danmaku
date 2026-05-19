import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server', 'data', 'game.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
	DROP TABLE IF EXISTS settings;
	DROP TABLE IF EXISTS sessions;
	DROP TABLE IF EXISTS scores;
	DROP TABLE IF EXISTS users;

	CREATE TABLE IF NOT EXISTS scores (
		id    INTEGER PRIMARY KEY,
		name  TEXT NOT NULL,
		score INTEGER NOT NULL,
		stage INTEGER NOT NULL,
		date  INTEGER NOT NULL,
		slow  REAL NOT NULL
	);

	CREATE INDEX IF NOT EXISTS idx_scores_name ON scores(name);
	CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
`);

export default db;
