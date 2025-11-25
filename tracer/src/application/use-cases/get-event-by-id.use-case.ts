import { Event } from '../../domain/entities/event';
import { EventRepository } from '../../infra/persistence/sqlite/event-repository';

export class GetEventByIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  execute(id: number): Event {
    if (!id || id <= 0) {
      throw new Error('Invalid event ID');
    }

    const eventData = this.eventRepository.findById(id);
    return Event.fromPersistence(eventData as any);
  }
}

