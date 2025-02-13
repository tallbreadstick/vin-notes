use crate::group_handler::{app_dir, JsonStr};
use std::fs;
use std::path::Path;
use tauri::AppHandle;

#[tauri::command]
pub fn fetch_notes(app: AppHandle, group_name: &str) -> Result<JsonStr, String> {
    let path = format!("{}\\{}", app_dir(app), group_name);
    let notes: Vec<_> = fs::read_dir(&path)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.path().is_file())
        .map(|entry| {
            entry
                .path()
                .to_str()
                .unwrap_or("####")
                .to_string()
                .replace(&format!("{}\\", path), "")
                .clone()
        })
        .collect();
    Ok(serde_json::json!(&notes).to_string())
}

#[tauri::command]
pub fn has_note(app: AppHandle, group_name: &str, note_name: &str) -> bool {
    Path::new(&format!("{}\\{}\\{}", app_dir(app), group_name, note_name)).exists()
}

#[tauri::command]
pub fn create_note(app: AppHandle, group_name: &str, note_name: &str) -> Result<(), String> {
    Ok(
        fs::create_dir_all(&format!("{}\\{}\\{}", app_dir(app), group_name, note_name))
            .map_err(|e| e.to_string())?,
    )
}

#[tauri::command]
pub fn delete_note(app: AppHandle, group_name: &str, note_name: &str) -> Result<(), String> {
    Ok(fs::remove_dir_all(&format!("{}\\{}\\{}", app_dir(app), group_name, note_name)).map_err(|e| e.to_string())?)
}