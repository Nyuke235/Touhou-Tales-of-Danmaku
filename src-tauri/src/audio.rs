use std::fs;
use std::io::BufReader;
use std::path::PathBuf;
use std::sync::mpsc;
use std::time::Duration;
use tauri::{Manager, State};

struct VorbisSource {
    reader:         lewton::inside_ogg::OggStreamReader<std::fs::File>,
    current_packet: Vec<i16>,
    packet_pos:     usize,
    channels:       u32,
    sample_rate:    u32,
}

impl VorbisSource {
    pub fn new(path: &PathBuf) -> Result<Self, Box<dyn std::error::Error>> {
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
                Ok(Some(pkt)) => { self.current_packet = pkt; self.packet_pos = 0; }
                _             => return None,
            }
        }
    }
}

impl rodio::Source for VorbisSource {
    fn current_frame_len(&self) -> Option<usize> { None }
    fn channels(&self)      -> u16  { self.channels as u16 }
    fn sample_rate(&self)   -> u32  { self.sample_rate }
    fn total_duration(&self) -> Option<Duration> { None }
}

pub enum AudioCmd {
    PlaySfx(PathBuf),
    PlayMusic(PathBuf),
    StopMusic,
    PauseMusic,
    ResumeMusic,
    SetSfxVolume(f32),
    SetMusicVolume(f32),
}

pub struct AudioHandle {
    pub sender: mpsc::SyncSender<AudioCmd>,
}

pub fn spawn_audio_thread() -> mpsc::SyncSender<AudioCmd> {
    let (tx, rx) = mpsc::sync_channel::<AudioCmd>(64);
    std::thread::spawn(move || audio_loop(rx));
    tx
}

fn audio_loop(rx: mpsc::Receiver<AudioCmd>) {
    use rodio::{Decoder, OutputStream, Sink};

    let (_stream, handle) = match OutputStream::try_default() {
        Ok(v)  => v,
        Err(e) => { eprintln!("[Audio] Cannot open audio output: {e}"); return; }
    };

    let mut music_sink: Option<Sink> = None;
    let mut music_path: Option<PathBuf> = None;
    let mut sfx_vol:   f32 = 0.8;
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
                    let Ok(dec)  = Decoder::new(BufReader::new(file)) else { continue };
                    let Ok(sink) = Sink::try_new(&handle) else { continue };
                    sink.set_volume(sfx_vol);
                    sink.append(dec);
                    sink.detach();
                }
                AudioCmd::PlayMusic(path) => {
                    if let Some(s) = music_sink.take() { s.stop(); }
                    if let Ok(src) = VorbisSource::new(&path) {
                        if let Ok(sink) = Sink::try_new(&handle) {
                            sink.set_volume(music_vol);
                            sink.append(src);
                            music_sink = Some(sink);
                            music_path = Some(path);
                            paused = false;
                        }
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
            Err(mpsc::RecvTimeoutError::Timeout)      => {}
            Err(mpsc::RecvTimeoutError::Disconnected) => break,
        }
    }
}

fn resource_path(app: &tauri::AppHandle, src: &str) -> Option<PathBuf> {
    app.path().resource_dir().ok().map(|d| d.join("_up_").join(src))
}

#[tauri::command]
pub fn play_sfx(app: tauri::AppHandle, src: String, state: State<'_, AudioHandle>) {
    if let Some(path) = resource_path(&app, &src) {
        state.sender.send(AudioCmd::PlaySfx(path)).ok();
    }
}

#[tauri::command]
pub fn play_music(app: tauri::AppHandle, src: String, state: State<'_, AudioHandle>) {
    if let Some(path) = resource_path(&app, &src) {
        state.sender.send(AudioCmd::PlayMusic(path)).ok();
    }
}

#[tauri::command]
pub fn stop_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::StopMusic).ok();
}

#[tauri::command]
pub fn pause_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::PauseMusic).ok();
}

#[tauri::command]
pub fn resume_music(state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::ResumeMusic).ok();
}

#[tauri::command]
pub fn set_sfx_volume(volume: f32, state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::SetSfxVolume(volume)).ok();
}

#[tauri::command]
pub fn set_music_volume(volume: f32, state: State<'_, AudioHandle>) {
    state.sender.send(AudioCmd::SetMusicVolume(volume)).ok();
}
