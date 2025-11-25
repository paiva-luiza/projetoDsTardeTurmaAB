import { Event } from '../../domain/entities/event';
import { EventRepository, EventData } from '../../infra/persistence/sqlite/event-repository';
import { CreateEventDTO } from '../dto/create-event.dto';

export class CreateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  execute(dto: CreateEventDTO, ipAddress?: string, userAgent?: string): Event {
    const event = Event.create(
      dto.event,
      dto.source || null,
      dto.metadata || null,
      dto.userId || null,
      ipAddress || null,
      userAgent || null,
      dto.timestamp
    );

    const eventData: EventData = {
      event_type: event.eventType,
      source: event.source || undefined,
      metadata: event.metadata || undefined,
      user_id: event.userId || undefined,
      ip_address: event.ipAddress || undefined,
      user_agent: event.userAgent || undefined,
      timestamp: event.timestamp
    };

    const createdEvent = this.eventRepository.create(eventData);
    return Event.fromPersistence(createdEvent as any);
  }
}

