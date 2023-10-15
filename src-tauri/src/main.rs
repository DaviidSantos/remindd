// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_tree;

use db::{Card, Note, Tag};
use dirs;
mod db;
use file_tree::*;
use std::fs::{self};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_file_tree,
            add_note,
            select_all_notes,
            update_note_path,
            select_note,
            select_all_cards,
            select_all_tags,
            update_note_card,
            add_card,
            add_tag,
            select_card,
            delete_tag,
            add_note_tag,
            get_note_tags,
            delete_note_tag,
            delete_note,
            get_card_notes,
            revisao
        ])
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
fn add_card(name: &str) {
    let _ = db::insert_card(name);
}

#[tauri::command]
fn add_tag(name: &str) {
    let _ = db::insert_tag(name);
}

#[tauri::command]
fn add_note_tag(noteId: i32, tagId: i32) {
    let _ = db::add_note_tag(noteId, tagId);
}

#[tauri::command]
fn select_all_notes() -> Vec<Note> {
    let notes = db::get_all_notes().unwrap();
    notes
}

#[tauri::command]
fn select_note(path: &str) -> Note {
    let note = db::select_note(path).unwrap();
    note
}

#[tauri::command]
fn select_card(id: i32) -> Card {
    let card = db::select_card(id).unwrap();
    card
}

#[tauri::command]
fn update_note_path(path: &str, newPath: &str) {
    let _ = db::update_note_path(path, newPath);
}

#[tauri::command]
fn revisao(path: &str, interval: i32, repetition: i32, efactor: f32, dueDate: &str) {
    let _ = db::revisao(path, interval, repetition, efactor, dueDate);
}

#[tauri::command]
fn update_note_card(path: &str, cardId: i32) {
    let _ = db::update_note_card(path, cardId);
}

#[tauri::command]
fn select_all_cards() -> Vec<Card> {
    let cards = db::get_all_cards().unwrap();
    cards
}

#[tauri::command]
fn select_all_tags() -> Vec<Tag> {
    let tags = db::get_all_tags().unwrap();
    tags
}

#[tauri::command]
fn get_card_notes(cardId: i32) -> Vec<Note> {
    let notes = db::get_card_notes(cardId).unwrap();
    notes
}

#[tauri::command]
fn get_note_tags(id: i32) -> Vec<Tag> {
    let tags = db::get_note_tags(id).unwrap();
    tags
}

#[tauri::command]
fn delete_tag(id: i32) {
    let _ = db::delete_tag(id);
}

#[tauri::command]
fn delete_note(id: i32) {
    let _ = db::delete_note(id);
}

#[tauri::command]
fn delete_note_tag(noteId: i32, tagId: i32) {
    let _ = db::delete_note_tag(noteId, tagId);
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
