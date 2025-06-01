# Teebay

A full-stack monorepo app for buying and renting products.

## Tech Stack
- Frontend: React + Apollo Client
- Backend: Express + Apollo Server
- ORM: Prisma
- Database: PostgreSQL
- Monorepo: Turborepo

## Getting Started

### 1. Start Postgres
```bash
docker-compose up -d
```

### 2. Install dependencies
```bash
npm install
```

### 3. Migrate Prisma DB
```bash
npx prisma migrate dev --name init
```

### 4. Run API
```bash
cd apps/api
npm run dev
```

### 5. Run Frontend
```bash
cd apps/web
npm run dev
```
