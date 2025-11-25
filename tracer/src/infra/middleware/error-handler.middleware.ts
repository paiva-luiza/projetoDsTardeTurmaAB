import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/pino';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandlerMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Se já foi enviada uma resposta, delegar para o handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // Log do erro usando Pino
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({
        err,
        req: {
          method: req.method,
          url: req.url,
          ip: req.ip
        }
      }, err.message);
    } else {
      logger.warn({
        err,
        req: {
          method: req.method,
          url: req.url,
          ip: req.ip
        }
      }, err.message);
    }
  } else {
    logger.error({
      err,
      req: {
        method: req.method,
        url: req.url,
        ip: req.ip
      }
    }, 'Unhandled error');
  }

  // Se for um AppError (erro operacional conhecido)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message
    });
    return;
  }

  // Erro não tratado - erro 500
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
}

