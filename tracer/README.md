# Tracer - Sistema de Monitoramento de Eventos

## 📋 Sobre o Projeto

O **Tracer** é uma aplicação de monitoramento desenvolvida para capturar, armazenar e gerenciar eventos e logs provenientes de aplicações frontend e backend. O sistema funciona como um serviço centralizado que recebe eventos através de uma API REST e os persiste em um banco de dados SQLite para análise e auditoria posterior.

### Para que serve?

- **Captura de Eventos**: Recebe eventos de diferentes fontes (frontend, backend, APIs) através de rotas REST
- **Armazenamento Persistente**: Salva todos os eventos em um banco de dados SQLite para consultas futuras
- **Auditoria e Logs**: Mantém um histórico completo de eventos para análise, debugging e auditoria
- **Monitoramento Centralizado**: Oferece um ponto único de coleta de eventos de múltiplas aplicações

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v22.14.0) - Runtime JavaScript
- **TypeScript** - Linguagem de programação com tipagem estática
- **Express** - Framework web para criação da API REST
- **SQLite** (better-sqlite3) - Banco de dados relacional embutido para persistência de eventos
- **Pino** - Sistema de logging estruturado e performático
- **express-rate-limit** - Rate limiting para prevenir abuso da API
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Instalação

### Pré-requisitos

- Node.js v22.14.0
- npm ou yarn

### Passos para instalação

1. Clone o repositório ou navegue até o diretório do projeto:
```bash
cd tracer
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto:
```env
PORT=6964
API_KEY=sua_chave_secreta_aqui
DATABASE_URI=./database/tracer.db
```

## 🚀 Como Executar

### Modo de Desenvolvimento

Para executar o projeto em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor será iniciado na porta configurada (padrão: 6964) e ficará observando mudanças nos arquivos.

### Modo de Produção

1. Compile o projeto TypeScript:
```bash
npm run build
```

2. Execute o servidor:
```bash
npm start
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain Driven Design (DDD)**, organizando o código em camadas bem definidas:

- **Domain**: Lógica de negócio e entidades
- **Application**: Casos de uso e serviços
- **Infrastructure**: Implementações concretas (banco de dados, logger, etc.)
- **Presentation**: Controllers e rotas da API

## 📡 API

O sistema expõe rotas REST para receber eventos de monitoramento. As rotas permitem que aplicações clientes enviem eventos que serão armazenados no SQLite.

### Autenticação

Todas as rotas da API (exceto `/health`) requerem autenticação via Bearer Token:

```
Authorization: Bearer {API_KEY}
```

### Rotas Disponíveis

- `GET /health` - Health check do sistema (não requer autenticação)
- `POST /api/events` - Criar novo evento
- `GET /api/events` - Listar eventos (com paginação)
- `GET /api/events/:id` - Buscar evento por ID
- `GET /api/events/type/:type` - Buscar eventos por tipo
- `GET /api/events/user/:userId` - Buscar eventos por user ID

### Rate Limiting

O sistema implementa rate limiting para prevenir abuso:
- **Rotas gerais:** 100 requisições por 15 minutos por IP
- **Criação de eventos:** 30 requisições por minuto por IP
- **Health check:** 60 requisições por minuto por IP

### Documentação Completa

Para documentação detalhada da API, consulte [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Exemplo de Uso

```bash
POST /api/events
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "event": "user_login",
  "source": "web-app",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "userId": "123",
    "action": "login"
  },
  "userId": "user-123"
}
```

## 📁 Estrutura do Projeto

```
tracer/
├── src/
│   ├── domain/              # Camada de domínio (entidades)
│   │   └── entities/
│   ├── application/        # Camada de aplicação (casos de uso, DTOs)
│   │   ├── dto/
│   │   └── use-cases/
│   ├── presentation/       # Camada de apresentação (controllers, rotas)
│   │   ├── controllers/
│   │   └── routes/
│   ├── infra/              # Camada de infraestrutura
│   │   ├── logger/         # Configuração de logging (Pino)
│   │   ├── middleware/     # Middlewares (auth, validation, rate limit, etc.)
│   │   ├── persistence/    # Configuração do banco de dados
│   │   └── utils/          # Utilitários
│   ├── environment/        # Configurações de ambiente
│   └── index.ts            # Ponto de entrada da aplicação
├── API_DOCUMENTATION.md    # Documentação completa da API
├── PLANO.md                # Plano de implementação
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo de desenvolvimento
- `npm run build` - Compila o projeto TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo de produção

## 📝 Licença

ISC

## 👤 Autor

freit4sdev
