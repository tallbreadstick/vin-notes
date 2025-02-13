pub mod group_handler;
pub mod note_handler;

use group_handler::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![

            // group handler
            get_app_dir,
            fetch_groups,
            has_group,
            create_group,
            delete_group
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
