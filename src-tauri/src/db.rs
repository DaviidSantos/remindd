use rusqlite::{named_params, Connection, Result};

use serde::Serialize;

#[derive(Serialize)]
pub struct Note {
    id: i32,
    path: String,
    due_date: String,
    interval: i32,
    repetition: i32,
    efactor: f32,
    card_id: Option<i32>,
}

#[derive(Serialize)]
pub struct Card {
    id: i32,
    name: String,
}

#[derive(Serialize)]
pub struct Tag {
    id: i32,
    name: String,
}

pub fn create_database() -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    // Define your SQL statements
    let sql_statements = [
        "CREATE TABLE IF NOT EXISTS cards(id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE)",
        "CREATE TABLE IF NOT EXISTS tags(id INTEGER PRIMARY KEY, name TEXT)",
        "CREATE TABLE IF NOT EXISTS my_references(id INTEGER PRIMARY KEY, reference TEXT)",
        "CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY, path TEXT, due_date INTEGER, interval INTEGER, repetition INTEGER, efactor INTEGER, card_id INTEGER REFERENCES cards(id))",
        "CREATE TABLE IF NOT EXISTS note_tags(id INTEGER PRIMARY KEY, note_id INTEGER NOT NULL REFERENCES notes(id), tag_id INTEGER NOT NULL REFERENCES tags(id))",
        "CREATE TABLE IF NOT EXISTS note_references(id INTEGER PRIMARY KEY, note_id INTEGER NOT NULL REFERENCES notes(id), reference_id INTEGER NOT NULL REFERENCES my_references(id))",
    ];

    for statement in &sql_statements {
        match conn.execute(statement, []) {
            Ok(_) => {}
            Err(err) => {
                eprintln!("Error creating table: {}", err);
                // Handle the error as needed
            }
        }
    }

    Ok(())
}

pub fn insert_note(
    path: &str,
    interval: i32,
    repetition: i32,
    efactor: f32,
    dueDate: &str,
) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("INSERT INTO notes (path, interval, repetition, efactor, due_date) VALUES (@path, @interval, @repetition, @efactor, @due_date)")?;
    statement.execute(named_params! { "@path": path, "@interval": interval, "@repetition": repetition, "@efactor": efactor, "@due_date": dueDate})?;

    Ok(())
}

pub fn get_all_notes() -> Result<Vec<Note>> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM notes")?;
    let mut rows = statement.query([])?;
    let mut items: Vec<Note> = Vec::new();
    while let Some(row) = rows.next()? {
        let note: Note = Note {
            id: row.get(0)?,
            path: row.get(1)?,
            due_date: row.get(2)?,
            interval: row.get(3)?,
            repetition: row.get(4)?,
            efactor: row.get(5)?,
            card_id: row.get(6)?,
        };

        items.push(note);
    }

    Ok(items)
}

pub fn select_note(path: &str) -> Result<Note> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM notes WHERE path = ?")?;
    let mut rows = statement.query(&[&path])?;
    let mut note: Note = {
        Note {
            id: 0,
            path: "".to_string(),
            due_date: "".to_string(),
            interval: 0,
            repetition: 0,
            efactor: 0.0,
            card_id: None,
        }
    };

    while let Some(row) = rows.next()? {
        note.id = row.get(0)?;
        note.path = row.get(1)?;
        note.due_date = row.get(2)?;
        note.interval = row.get(3)?;
        note.repetition = row.get(4)?;
        note.efactor = row.get(5)?;
        note.card_id = row.get(6)?;
    }

    Ok(note)
}

pub fn select_card(id: i32) -> Result<Card> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM cards WHERE id = ?")?;
    let mut rows = statement.query(&[&id])?;
    let mut card: Card = {
        Card {
            id: 0,
            name: "".to_string(),
        }
    };

    while let Some(row) = rows.next()? {
        card.id = row.get(0)?;
        card.name = row.get(1)?;
    }

    Ok(card)
}

pub fn update_note_path(path: &str, new_path: &str) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("UPDATE notes SET path = @new_path WHERE path = @path")?;
    statement.execute(named_params! { "@path": path, "@new_path": new_path})?;

    Ok(())
}

