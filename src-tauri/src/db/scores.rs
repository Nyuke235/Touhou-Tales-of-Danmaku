use rusqlite::{Connection, params};

const MAX_SCORES_PER_USER: i64 = 200;

pub fn insert(conn: &Connection, user_id: i64, score: i64, stage: i64, date: i64, slow: f64) -> bool {
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM scores WHERE user_id = ?1", params![user_id], |row| row.get(0))
        .unwrap_or(0);
    if count >= MAX_SCORES_PER_USER {
        return false;
    }
    conn.execute(
        "INSERT INTO scores (user_id, score, stage, date, slow) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![user_id, score, stage, date, slow],
    ).unwrap();
    true
}

pub fn for_user(conn: &Connection, user_id: i64) -> Vec<serde_json::Value> {
    let mut stmt = conn
        .prepare("SELECT score, stage, date, slow FROM scores WHERE user_id = ?1 ORDER BY score DESC")
        .unwrap();
    stmt.query_map(params![user_id], |row| {
        Ok(serde_json::json!({
            "score": row.get::<_, i64>(0)?,
            "stage": row.get::<_, i64>(1)?,
            "date":  row.get::<_, i64>(2)?,
            "slow":  row.get::<_, f64>(3)?,
        }))
    })
    .unwrap()
    .filter_map(|r| r.ok())
    .collect()
}
