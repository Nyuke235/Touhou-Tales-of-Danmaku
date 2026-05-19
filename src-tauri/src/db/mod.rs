pub mod scores;

use rusqlite::Connection;
use std::fs;
use std::sync::Mutex;

pub struct AppDb(pub Mutex<Connection>);

pub fn open(app: &tauri::AppHandle) -> Connection {
    use tauri::Manager;
    let dir = app.path().app_data_dir().expect("no app data dir");
    fs::create_dir_all(&dir).ok();
    let conn = Connection::open(dir.join("game.db")).expect("failed to open database");
    conn.execute_batch("
        PRAGMA journal_mode = WAL;
        PRAGMA foreign_keys = ON;
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
    ").expect("failed to initialize schema");
    conn
}
