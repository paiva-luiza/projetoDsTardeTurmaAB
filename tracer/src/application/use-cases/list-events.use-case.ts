import { Event } from '../../domain/entities/event';
import { EventRepository } from '../../infra/persistence/sqlite/event-repository';

export interface ListEventsParams {
  limit?: number;
  offset?: number;
}

export class ListEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  execute(params: ListEventsParams = {}): { events: Event[]; total: number } {
    const limit = Math.min(params.limit || 100, 1000); // Máximo de 1000
    const offset = Math.max(params.offset || 0, 0);

    const eventsData = this.eventRepository.findAll(limit, offset);
    const total = this.eventRepository.count();

    const events = eventsData.map(eventData => Event.fromPersistence(eventData as any));

    return {
      events,
      total
    };
  }
}

