import { Request, Response } from 'express';
import { SqliteDatabase } from '../../infra/persistence/sqlite/database';

export class HealthController {
  constructor(private database: SqliteDatabase) {}

  check(req: Request, res: Response): void {
    const health: {
      status: string;
      timestamp: string;
      uptime: number;
      database: {
        connected: boolean;
        status: string;
        error?: string;
      };
      environment: string;
    } = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        connected: this.database.isConnected(),
        status: 'ok'
      },
      environment: process.env.NODE_ENV || 'development'
    };

    // Verifica conexão com banco de dados
    try {
      if (!this.database.isConnected()) {
        health.status = 'degraded';
        health.database.status = 'disconnected';
        res.status(503).json(health);
        return;
      }

      // Testa uma query simples
      const db = this.database.getDatabase();
      db.prepare('SELECT 1').get();
      
      res.status(200).json(health);
    } catch (error: any) {
      health.status = 'error';
      health.database.status = 'error';
      health.database = {
        ...health.database,
        error: error.message
      };
      res.status(503).json(health);
    }
  }
}

