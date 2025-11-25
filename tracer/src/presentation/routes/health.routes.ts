import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

export function createHealthRoutes(healthController: HealthController): Router {
  const router = Router();

  // GET /health - Health check endpoint
  router.get('/', (req, res) => {
    healthController.check(req, res);
  });

  return router;
}

