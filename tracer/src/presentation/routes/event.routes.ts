import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../../infra/middleware/auth.middleware';
import { validateCreateEvent } from '../../infra/middleware/validation.middleware';

export function createEventRoutes(eventController: EventController): Router {
  const router = Router();

  // Todas as rotas requerem autenticação
  router.use(authMiddleware);

  // POST /api/events - Criar novo evento
  router.post(
    '/',
    validateCreateEvent,
    (req, res, next) => {
      try {
        eventController.create(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/events/:id - Buscar evento por ID
  router.get(
    '/:id',
    (req, res, next) => {
      try {
        eventController.getById(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/events - Listar todos os eventos
  router.get(
    '/',
    (req, res, next) => {
      try {
        eventController.list(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/events/type/:type - Buscar eventos por tipo
  router.get(
    '/type/:type',
    (req, res, next) => {
      try {
        eventController.getByType(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  // GET /api/events/user/:userId - Buscar eventos por user ID
  router.get(
    '/user/:userId',
    (req, res, next) => {
      try {
        eventController.getByUserId(req, res);
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}

