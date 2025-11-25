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
- **SQLite** - Banco de dados relacional embutido para persistência de eventos
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

### Exemplo de Uso

```bash
POST /api/events
Content-Type: application/json
Authorization: Bearer {API_KEY}

{
  "event": "user_login",
  "timestamp": "2024-01-15T10:30:00Z",
  "metadata": {
    "userId": "123",
    "ip": "192.168.1.1"
  }
}
```

## 📁 Estrutura do Projeto

```
tracer/
├── src/
│   ├── environment/     # Configurações de ambiente
│   ├── infra/           # Camada de infraestrutura
│   │   ├── logger/      # Configuração de logging
│   │   └── persistence/ # Configuração do banco de dados
│   └── index.ts         # Ponto de entrada da aplicação
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
