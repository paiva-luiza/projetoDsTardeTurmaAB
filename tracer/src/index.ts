import express from 'express'
import { ENVIRONMENT } from "./environment/env"
import express from 'express'
import { SqliteDatabase } from './infra/persistence/sqlite/database'
import { EventRepository } from './infra/persistence/sqlite/event-repository'
import { CreateEventUseCase } from './application/use-cases/create-event.use-case'
import { GetEventByIdUseCase } from './application/use-cases/get-event-by-id.use-case'
import { ListEventsUseCase } from './application/use-cases/list-events.use-case'
import { GetEventsByTypeUseCase } from './application/use-cases/get-events-by-type.use-case'
import { GetEventsByUserIdUseCase } from './application/use-cases/get-events-by-user-id.use-case'
import { EventController } from './presentation/controllers/event.controller'
import { HealthController } from './presentation/controllers/health.controller'
import { createEventRoutes } from './presentation/routes/event.routes'
import { createHealthRoutes } from './presentation/routes/health.routes'
import { errorHandlerMiddleware } from './infra/middleware/error-handler.middleware'
import { requestLoggerMiddleware } from './infra/middleware/request-logger.middleware'
import { clientInfoMiddleware } from './infra/middleware/client-info.middleware'
import { logger } from './infra/logger/pino'

const app = express()

// Configuração do Express para confiar em proxies (para obter IP real)
app.set('trust proxy', true)

// Middleware de logging de requisições (deve vir antes de outros middlewares)
app.use(requestLoggerMiddleware)

// Middleware para extrair informações do cliente (IP e User-Agent)
app.use(clientInfoMiddleware)

// Rate limiting global (opcional - pode ser aplicado apenas em rotas específicas)
// app.use(generalRateLimiter)

// Middleware para parsing JSON
app.use(express.json())

// Inicializa o banco de dados
const database = new SqliteDatabase()
database.connect()

// Inicializa repositório
const eventRepository = new EventRepository(database)

// Inicializa casos de uso
const createEventUseCase = new CreateEventUseCase(eventRepository)
const getEventByIdUseCase = new GetEventByIdUseCase(eventRepository)
const listEventsUseCase = new ListEventsUseCase(eventRepository)
const getEventsByTypeUseCase = new GetEventsByTypeUseCase(eventRepository)
const getEventsByUserIdUseCase = new GetEventsByUserIdUseCase(eventRepository)

// Inicializa controllers
const eventController = new EventController(
  createEventUseCase,
  getEventByIdUseCase,
  listEventsUseCase,
  getEventsByTypeUseCase,
  getEventsByUserIdUseCase
)

const healthController = new HealthController(database)

// Configura rotas
app.use('/api/events', createEventRoutes(eventController))
app.use('/health', createHealthRoutes(healthController))

// Middleware global de tratamento de erros
app.use(errorHandlerMiddleware)

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('🛑 Shutting down gracefully...')
  database.disconnect()
  process.exit(0)
})

process.on('SIGTERM', () => {
  logger.info('🛑 Shutting down gracefully...')
  database.disconnect()
  process.exit(0)
})

app.listen(ENVIRONMENT.PORT, () => {
    logger.info({
      port: ENVIRONMENT.PORT,
      environment: process.env.NODE_ENV || 'development'
    }, '🚀 Server started')
    logger.info(`📡 API available at http://localhost:${ENVIRONMENT.PORT}/api/events`)
    logger.info(`🏥 Health check available at http://localhost:${ENVIRONMENT.PORT}/health`)
})
