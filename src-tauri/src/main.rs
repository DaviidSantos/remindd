// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_tree;

use db::Note;
use dirs;
mod db;
use file_tree::*;
use std::fs::{self};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![read_file_tree, add_note, select_all_notes, update_note_path])
        .setup(|app| {
            create_folders_if_not_exist();
            let _ = db::create_database();
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn add_note(path: &str, interval: i32, repetition: i32, efactor: f32, dueDate: &str) {
    let _ = db::insert_note(path, interval, repetition, efactor, dueDate);
}

#[tauri::command]
fn select_all_notes() -> Vec<Note> {
    let notes = db::get_all().unwrap();
    notes
}

#[tauri::command]
fn update_note_path(path: &str, newPath: &str) {
    let _ = db::update_note_path(path, newPath);
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

    let cards = documents_directory.join("Remind/.config/cards.json");
    if !cards.exists() {
        if let Err(err) = fs::write(&cards, "[]") {
            eprintln!("Failed to create file {:?}: {}", cards, err);
        }
    }
}
