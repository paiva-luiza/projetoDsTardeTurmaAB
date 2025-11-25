import dotenv from 'dotenv'
dotenv.config()

const ENVIRONMENT = {
    PORT: parseInt(process.env.PORT || '6964', 10),
    API_KEY: process.env.API_KEY || '',
    DATABASE_URI: process.env.DATABASE_URI || './database/tracer.db',
    NODE_ENV: process.env.NODE_ENV || 'development',
    LOG_LEVEL: process.env.LOG_LEVEL || undefined
}

// Validação de variáveis de ambiente obrigatórias
if (!ENVIRONMENT.API_KEY && ENVIRONMENT.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: API_KEY is not set. This is required in production!')
}

export { ENVIRONMENT };
