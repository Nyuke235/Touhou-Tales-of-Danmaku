use serde::{Deserialize, Serialize};
use std::fs;
use std::io::BufReader;
use std::path::PathBuf;
use std::sync::mpsc;
use std::time::Duration;
use tauri::{Manager, State};

// OGG Vorbis source for rodio using lewton
struct VorbisSource {
    reader: lewton::inside_ogg::OggStreamReader<std::fs::File>,
    current_packet: Vec<i16>,
    packet_pos: usize,
    channels: u32,
    sample_rate: u32,
}

impl VorbisSource {
    fn new(path: &PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
        let file = fs::File::open(path)?;
        let reader = lewton::inside_ogg::OggStreamReader::new(file)?;
        let channels = reader.ident_hdr.audio_channels as u32;
        let sample_rate = reader.ident_hdr.audio_sample_rate;
        Ok(Self { reader, current_packet: Vec::new(), packet_pos: 0, channels, sample_rate })
    }
}

impl Iterator for VorbisSource {
    type Item = i16;
    fn next(&mut self) -> Option<i16> {
        loop {
            if self.packet_pos < self.current_packet.len() {
                let s = self.current_packet[self.packet_pos];
                self.packet_pos += 1;
                return Some(s);
            }
            match self.reader.read_dec_packet_itl() {
                Ok(Some(pkt)) => {
                    self.current_packet = pkt;
                    self.packet_pos = 0;
                }
                _ => return None,
            }
        }
    }
}

impl rodio::Source for VorbisSource {
    fn current_frame_len(&self) -> Option<usize> { None }
    fn channels(&self) -> u16 { self.channels as u16 }
    fn sample_rate(&self) -> u32 { self.sample_rate }
    fn total_duration(&self) -> Option<Duration> { None }
}

// User / save data

#[derive(Serialize, Deserialize, Clone)]
struct User {
    username: String,
    password: String,
    #[serde(rename = "saveData")]
    save_data: Option<serde_json::Value>,
}

fn data_path(app: &tauri::AppHandle) -> PathBuf {
    let dir = app.path().app_data_dir().expect("no app data dir");
    fs::create_dir_all(&dir).expect("failed to create app data dir");
    dir.join("data.json")
}

fn read_users(app: &tauri::AppHandle) -> Vec<User> {
    let path = data_path(app);
    if !path.exists() {
        return vec![];
    }
    serde_json::from_str(&fs::read_to_string(&path).unwrap_or_default()).unwrap_or_default()
}

fn write_users(app: &tauri::AppHandle, users: &[User]) {
    let path = data_path(app);
    fs::write(path, serde_json::to_string_pretty(users).expect("serialization failed"))
        .expect("failed to write user data");
}

#[tauri::command]
fn auth(app: tauri::AppHandle, username: String, password: String) -> serde_json::Value {
    let mut users = read_users(&app);
    if let Some(user) = users.iter().find(|u| u.username == username) {
        if user.password == password {
            serde_json::json!({ "ok": true, "message": "Login successful!", "saveData": user.save_data })
        } else {
            serde_json::json!({ "ok": false, "message": "Incorrect password." })
        }
    } else {
        users.push(User { username, password, save_data: None });
        write_users(&app, &users);
        serde_json::json!({ "ok": true, "message": "Account created and logged in successfully!", "saveData": null })
    }
}

#[tauri::command]
fn save_data(
    app: tauri::AppHandle,
    username: String,
    #[allow(non_snake_case)] saveData: serde_json::Value,
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
        .map(|u| serde_json::json!({ "username": u.username, "saveData": u.save_data }))
        .collect()
}

// Audio system

enum AudioCmd {
    PlaySfx(PathBuf),
    PlayMusic(PathBuf),
    StopMusic,
    PauseMusic,
    ResumeMusic,
    SetSfxVolume(f32),
    SetMusicVolume(f32),
}

struct AudioHandle {
    sender: mpsc::SyncSender<AudioCmd>,
}

fn spawn_audio_thread() -> mpsc::SyncSender<AudioCmd> {
    let (tx, rx) = mpsc::sync_channel::<AudioCmd>(64);
    std::thread::spawn(move || audio_loop(rx));
    tx
}

