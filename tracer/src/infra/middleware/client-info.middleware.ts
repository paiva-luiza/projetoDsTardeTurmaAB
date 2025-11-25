import { Request, Response, NextFunction } from 'express';

export interface ClientInfo {
  ipAddress: string;
  userAgent: string | undefined;
}

/**
 * Middleware para extrair informações do cliente (IP e User-Agent)
 * e adicionar ao objeto Request para uso posterior
 */
export function clientInfoMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Extrai o IP do cliente
  // Suporta X-Forwarded-For (proxies, load balancers)
  const forwardedFor = req.headers['x-forwarded-for'];
  let ipAddress: string;

  if (forwardedFor) {
    // X-Forwarded-For pode conter múltiplos IPs separados por vírgula
    // O primeiro é geralmente o IP original do cliente
    ipAddress = Array.isArray(forwardedFor) 
      ? forwardedFor[0].split(',')[0].trim()
      : forwardedFor.split(',')[0].trim();
  } else {
    // Fallback para req.ip (requer app.set('trust proxy', true))
    ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
  }

  // Extrai User-Agent
  const userAgent = req.headers['user-agent'];

  // Adiciona informações ao objeto Request
  (req as any).clientInfo = {
    ipAddress,
    userAgent
  } as ClientInfo;

  next();
}

