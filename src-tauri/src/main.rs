// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_tree;

use file_tree::*;
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};
use dirs;
use std::fs::{self};

fn main() {
  create_folders_if_not_exist();
  tauri::Builder::default()
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      #[cfg(target_os = "macos")]
      apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
          .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

      #[cfg(target_os = "windows")]
      apply_blur(&window, Some((18, 18, 18, 125)))
          .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![read_file_tree])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn read_file_tree() -> TreeNode {
    let documents_dir = tauri::api::path::document_dir().unwrap_or_default();
    let remind_folder_path = documents_dir.join("Remind");
    let file_tree = build_tree(remind_folder_path);
    file_tree
}

fn create_folders_if_not_exist() {
  let documents_directory = match dirs::document_dir() {
      Some(path) => path,
      None => {
          eprintln!("Failed to determine the documents directory.");
          return;
      }
  };

  let folder_path = documents_directory.join("Remind");
  if !folder_path.exists() {
      if let Err(err) = fs::create_dir(&folder_path) {
          eprintln!("Failed to create folder {:?}: {}", folder_path, err);
      }
  }

  let config = documents_directory.join("Remind/.config");
  if !config.exists() {
      if let Err(err) = fs::create_dir(&config) {
          eprintln!("Failed to create folder {:?}: {}", config, err);
      }
  }

  let notes = documents_directory.join("Remind/.config/notes.json");
  if !notes.exists() {
      if let Err(err) = fs::write(&notes, "[]") {
          eprintln!("Failed to create file {:?}: {}", notes, err);
      }
  }

  let tags = documents_directory.join("Remind/.config/tags.json");
  if !tags.exists() {
      if let Err(err) = fs::write(&tags, "[]") {
          eprintln!("Failed to create file {:?}: {}", tags, err);
      }
  }
}
