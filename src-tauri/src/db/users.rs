use rusqlite::{Connection, params};

pub struct UserRow {
    pub id:            i64,
    pub password_hash: String,
}

pub fn find(conn: &Connection, username: &str) -> Option<UserRow> {
    conn.query_row(
        "SELECT id, password_hash FROM users WHERE username = ?1",
        params![username],
        |row| Ok(UserRow { id: row.get(0)?, password_hash: row.get(1)? }),
    ).ok()
}

pub fn create(conn: &Connection, username: &str, password_hash: &str) -> i64 {
    conn.execute(
        "INSERT INTO users (username, password_hash) VALUES (?1, ?2)",
        params![username, password_hash],
    ).unwrap();
    conn.last_insert_rowid()
}

pub fn all_ids_and_names(conn: &Connection) -> Vec<(i64, String)> {
    let mut stmt = conn.prepare("SELECT id, username FROM users").unwrap();
    stmt.query_map([], |row| Ok((row.get::<_, i64>(0)?, row.get::<_, String>(1)?)))
        .unwrap()
        .filter_map(|r| r.ok())
        .collect()
}
