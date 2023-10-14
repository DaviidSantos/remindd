use rusqlite::{Connection, Result, named_params};

pub fn create_database() -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory.join("Remind/.config/data.db").into_os_string().into_string().unwrap();
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
            Ok(_) => {},
            Err(err) => {
                eprintln!("Error creating table: {}", err);
                // Handle the error as needed
            }
        }
    }

    Ok(())
}


pub fn insert_note(path: &str, interval: i32, repetition: i32, efactor: f32, dueDate: &str) -> Result<()> {
    let documents_directory = tauri::api::path::document_dir().unwrap_or_default();
    let db = documents_directory.join("Remind/.config/data.db").into_os_string().into_string().unwrap();
    let conn = Connection::open(db)?;
    let mut statement = conn.prepare("INSERT INTO notes (path, interval, repetition, efactor, due_date) VALUES (@path, @interval, @repetition, @efactor, @due_date)")?;
    statement.execute(named_params! { "@path": path, "@interval": interval, "@repetition": repetition, "@efactor": efactor, "@due_date": dueDate})?;

    Ok(())
}

pub fn get_all(db: &Connection) -> Result<Vec<String>, rusqlite::Error> {
    let mut statement = db.prepare("SELECT * FROM items")?;
    let mut rows = statement.query([])?;
    let mut items = Vec::new();
    while let Some(row) = rows.next()? {
      let title: String = row.get("title")?;
  
      items.push(title);
    }
  
    Ok(items)
}