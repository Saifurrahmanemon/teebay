# Teebay Monorepo

Welcome to the **Teebay** monorepo! This repository contains all the source code for the Teebay platform, including backend APIs, frontend applications, and shared packages.

---


https://github.com/user-attachments/assets/e841c35b-7d80-4f01-9096-75f175beec60


## Table of Contents

- [Monorepo Structure](#monorepo-structure)
- [Prerequisites](#prerequisites)
- [Development](#development)
- [Apps](#apps)
  - [API](#api)
  - [Web](#web)
- [Packages](#packages)
  - [Validations](#validations)
  - [Config](#config)

  - [Setup](#setup)
  - [Scripts](#scripts)
  - [Database (Prisma)](#database-prisma)
- [Testing](#testing)
- [Contributing](#contributing)
- [Requirements](#requirements)

---

## Monorepo Structure

```
teebay-monorepo/
├── apps/
│   ├── api/           # Backend GraphQL API (Node.js, TypeScript)
│   └── web/           # Frontend app
├── packages/
│   ├── validations/   # Shared validation logic (Zod)
│   └── config/        # Shared config
├── package.json
├── turbo.json
└── README.md
```

---





## Apps

### API

- **Location:** `apps/api`
- **Description:**  
  The backend GraphQL API for Teebay. Built with Node.js, TypeScript, Prisma, and GraphQL Yoga.
- **Features:**
  - User authentication (JWT)
  - Product management (CRUD)
  - Transactions (buy, rent)
  - Validation using shared packages
  - Prisma ORM for database access

### Web

- **Location:** `apps/web`
- **Description:**  
  The frontend application for Teebay . Typically built with React, Next.js, or similar.
- **Features:**
  - User interface for browsing, buying, and renting products
  - Authentication and user profile management
  - Integration with the API

---

## Packages

### Validations

- **Location:** `packages/validations`
- **Description:**  
  Shared validation schemas and logic for both frontend and backend.
- **Usage:**  
  Imported as `@teebay/validations` in apps.

### Config

- **Location:** `packages/config`
- **Description:**  
  Shared configuration (TypeScript types, constants, etc.) for use across apps and packages.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Development

### Setup

1. **copy .env.example to .env on each workspaces:(currently on apps/api/prisma and apps/web)**

   ```sh
    cp .env.example .env
   ```

2. **Install Dependencies:**

   ```sh
   pnpm i
   ```

3. **Setup Database:**

    ```sh
   docker compose up -d
   ```

4. **Run database migrations:**

   ```sh
    pnpm migrate:dev
   ```


5. **Build Validations:**

   ```sh
    pnpm package:build 
   ```

6. **Run development servers:**
   - API:
     ```sh
     pnpm dev:api
     ```
   - Web:
     ```sh
     pnpm dev:web
     ```
   - All apps:
     ```sh
     pnpm dev
     ```
7. **Access Apps:**
   - Web interface: http://localhost:3000
   - GraphQL API playground: http://localhost:4000/graphql


### Scripts

| Script                 | Description                       |
| ---------------------- | --------------------------------- |
| `pnpm build`           | Type-check and build all projects |
| `pnpm dev`             | Start all apps in dev mode        |
| `pnpm dev:api`         | Start API in dev mode             |
| `pnpm dev:web`         | Start Web in dev mode             |
| `pnpm lint`            | Lint all projects                 |
| `pnpm format`          | Format code with Prettier         |
| `pnpm migrate:dev`     | Run DB migrations (dev)           |
| `pnpm migrate:deploy`  | Run DB migrations (deploy)        |
| `pnpm migrate:reset`   | Reset DB migrations               |
| `pnpm prisma:studio`   | Open Prisma Studio                |
| `pnpm prisma:generate` | Generate Prisma client            |

### Database (Prisma)

- **Generate Prisma Client:**
  ```sh
  pnpm prisma:generate
  ```
- **Open Prisma Studio:**
  ```sh
  pnpm prisma:studio
  ```
- **Run Migrations:**
  ```sh
  pnpm migrate:dev
  ```

---

## Testing

- **Run all tests:**
  ```sh
  pnpm test
  ```
- **Watch mode:**
  ```sh
  pnpm test:watch
  ```
- **Coverage:**
  ```sh
  pnpm test:coverage
  ```

---


---

Troubleshooting
If you get database connection errors:

Verify Docker is running

Check your .env file matches .env.example

Run docker compose down then docker compose up -d to restart containers

If you get dependency errors:

Delete node_modules and .turbo folders

Run pnpm install again

---

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests.
3. Run `pnpm lint` and `pnpm test` before submitting a PR.
4. Open a pull request describing your changes.


---

For more details, see the `apps/` and `packages/` directories or contact the maintainers.
