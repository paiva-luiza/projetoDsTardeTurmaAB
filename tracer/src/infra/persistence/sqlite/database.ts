import Database from 'better-sqlite3';
import { ENVIRONMENT } from '../../../environment/env';
import { createEventsTable } from './schema';
import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { logger } from '../../logger/pino';

export class SqliteDatabase {
  private db: Database.Database | null = null;
  private connectionString: string;

  constructor(connectionString?: string) {
    this.connectionString = connectionString || ENVIRONMENT.DATABASE_URI || './database/tracer.db';
  }

  connect(): Database.Database {
    if (this.db) {
      return this.db;
    }

    try {
      const dbDir = dirname(this.connectionString);
      
      if (dbDir !== '.' && !existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      this.db = new Database(this.connectionString);
      
      this.db.pragma('journal_mode = WAL');
      this.db.pragma('foreign_keys = ON');
      
      createEventsTable(this.db);
      
      logger.info({ databasePath: this.connectionString }, '✅ SQLite database connected');
      
      return this.db;
    } catch (error: any) {
      logger.error({ error, databasePath: this.connectionString }, '❌ Error connecting to SQLite database');
      throw error;
    }
  }

  getDatabase(): Database.Database {
    if (!this.db) {
      return this.connect();
    }
    return this.db;
  }

  disconnect(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      logger.info('🔌 SQLite database disconnected');
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}

