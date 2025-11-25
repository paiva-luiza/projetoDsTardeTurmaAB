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
import { createEventRoutes } from './presentation/routes/event.routes'
import { errorHandlerMiddleware } from './infra/middleware/error-handler.middleware'

const app = express()
app.use(express.json())

// Configuração do Express para confiar em proxies (para obter IP real)
app.set('trust proxy', true)

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

// Inicializa controller
const eventController = new EventController(
  createEventUseCase,
  getEventByIdUseCase,
  listEventsUseCase,
  getEventsByTypeUseCase,
  getEventsByUserIdUseCase
)

// Configura rotas
app.use('/api/events', createEventRoutes(eventController))

// Middleware global de tratamento de erros
app.use(errorHandlerMiddleware)

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...')
  database.disconnect()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down gracefully...')
  database.disconnect()
  process.exit(0)
})

app.listen(ENVIRONMENT.PORT, () => {
    console.log("🚀 SERVER LISTENING ON PORT " + ENVIRONMENT.PORT)
    console.log("📡 API available at http://localhost:" + ENVIRONMENT.PORT + "/api/events")
})
