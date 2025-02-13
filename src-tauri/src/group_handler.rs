use std::{fs, path::Path};
use tauri::{AppHandle, Manager};

const GROUP_PANIC: &str = "fatal error occurred in group handler";

pub type JsonStr = String;

pub fn app_dir(app: AppHandle) -> String {
    app.path()
        .app_data_dir()
        .expect(GROUP_PANIC)
        .to_str()
        .expect(GROUP_PANIC)
        .to_string()
}

#[tauri::command]
pub fn get_app_dir(app: AppHandle) -> String {
    app_dir(app)
}

#[tauri::command]
pub fn fetch_groups(app: AppHandle) -> Result<JsonStr, String> {
    let dir = app_dir(app);
    let groups: Vec<String> = fs::read_dir(&dir).map_err(|e| e.to_string())?
    .filter_map(|entry| entry.ok())
    .filter(|entry| entry.path().is_dir())
    .map(|entry| {
        entry.path()
            .to_str()
            .unwrap_or("####")
            .to_string()
            .replace(&format!("{}\\", dir), "")
    })
    .collect();
    Ok(serde_json::json!(&groups).to_string())
}

#[tauri::command]
pub fn has_group(group_name: &str, app: AppHandle) -> bool {
    Path::new(&format!("{}\\{}", app_dir(app), group_name)).exists()
}

#[tauri::command]
pub fn create_group(group_name: &str, app: AppHandle) -> Result<(), String> {
    Ok(fs::create_dir_all(&format!("{}\\{}", app_dir(app), group_name)).map_err(|e| e.to_string())?)
}

#[tauri::command]
pub fn delete_group(group_name: &str, app: AppHandle) -> Result<(), String> {
    Ok(
        fs::remove_dir_all(&format!("{}\\{}", app_dir(app), group_name))
            .map_err(|e| e.to_string())?,
    )
}
