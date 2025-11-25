import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { healthCheckRateLimiter } from '../../infra/middleware/rate-limit.middleware';

export function createHealthRoutes(healthController: HealthController): Router {
  const router = Router();

  // GET /health - Health check endpoint (com rate limiting)
  router.get('/', healthCheckRateLimiter, (req, res) => {
    healthController.check(req, res);
  });

  return router;
}

