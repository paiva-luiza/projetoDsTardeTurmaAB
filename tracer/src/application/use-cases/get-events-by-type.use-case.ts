import { Event } from '../../domain/entities/event';
import { EventRepository } from '../../infra/persistence/sqlite/event-repository';

export interface GetEventsByTypeParams {
  eventType: string;
  limit?: number;
}

export class GetEventsByTypeUseCase {
  constructor(private eventRepository: EventRepository) {}

  execute(params: GetEventsByTypeParams): Event[] {
    if (!params.eventType || params.eventType.trim().length === 0) {
      throw new Error('Event type is required');
    }

    const limit = Math.min(params.limit || 100, 1000); // Máximo de 1000

    const eventsData = this.eventRepository.findByEventType(params.eventType.trim(), limit);
    return eventsData.map(eventData => Event.fromPersistence(eventData as any));
  }
}

