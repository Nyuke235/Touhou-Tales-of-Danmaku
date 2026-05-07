pub mod scores;
pub mod settings;
pub mod users;

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
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY,
            username      TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
            user_id   INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            controls  TEXT,
            music_vol REAL NOT NULL DEFAULT 0.7,
            sfx_vol   REAL NOT NULL DEFAULT 0.8
        );
        CREATE TABLE IF NOT EXISTS scores (
            id      INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            score   INTEGER NOT NULL,
            stage   INTEGER NOT NULL,
            date    INTEGER NOT NULL,
            slow    REAL NOT NULL
        );
    ").expect("failed to initialize schema");
    conn
}
