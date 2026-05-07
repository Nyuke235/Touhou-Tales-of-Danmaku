mod audio;
mod db;

use audio::AudioHandle;
use bcrypt::{hash, verify};
use db::{AppDb, scores, settings, users};
use std::fs;
use std::sync::Mutex;
use tauri::{Manager, State};

fn get_save_data(conn: &rusqlite::Connection, user_id: i64) -> serde_json::Value {
    let (controls_raw, music_vol, sfx_vol) = settings::get(conn, user_id);
    let controls = controls_raw
        .and_then(|c| serde_json::from_str::<serde_json::Value>(&c).ok())
        .unwrap_or(serde_json::Value::Null);
    serde_json::json!({
        "controls": controls,
        "volumes":  { "music": music_vol, "sfx": sfx_vol },
        "scores":   scores::for_user(conn, user_id),
    })
}

#[tauri::command]
fn auth(db: State<'_, AppDb>, username: String, password: String) -> serde_json::Value {
    let conn = db.0.lock().unwrap();
    match users::find(&conn, &username) {
        Some(user) => match verify(&password, &user.password_hash) {
            Ok(true) => serde_json::json!({
                "ok":       true,
                "message":  "Login successful!",
                "saveData": get_save_data(&conn, user.id),
            }),
            _ => serde_json::json!({ "ok": false, "message": "Incorrect password." }),
        },
        None => {
            let Ok(hash_str) = hash(&password, 10) else {
                return serde_json::json!({ "ok": false, "message": "Internal error." });
            };
            let user_id = users::create(&conn, &username, &hash_str);
            settings::init(&conn, user_id);
            serde_json::json!({
                "ok":       true,
                "message":  "Account created and logged in successfully!",
                "saveData": null,
            })
        }
    }
}

#[tauri::command]
fn save_data(
    db: State<'_, AppDb>,
    username: String,
    #[allow(non_snake_case)] saveData: serde_json::Value,
) -> serde_json::Value {
    let conn = db.0.lock().unwrap();
    let Some(user) = users::find(&conn, &username) else {
        return serde_json::json!({ "ok": false, "message": "User not found." });
    };
    let controls  = saveData.get("controls").filter(|v| !v.is_null()).map(|v| v.to_string());
    let music_vol = saveData["volumes"]["music"].as_f64().unwrap_or(0.7);
    let sfx_vol   = saveData["volumes"]["sfx"].as_f64().unwrap_or(0.8);
    settings::save(&conn, user.id, controls, music_vol, sfx_vol);
    serde_json::json!({ "ok": true })
}

#[tauri::command]
fn save_score(
    db: State<'_, AppDb>,
    username: String,
    score: i64,
    stage: i64,
    date: i64,
    slow: f64,
) -> serde_json::Value {
    let conn = db.0.lock().unwrap();
    let Some(user) = users::find(&conn, &username) else {
        return serde_json::json!({ "ok": false, "message": "User not found." });
    };
    if scores::insert(&conn, user.id, score, stage, date, slow) {
        serde_json::json!({ "ok": true })
    } else {
        serde_json::json!({ "ok": false, "message": "Score limit reached." })
    }
}

#[tauri::command]
fn load_data(db: State<'_, AppDb>, username: String) -> serde_json::Value {
    let conn = db.0.lock().unwrap();
    match users::find(&conn, &username) {
        Some(user) => serde_json::json!({ "ok": true, "saveData": get_save_data(&conn, user.id) }),
        None       => serde_json::json!({ "ok": false, "saveData": null }),
    }
}

#[tauri::command]
fn get_users(db: State<'_, AppDb>) -> Vec<serde_json::Value> {
    let conn = db.0.lock().unwrap();
    users::all_ids_and_names(&conn)
        .into_iter()
        .map(|(user_id, username)| serde_json::json!({
            "username": username,
            "saveData": get_save_data(&conn, user_id),
        }))
        .collect()
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
            auth, save_data, load_data, get_users, save_score,
            audio::play_sfx, audio::play_music, audio::stop_music,
            audio::pause_music, audio::resume_music,
            audio::set_sfx_volume, audio::set_music_volume,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
