import { Request, Response, NextFunction } from 'express';
import { validateCreateEventDTO } from '../../application/dto/create-event.dto';

export function validateCreateEvent(req: Request, res: Response, next: NextFunction): void {
  const validation = validateCreateEventDTO(req.body);

  if (!validation.isValid) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: validation.errors
    });
    return;
  }

  next();
}

