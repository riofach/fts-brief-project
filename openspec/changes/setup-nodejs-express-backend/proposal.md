# Backend Setup Proposal: Node.js + Express + PostgreSQL

## Why

The frontend currently uses mock data stored in memory with localStorage, which resets on page refresh. To enable persistent data storage, user authentication, and real-time collaboration features, we need a production-ready backend API. This proposal establishes the foundation for data persistence, authentication, and scalability.

## What Changes

- **Create backend folder** at project root (`backend/`) with Node.js + Express setup
- **Database layer**: PostgreSQL with Prisma ORM (connected to existing Railway database)
- **Authentication system**: JWT-based auth replacing hardcoded mock users
- **REST API endpoints**: Implement all required endpoints for briefs, deliverables, discussions, and notifications
- **Environment configuration**: .env setup with Railway DATABASE_URL, JWT secrets, ports
- **Development tooling**: ESLint, TypeScript, nodemon for auto-reload, Prisma migrations
- **Dependency management**: Separate package.json for backend with focused dependencies

## Impact

- **Affected specs**: 
  - auth-system (replaces mock auth with real JWT)
  - brief-management (replaces memory state with database CRUD)
  - deliverable-management (persistent storage)
  - discussion-system (persistent messaging)
  - notification-system (persistent notifications)

- **Affected frontend code**:
  - AuthContext (replaces mock login with API call)
  - AppContext (replaces mock state with API queries via TanStack Query)
  - Login, Dashboard, CreateBrief pages (will call API endpoints)

- **Breaking change**: Frontend will require backend running to function; mock data will be removed post-migration

- **Migration path**: Frontend and backend developed in parallel; TanStack Query already installed for smooth transition

## Architecture Overview

```
project/
├── backend/                 # NEW: Node.js backend
│   ├── src/
│   │   ├── models/         # MongoDB schemas (User, Brief, etc.)
│   │   ├── routes/         # API endpoint definitions
│   │   ├── controllers/    # Business logic handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── services/       # Database operations
│   │   ├── config/         # Environment & database config
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── src/                     # EXISTING: React frontend
│   ├── pages/
│   ├── contexts/
│   ├── components/
│   └── ...
```

## Key Decisions

1. **MongoDB over PostgreSQL**: Chosen for flexibility during prototype phase; can migrate to SQL later if needed
2. **JWT Authentication**: Stateless, scalable; suitable for mobile and SPA apps
3. **Express.js**: Lightweight, widely adopted, minimal overhead
4. **TypeScript**: Matches frontend tech stack; better IDE support and type safety
5. **Mongoose**: Familiar to Node developers; schema validation at database layer
