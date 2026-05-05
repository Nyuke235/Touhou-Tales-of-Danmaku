use serde::{Deserialize, Serialize};
use std::fs;
use tauri::Manager;

#[derive(Serialize, Deserialize, Clone)]
struct User {
    username: String,
    password: String,
    #[serde(rename = "saveData")]
    save_data: Option<serde_json::Value>,
}

fn data_path(app: &tauri::AppHandle) -> std::path::PathBuf {
    let dir = app.path().app_data_dir().expect("no app data dir");
    fs::create_dir_all(&dir).expect("failed to create app data dir");
    dir.join("data.json")
}

fn read_users(app: &tauri::AppHandle) -> Vec<User> {
    let path = data_path(app);
    if !path.exists() {
        return vec![];
    }
    let content = fs::read_to_string(&path).unwrap_or_default();
    serde_json::from_str(&content).unwrap_or_default()
}

fn write_users(app: &tauri::AppHandle, users: &[User]) {
    let path = data_path(app);
    let content = serde_json::to_string_pretty(users).expect("serialization failed");
    fs::write(path, content).expect("failed to write user data");
}

#[tauri::command]
fn auth(
    app: tauri::AppHandle,
    username: String,
    password: String,
) -> serde_json::Value {
    let mut users = read_users(&app);

    if let Some(user) = users.iter().find(|u| u.username == username) {
        if user.password == password {
            serde_json::json!({
                "ok": true,
                "message": "Login successful!",
                "saveData": user.save_data
            })
        } else {
            serde_json::json!({ "ok": false, "message": "Incorrect password." })
        }
    } else {
        let new_user = User {
            username,
            password,
            save_data: None,
        };
        users.push(new_user);
        write_users(&app, &users);
        serde_json::json!({
            "ok": true,
            "message": "Account created and logged in successfully!",
            "saveData": null
        })
    }
}

#[tauri::command]
fn save_data(
    app: tauri::AppHandle,
    username: String,
    #[allow(non_snake_case)]
    saveData: serde_json::Value,
) -> serde_json::Value {
    let mut users = read_users(&app);
    if let Some(user) = users.iter_mut().find(|u| u.username == username) {
        user.save_data = Some(saveData);
        write_users(&app, &users);
        serde_json::json!({ "ok": true })
    } else {
        serde_json::json!({ "ok": false, "message": "User not found." })
    }
}

#[tauri::command]
fn load_data(app: tauri::AppHandle, username: String) -> serde_json::Value {
    let users = read_users(&app);
    if let Some(user) = users.iter().find(|u| u.username == username) {
        serde_json::json!({ "ok": true, "saveData": user.save_data })
    } else {
        serde_json::json!({ "ok": false, "saveData": null })
    }
}

#[tauri::command]
fn get_users(app: tauri::AppHandle) -> Vec<serde_json::Value> {
    read_users(&app)
        .into_iter()
        .map(|u| {
            serde_json::json!({
                "username": u.username,
                "saveData": u.save_data
            })
        })
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_zoom(1.0);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![auth, save_data, load_data, get_users])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
