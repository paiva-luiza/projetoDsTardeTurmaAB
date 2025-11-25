import { Request, Response } from 'express';
import { CreateEventUseCase } from '../../application/use-cases/create-event.use-case';
import { GetEventByIdUseCase } from '../../application/use-cases/get-event-by-id.use-case';
import { ListEventsUseCase } from '../../application/use-cases/list-events.use-case';
import { GetEventsByTypeUseCase } from '../../application/use-cases/get-events-by-type.use-case';
import { GetEventsByUserIdUseCase } from '../../application/use-cases/get-events-by-user-id.use-case';
import { EventResponseDTO, EventListResponseDTO } from '../../application/dto/event-response.dto';
import { AppError } from '../../infra/middleware/error-handler.middleware';
import { ClientInfo } from '../../infra/middleware/client-info.middleware';

export class EventController {
  constructor(
    private createEventUseCase: CreateEventUseCase,
    private getEventByIdUseCase: GetEventByIdUseCase,
    private listEventsUseCase: ListEventsUseCase,
    private getEventsByTypeUseCase: GetEventsByTypeUseCase,
    private getEventsByUserIdUseCase: GetEventsByUserIdUseCase
  ) {}

  create(req: Request, res: Response): void {
    try {
      // Usa informações do cliente extraídas pelo middleware
      const clientInfo = (req as any).clientInfo as ClientInfo | undefined;
      const ipAddress = clientInfo?.ipAddress || undefined;
      const userAgent = clientInfo?.userAgent || undefined;

      const event = this.createEventUseCase.execute(req.body, ipAddress, userAgent);
      
      const response: EventResponseDTO = event.toJSON() as EventResponseDTO;
      
      res.status(201).json(response);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, `Failed to create event: ${error.message}`);
    }
  }

  getById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id)) {
        throw new AppError(400, 'Invalid event ID format');
      }

      const event = this.getEventByIdUseCase.execute(id);
      const response: EventResponseDTO = event.toJSON() as EventResponseDTO;

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error.message && error.message.includes('not found')) {
        throw new AppError(404, error.message);
      }
      throw new AppError(500, `Failed to get event: ${error.message}`);
    }
  }

  list(req: Request, res: Response): void {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : undefined;

      if (limit !== undefined && (isNaN(limit) || limit < 1)) {
        throw new AppError(400, 'Invalid limit parameter');
      }

      if (offset !== undefined && (isNaN(offset) || offset < 0)) {
        throw new AppError(400, 'Invalid offset parameter');
      }

      const result = this.listEventsUseCase.execute({ limit, offset });
      
      const response: EventListResponseDTO = {
        events: result.events.map(event => event.toJSON() as EventResponseDTO),
        total: result.total,
        limit: limit || 100,
        offset: offset || 0
      };

      res.status(200).json(response);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, `Failed to list events: ${error.message}`);
    }
  }

  getByType(req: Request, res: Response): void {
    try {
      const eventType = req.params.type;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      if (limit !== undefined && (isNaN(limit) || limit < 1)) {
        throw new AppError(400, 'Invalid limit parameter');
      }

      const events = this.getEventsByTypeUseCase.execute({ eventType, limit });
      
      res.status(200).json({
        events: events.map(event => event.toJSON() as EventResponseDTO),
        count: events.length
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error.message && error.message.includes('required')) {
        throw new AppError(400, error.message);
      }
      throw new AppError(500, `Failed to get events by type: ${error.message}`);
    }
  }

  getByUserId(req: Request, res: Response): void {
    try {
      const userId = req.params.userId;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

      if (limit !== undefined && (isNaN(limit) || limit < 1)) {
        throw new AppError(400, 'Invalid limit parameter');
      }

      const events = this.getEventsByUserIdUseCase.execute({ userId, limit });
      
      res.status(200).json({
        events: events.map(event => event.toJSON() as EventResponseDTO),
        count: events.length
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      if (error.message && error.message.includes('required')) {
        throw new AppError(400, error.message);
      }
      throw new AppError(500, `Failed to get events by user ID: ${error.message}`);
    }
  }
}