fn audio_loop(rx: mpsc::Receiver<AudioCmd>) {
    use rodio::{Decoder, OutputStream, Sink};

    let (_stream, handle) = match OutputStream::try_default() {
        Ok(v) => v,
        Err(e) => { eprintln!("[Audio] Cannot open audio output: {e}"); return; }
    };

    let mut music_sink: Option<Sink> = None;
    let mut music_path: Option<PathBuf> = None;
    let mut sfx_vol: f32 = 0.8;
    let mut music_vol: f32 = 0.7;
    let mut paused = false;

    loop {
        if let (Some(sink), Some(path)) = (&music_sink, &music_path) {
            if sink.empty() && !paused {
                if let Ok(src) = VorbisSource::new(path) {
                    sink.append(src);
                }
            }
        }

        match rx.recv_timeout(Duration::from_millis(100)) {
            Ok(cmd) => match cmd {
                AudioCmd::PlaySfx(path) => {
                    let Ok(file) = fs::File::open(&path) else { continue };
                    let Ok(dec) = Decoder::new(BufReader::new(file)) else { continue };
                    let Ok(sink) = Sink::try_new(&handle) else { continue };
                    sink.set_volume(sfx_vol);
                    sink.append(dec);
                    sink.detach();
                }
                AudioCmd::PlayMusic(path) => {
                    if let Some(s) = music_sink.take() { s.stop(); }
                    match VorbisSource::new(&path) {
                        Ok(src) => match Sink::try_new(&handle) {
                            Ok(sink) => {
                                sink.set_volume(music_vol);
                                sink.append(src);
                                music_sink = Some(sink);
                                music_path = Some(path);
                                paused = false;
                            }
                            Err(_) => {}
                        },
                        Err(_) => {}
                    }
                }
                AudioCmd::StopMusic => {
                    if let Some(s) = music_sink.take() { s.stop(); }
                    music_path = None;
                    paused = false;
                }
                AudioCmd::PauseMusic => {
                    if let Some(ref s) = music_sink { s.pause(); }
                    paused = true;
                }
                AudioCmd::ResumeMusic => {
                    if let Some(ref s) = music_sink { s.play(); }
                    paused = false;
                }
                AudioCmd::SetSfxVolume(v) => sfx_vol = v.clamp(0.0, 1.0),
                AudioCmd::SetMusicVolume(v) => {
                    music_vol = v.clamp(0.0, 1.0);
                    if let Some(ref s) = music_sink { s.set_volume(music_vol); }
                }
            },
            Err(mpsc::RecvTimeoutError::Timeout) => {}
            Err(mpsc::RecvTimeoutError::Disconnected) => break,
        }
    }
}

fn resource_path(app: &tauri::AppHandle, src: &str) -> Option<PathBuf> {
    app.path().resource_dir().ok().map(|d| d.join("_up_").join(src))
}

#[tauri::command]
fn play_sfx(app: tauri::AppHandle, src: String, state: State<'_, AudioHandle>) {
    if let Some(path) = resource_path(&app, &src) {
        state.sender.send(AudioCmd::PlaySfx(path)).ok();
    }
}

#[tauri::command]
fn play_music(app: tauri::AppHandle, src: String, state: State<'_, AudioHandle>) {
    if let Some(path) = resource_path(&app, &src) {
        state.sender.send(AudioCmd::PlayMusic(path)).ok();
    }
}

#[tauri::command]
fn stop_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::StopMusic).ok();
}

#[tauri::command]
fn pause_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::PauseMusic).ok();
}

#[tauri::command]
fn resume_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::ResumeMusic).ok();
}

#[tauri::command]
fn set_sfx_volume(volume: f32, state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::SetSfxVolume(volume)).ok();
}

#[tauri::command]
fn set_music_volume(volume: f32, state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::SetMusicVolume(volume)).ok();
}

// Entry point

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(target_os = "linux")]
    unsafe {
        std::env::set_var("WEBKIT_DISABLE_SANDBOX_THIS_IS_DANGEROUS", "1");
    }

    let audio = AudioHandle { sender: spawn_audio_thread() };

    tauri::Builder::default()
        .manage(audio)
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_zoom(1.0);
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth, save_data, load_data, get_users,
            play_sfx, play_music, stop_music, pause_music, resume_music,
            set_sfx_volume, set_music_volume
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
