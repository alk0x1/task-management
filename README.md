# Task Manager - Aplicação de Gerenciamento de Tarefas
Uma aplicação full-stack para gerenciamento de tarefas com NestJS (backend) e React (frontend).
Pré-requisitos

Node.js (v16+)
PostgreSQL

## Como executar
### Banco de Dados
```bash
# PostgreSQL via Docker
docker run --name task-manager-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=task_manager -p 5432:5432 -d postgres:14
```
### Backend
```bash
# Entrar no diretório do backend
cd backend
# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env

# Executar migrações
npx prisma migrate dev

# Iniciar o servidor
npm run start:dev
# Disponível em http://localhost:3000
```

### Frontend
```bash
# Entrar no diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar a aplicação
npm run dev

# Disponível em http://localhost:5173
```

## Tecnologias

- Backend: NestJS, Prisma, PostgreSQL, JWT
- Frontend: React, TypeScript, Vite, Tailwind CSS