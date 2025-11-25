import { Event } from '../../domain/entities/event';
import { EventRepository } from '../../infra/persistence/sqlite/event-repository';

export interface GetEventsByUserIdParams {
  userId: string;
  limit?: number;
}

export class GetEventsByUserIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  execute(params: GetEventsByUserIdParams): Event[] {
    if (!params.userId || params.userId.trim().length === 0) {
      throw new Error('User ID is required');
    }

    const limit = Math.min(params.limit || 100, 1000); // Máximo de 1000

    const eventsData = this.eventRepository.findByUserId(params.userId.trim(), limit);
    return eventsData.map(eventData => Event.fromPersistence(eventData as any));
  }
}

