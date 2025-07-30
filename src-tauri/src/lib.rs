use std::{
    env,
    fs::{exists, File},
    io::Write,
    path::PathBuf,
};

use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Manager,
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn map_exists(map_id: String) -> bool {
    let file_path = get_file_path(map_id).unwrap();

    let file_exists = exists(&file_path).unwrap_or(false);

    return file_exists;
}

#[tauri::command]
fn open_map(map_id: String) {
    let file_path = get_file_path(map_id).unwrap();

    opener::open(&file_path).unwrap();
}

fn get_file_path(map_id: String) -> Option<String> {
    if let Ok(home_dir_str) = env::var("USERPROFILE") {
        let home_dir = PathBuf::from(home_dir_str);

        let documents_path = home_dir
            .join("Documents")
            .join("Trackmania")
            .join("Maps")
            .join("Downloaded");

        let file_path = documents_path.join(format!("{}.Map.Gbx", map_id));

        Some(file_path.to_str()?.to_string())
    } else {
        None
    }
}

#[tauri::command]
fn save_map(map_id: String, bytes: Vec<u8>) {
    let file_path = get_file_path(map_id).unwrap();

    let mut file = File::create(&file_path).unwrap();

    file.write_all(&bytes).unwrap();

    opener::open(&file_path).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let quit_button = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_button])?;

            let _ = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|icon, event| {
                    let app = icon.app_handle();

                    if let TrayIconEvent::Click { button, .. } = event {
                        if let Some(window) = app.get_webview_window("main") {
                            if let MouseButton::Left = button {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                    }
                })
                .on_menu_event(|app, event| {
                    if event.id == "quit" {
                        app.exit(0);
                    }
                })
                .build(app);
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                window.hide().unwrap();
                api.prevent_close();
            }
        })
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![map_exists, open_map, save_map])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
