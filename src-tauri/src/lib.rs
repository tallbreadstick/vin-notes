pub mod group_handler;
pub mod note_handler;
pub mod note_view;

use group_handler::*;
use note_handler::*;
use note_view::*;

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
            delete_group,

            // note handler
            fetch_notes,
            has_note,
            create_note,
            delete_note,

            // note viewer
            open_note,
            save_note
            
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
