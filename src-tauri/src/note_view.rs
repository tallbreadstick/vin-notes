use std::{fs::File, io::{Read, Write}};

use tauri::AppHandle;

use crate::group_handler::app_dir;

#[tauri::command]
pub fn open_note(app: AppHandle, group_name: &str, note_name: &str) -> Result<String, String> {
    let mut file = File::open(&format!("{}\\{}\\{}", app_dir(app), group_name, note_name)).map_err(|e| e.to_string())?;
    let mut buf = String::new();
    file.read_to_string(&mut buf).map_err(|e| e.to_string())?;
    Ok(buf)
}

#[tauri::command]
pub fn save_note(app: AppHandle, group_name: &str, note_name: &str, contents: &str) -> Result<(), String> {
    let mut file = File::create(&format!("{}\\{}\\{}", app_dir(app), group_name, note_name)).map_err(|e| e.to_string())?;
    file.write_all(contents.as_bytes()).map_err(|e| e.to_string())?;
    Ok(())
}