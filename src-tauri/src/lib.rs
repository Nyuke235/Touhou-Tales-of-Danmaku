mod audio;
mod db;

use audio::AudioHandle;
use db::{AppDb, scores};
use std::sync::Mutex;
use tauri::{Manager, State};

fn valid_name(name: &str) -> bool {
    let len = name.chars().count();
    if !(3..=12).contains(&len) {
        return false;
    }
    name.chars().all(|c| c.is_ascii_alphanumeric() || c == '_' || c == '-')
}

#[tauri::command]
fn save_score(
    db: State<'_, AppDb>,
    name: String,
    score: i64,
    stage: i64,
    date: i64,
    slow: f64,
) -> serde_json::Value {
    if !valid_name(&name) {
        return serde_json::json!({ "ok": false, "message": "Invalid name." });
    }
    if !(0..=9_999_999_999_i64).contains(&score) {
        return serde_json::json!({ "ok": false, "message": "Invalid score." });
    }
    if !(1..=7_i64).contains(&stage) {
        return serde_json::json!({ "ok": false, "message": "Invalid stage." });
    }
    if !(0.0..=100.0).contains(&slow) {
        return serde_json::json!({ "ok": false, "message": "Invalid slow value." });
    }
    let conn = db.0.lock().unwrap();
    scores::insert(&conn, &name, score, stage, date, slow);
    serde_json::json!({ "ok": true })
}

#[tauri::command]
fn get_leaderboard(db: State<'_, AppDb>) -> Vec<serde_json::Value> {
    let conn = db.0.lock().unwrap();
    scores::leaderboard(&conn)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "linux")]
    unsafe {
        std::env::set_var("WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS", "1");
    }

    let audio = AudioHandle { sender: audio::spawn_audio_thread() };

    tauri::Builder::default()
        .manage(audio)
        .setup(|app| {
            let conn = db::open(app.handle());
            app.manage(AppDb(Mutex::new(conn)));
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_zoom(1.0);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_score, get_leaderboard,
            audio::play_sfx, audio::play_music, audio::stop_music,
            audio::pause_music, audio::resume_music,
            audio::set_sfx_volume, audio::set_music_volume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
