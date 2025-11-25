import Database from 'better-sqlite3';
import { SqliteDatabase } from './database';
import { logger } from '../../logger/pino';

export interface EventData {
  event_type: string;
  source?: string;
  metadata?: any;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  timestamp?: string;
}

export interface Event {
  id: number;
  event_type: string;
  source: string | null;
  timestamp: string;
  metadata: string | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export class EventRepository {
  private db: Database.Database;

  constructor(database: SqliteDatabase) {
    this.db = database.getDatabase();
  }

  create(eventData: EventData): Event {
    const insertQuery = `
      INSERT INTO events (event_type, source, metadata, user_id, ip_address, user_agent, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const metadataJson = eventData.metadata ? JSON.stringify(eventData.metadata) : null;
    const timestamp = eventData.timestamp || new Date().toISOString();

    try {
      const stmt = this.db.prepare(insertQuery);
      const result = stmt.run(
        eventData.event_type,
        eventData.source || null,
        metadataJson,
        eventData.user_id || null,
        eventData.ip_address || null,
        eventData.user_agent || null,
        timestamp
      );

      const createdEvent = this.findById(result.lastInsertRowid as number);
      logger.debug({ eventId: createdEvent.id, eventType: createdEvent.event_type }, 'Event created');
      return createdEvent;
    } catch (error: any) {
      logger.error({ error, eventData }, '❌ Error creating event');
      throw error;
    }
  }

  findById(id: number): Event {
    const query = `SELECT * FROM events WHERE id = ?`;
    const stmt = this.db.prepare(query);
    const row = stmt.get(id) as any;

    if (!row) {
      throw new Error(`Event with id ${id} not found`);
    }

    return this.mapRowToEvent(row);
  }

  findAll(limit: number = 100, offset: number = 0): Event[] {
    const query = `SELECT * FROM events ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    const stmt = this.db.prepare(query);
    const rows = stmt.all(limit, offset) as any[];

    return rows.map(row => this.mapRowToEvent(row));
  }

  findByEventType(eventType: string, limit: number = 100): Event[] {
    const query = `SELECT * FROM events WHERE event_type = ? ORDER BY timestamp DESC LIMIT ?`;
    const stmt = this.db.prepare(query);
    const rows = stmt.all(eventType, limit) as any[];

    return rows.map(row => this.mapRowToEvent(row));
  }

  findByUserId(userId: string, limit: number = 100): Event[] {
    const query = `SELECT * FROM events WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`;
    const stmt = this.db.prepare(query);
    const rows = stmt.all(userId, limit) as any[];

    return rows.map(row => this.mapRowToEvent(row));
  }

  count(): number {
    const query = `SELECT COUNT(*) as count FROM events`;
    const stmt = this.db.prepare(query);
    const result = stmt.get() as any;
    return result.count;
  }

  private mapRowToEvent(row: any): Event {
    return {
      id: row.id,
      event_type: row.event_type,
      source: row.source,
      timestamp: row.timestamp,
      metadata: row.metadata,
      user_id: row.user_id,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      created_at: row.created_at
    };
  }
}

