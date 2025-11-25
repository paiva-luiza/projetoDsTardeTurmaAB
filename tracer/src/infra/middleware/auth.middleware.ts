import { Request, Response, NextFunction } from 'express';
import { ENVIRONMENT } from '../../environment/env';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header is required. Use: Authorization: Bearer {API_KEY}'
    });
    return;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authorization format. Use: Authorization: Bearer {API_KEY}'
    });
    return;
  }

  const apiKey = parts[1];

  if (!ENVIRONMENT.API_KEY || ENVIRONMENT.API_KEY.trim().length === 0) {
    res.status(500).json({
      error: 'Server Configuration Error',
      message: 'API_KEY is not configured on the server'
    });
    return;
  }

  if (apiKey !== ENVIRONMENT.API_KEY) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key'
    });
    return;
  }

  next();
}

