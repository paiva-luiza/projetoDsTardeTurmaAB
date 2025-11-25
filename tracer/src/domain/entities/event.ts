import { logger } from '../../infra/logger/pino';

export class Event {
  private constructor(
    public readonly id: number,
    public readonly eventType: string,
    public readonly source: string | null,
    public readonly timestamp: string,
    public readonly metadata: Record<string, any> | null,
    public readonly userId: string | null,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly createdAt: string
  ) {}

  static create(
    eventType: string,
    source: string | null = null,
    metadata: Record<string, any> | null = null,
    userId: string | null = null,
    ipAddress: string | null = null,
    userAgent: string | null = null,
    timestamp?: string
  ): Event {
    // Validações de domínio
    if (!eventType || eventType.trim().length === 0) {
      throw new Error('Event type is required');
    }

    if (eventType.length > 255) {
      throw new Error('Event type must not exceed 255 characters');
    }

    if (source && source.length > 255) {
      throw new Error('Source must not exceed 255 characters');
    }

    if (userId && userId.length > 255) {
      throw new Error('User ID must not exceed 255 characters');
    }

    const eventTimestamp = timestamp || new Date().toISOString();
    const createdAt = new Date().toISOString();

    return new Event(
      0, // ID será atribuído pelo banco de dados
      eventType.trim(),
      source?.trim() || null,
      eventTimestamp,
      metadata,
      userId?.trim() || null,
      ipAddress?.trim() || null,
      userAgent?.trim() || null,
      createdAt
    );
  }

  static fromPersistence(data: {
    id: number;
    event_type: string;
    source: string | null;
    timestamp: string;
    metadata: string | null;
    user_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
  }): Event {
    let parsedMetadata: Record<string, any> | null = null;
    
    if (data.metadata) {
      try {
        parsedMetadata = JSON.parse(data.metadata);
      } catch (error: any) {
        logger.warn({ error }, 'Failed to parse metadata JSON');
        parsedMetadata = null;
      }
    }

    return new Event(
      data.id,
      data.event_type,
      data.source,
      data.timestamp,
      parsedMetadata,
      data.user_id,
      data.ip_address,
      data.user_agent,
      data.created_at
    );
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      eventType: this.eventType,
      source: this.source,
      timestamp: this.timestamp,
      metadata: this.metadata,
      userId: this.userId,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      createdAt: this.createdAt
    };
  }
}

