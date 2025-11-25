import Database from 'better-sqlite3';

export function createEventsTable(db: Database.Database): void {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      source TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT,
      user_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createIndexQuery = `
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
  `;

  try {
    db.exec(createTableQuery);
    db.exec(createIndexQuery);
    console.log('✅ Events table created successfully');
  } catch (error) {
    console.error('❌ Error creating events table:', error);
    throw error;
  }
}