pub fn get_all_cards() -> Result<Vec<Card>> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM cards")?;
    let mut rows = statement.query([])?;
    let mut items: Vec<Card> = Vec::new();
    while let Some(row) = rows.next()? {
        let card: Card = Card {
            id: row.get(0)?,
            name: row.get(1)?,
        };

        items.push(card);
    }

    Ok(items)
}

pub fn update_note_card(path: &str, card_id: i32) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("UPDATE notes SET card_id = @card_id WHERE path = @path")?;
    statement.execute(named_params! { "@path": path, "@card_id": card_id})?;

    Ok(())
}

pub fn revisao(path: &str, interval: i32, repetition: i32, efactor: f32, due_date: &str) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("UPDATE notes SET interval = @interval, repetition = @repetition, efactor = @efactor, due_date = @due_date WHERE path = @path")?;
    statement.execute(named_params! { "@path": path, "@interval": interval, "@repetition": repetition, "@efactor": efactor, "@due_date": due_date})?;

    Ok(())
}

pub fn get_all_tags() -> Result<Vec<Tag>> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM tags")?;
    let mut rows = statement.query([])?;
    let mut items: Vec<Tag> = Vec::new();
    while let Some(row) = rows.next()? {
        let tag: Tag = Tag {
            id: row.get(0)?,
            name: row.get(1)?,
        };

        items.push(tag);
    }

    Ok(items)
}

pub fn get_note_tags(id: i32) -> Result<Vec<Tag>> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT tags.id, tags.name FROM tags JOIN note_tags ON tags.id = note_tags.tag_id WHERE note_tags.note_id = ?;")?;
    let mut rows = statement.query(&[&id])?;
    let mut items: Vec<Tag> = Vec::new();
    while let Some(row) = rows.next()? {
        let tag: Tag = Tag {
            id: row.get(0)?,
            name: row.get(1)?,
        };

        items.push(tag);
    }

    Ok(items)
}

pub fn get_card_notes(card_id: i32) -> Result<Vec<Note>> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;

    let mut statement = conn.prepare("SELECT * FROM notes WHERE card_id = ? AND due_date = Date('now');")?;
    let mut rows = statement.query(&[&card_id])?;
    let mut items: Vec<Note> = Vec::new();
    while let Some(row) = rows.next()? {
        let note: Note = Note {
            id: row.get(0)?,
            path: row.get(1)?,
            due_date: row.get(2)?,
            interval: row.get(3)?,
            repetition: row.get(4)?,
            efactor: row.get(5)?,
            card_id: row.get(6)?,
        };

        items.push(note);
    }

    Ok(items)
}

pub fn insert_card(name: &str) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("INSERT INTO cards (name) VALUES (@name)")?;
    statement.execute(named_params! { "@name": name})?;

    Ok(())
}

pub fn insert_tag(name: &str) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("INSERT INTO tags (name) VALUES (@name)")?;
    statement.execute(named_params! { "@name": name})?;

    Ok(())
}

pub fn add_note_tag(note_id: i32, tag_id: i32) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("INSERT INTO note_tags (note_id, tag_id) VALUES (@note_id, @tag_id)")?;
    statement.execute(named_params! { "@note_id": note_id, "@tag_id": tag_id})?;

    Ok(())
}

pub fn delete_tag(id: i32) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("DELETE FROM note_tags WHERE tag_id = @id;")?;
    statement.execute(named_params! { "@id": id})?;

    let mut statement = conn.prepare("DELETE FROM tags WHERE id = @id;")?;
    statement.execute(named_params! { "@id": id})?;

    Ok(())
}

pub fn delete_note_tag(note_id: i32, tag_id: i32) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("DELETE FROM note_tags WHERE tag_id = @tag_id AND note_id = @note_id;")?;
    statement.execute(named_params! { "@note_id": note_id, "@tag_id": tag_id})?;

    Ok(())
}

pub fn delete_note(id: i32) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory
        .join("Remind/.config/data.db")
        .into_os_string()
        .into_string()
        .unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("DELETE FROM note_tags WHERE note_id = @id;")?;
    statement.execute(named_params! { "@id": id})?;

    let mut statement = conn.prepare("DELETE FROM note_references WHERE note_id = @id;")?;
    statement.execute(named_params! { "@id": id})?;

    let mut statement = conn.prepare("DELETE FROM notes WHERE id = @id;")?;
    statement.execute(named_params! { "@id": id})?;

    Ok(())
}
