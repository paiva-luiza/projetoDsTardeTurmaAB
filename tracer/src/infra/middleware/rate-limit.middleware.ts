import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { logger } from '../logger/pino';

/**
 * Rate limiter geral para todas as rotas da API
 * Limita requisições por IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP a cada 15 minutos
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Retorna informações de rate limit nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  handler: (req: Request, res: Response) => {
    logger.warn({
      ip: req.ip,
      url: req.url,
      method: req.method
    }, 'Rate limit exceeded');
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

/**
 * Rate limiter mais restritivo para criação de eventos
 * Previne abuso na criação de eventos
 */
export const createEventRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // máximo de 30 eventos por IP por minuto
  message: {
    error: 'Too Many Requests',
    message: 'Too many event creation requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn({
      ip: req.ip,
      url: req.url,
      method: req.method
    }, 'Event creation rate limit exceeded');
    
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Too many event creation requests, please try again later.',
      retryAfter: '1 minute'
    });
  }
});

/**
 * Rate limiter para health check (mais permissivo)
 */
export const healthCheckRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // máximo de 60 requisições por IP por minuto
  standardHeaders: true,
  legacyHeaders: false
});

