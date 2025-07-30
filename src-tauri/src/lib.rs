use std::{
    env,
    fs::{exists, File},
    io::Write,
    path::PathBuf,
};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn map_exists(map_id: String) -> bool {
    let file_path = get_file_path(map_id)?;

    let file_exists = exists(&file_path).unwrap_or(false);

    return file_exists;
}

#[tauri::command]
fn open_map(map_id: String) {
    let file_path = get_file_path(map_id)?;

    opener::open(&file_path)?;
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
    let file_path = get_file_path(map_id)?;

    let mut file = File::create(&file_path)?;

    file.write_all(&bytes)?;

    opener::open(&file_path)?;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![map_exists, open_map, save_map])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
