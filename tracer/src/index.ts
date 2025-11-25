import { ENVIRONMENT } from "./environment/env"
import express from 'express'
import { SqliteDatabase } from './infra/persistence/sqlite/database'

const app = express()
app.use(express.json())

// Inicializa o banco de dados
const database = new SqliteDatabase()
database.connect()

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
    console.log("SERVER LISTENING ON PORT " + ENVIRONMENT.PORT)
})
