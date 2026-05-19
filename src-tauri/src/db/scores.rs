use rusqlite::{Connection, params};

const MAX_TOTAL_SCORES: i64 = 10_000;

pub fn insert(conn: &Connection, name: &str, score: i64, stage: i64, date: i64, slow: f64) {
    let count: i64 = conn
        .query_row("SELECT COUNT(*) FROM scores", [], |row| row.get(0))
        .unwrap_or(0);
    if count >= MAX_TOTAL_SCORES {
        let to_delete = count - MAX_TOTAL_SCORES + 1;
        conn.execute(
            "DELETE FROM scores WHERE id IN (SELECT id FROM scores ORDER BY id ASC LIMIT ?1)",
            params![to_delete],
        ).ok();
    }
    conn.execute(
        "INSERT INTO scores (name, score, stage, date, slow) VALUES (?1, ?2, ?3, ?4, ?5)",
        params![name, score, stage, date, slow],
    ).unwrap();
}

pub fn leaderboard(conn: &Connection) -> Vec<serde_json::Value> {
    let mut stmt = conn.prepare("
        SELECT name, score, stage, date, slow
        FROM scores s
        WHERE slow <= 5
          AND score = (
                SELECT MAX(score) FROM scores s2
                WHERE s2.name = s.name AND s2.slow <= 5
          )
        GROUP BY name
        ORDER BY score DESC
        LIMIT 10
    ").unwrap();
    stmt.query_map([], |row| {
        Ok(serde_json::json!({
            "name":  row.get::<_, String>(0)?,
            "score": row.get::<_, i64>(1)?,
            "stage": row.get::<_, i64>(2)?,
            "date":  row.get::<_, i64>(3)?,
            "slow":  row.get::<_, f64>(4)?,
        }))
    })
    .unwrap()
    .filter_map(|r| r.ok())
    .collect()
}
