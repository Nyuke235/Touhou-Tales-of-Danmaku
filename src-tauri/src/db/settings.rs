use rusqlite::{Connection, params};

pub fn init(conn: &Connection, user_id: i64) {
    conn.execute("INSERT INTO settings (user_id) VALUES (?1)", params![user_id]).unwrap();
}

pub fn save(conn: &Connection, user_id: i64, controls: Option<String>, music_vol: f64, sfx_vol: f64) {
    conn.execute(
        "INSERT INTO settings (user_id, controls, music_vol, sfx_vol) VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT(user_id) DO UPDATE SET
             controls  = excluded.controls,
             music_vol = excluded.music_vol,
             sfx_vol   = excluded.sfx_vol",
        params![user_id, controls, music_vol, sfx_vol],
    ).unwrap();
}

pub fn get(conn: &Connection, user_id: i64) -> (Option<String>, f64, f64) {
    conn.query_row(
        "SELECT controls, music_vol, sfx_vol FROM settings WHERE user_id = ?1",
        params![user_id],
        |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?)),
    ).unwrap_or((None, 0.7, 0.8))
}
