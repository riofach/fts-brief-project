# Backend Architecture & Design Decisions

## Context

The Brief Management System frontend currently uses mock data and context-based state management. To transition to production, we need:
1. Persistent data storage across sessions
2. Real authentication instead of hardcoded demo accounts
3. Multi-user data isolation
4. API for frontend consumption (already planned in openspec/project.md)

## Goals

- Establish baseline backend infrastructure
- Replicate current mock data as MongoDB collections
- Provide REST API matching planned endpoints from project.md
- Enable frontend and backend to develop in parallel
- Make it easy to replace mock data with real API calls

**Non-Goals:**
- Real-time features (WebSockets) - future phase
- Email notifications - future phase
- File uploads/CDN integration - future phase
- Payment processing - future phase

## Decisions

### Decision 1: Database Choice - PostgreSQL

**Selected**: PostgreSQL with Prisma ORM, deployed on Railway

**Rationale**:
- Structured relational model matches domain entities (Users, Briefs, Discussions)
- Strong ACID compliance for data integrity (important for business records)
- User already has PostgreSQL running on Railway (no additional infrastructure needed)
- Prisma provides excellent TypeScript type safety and DX
- Scales better than SQLite; standard for production applications
- Relationships (foreign keys) modeled explicitly and enforced by database

**Alternatives**:
- MongoDB: More flexible schema; overkill for well-structured brief data; different mental model
- SQLite: Local development only; not suitable for multi-user production system

**Risks**:
- Requires schema migrations as requirements change → Mitigation: Prisma migrations are straightforward
- Stricter schema means more upfront planning → Acceptable: Domain is well-understood from frontend

**Connection Details**:
- User has PostgreSQL on Railway
- Connection string stored in `.env` as `DATABASE_URL` (Railway provides this)
- Prisma automatically migrates schema on deploy

---

### Decision 2: Authentication Pattern - JWT Tokens

**Selected**: JWT (JSON Web Tokens) with refresh tokens

**How it works**:
```
Client                          Server
  1. POST /auth/login
     {email, password}  ------>  Verify credentials
                                 Generate JWT (15min expiry)
                                 Generate refresh token (7 days)
  2. Returns tokens   <------   {accessToken, refreshToken}
  
  3. Store tokens in Memory + httpOnly cookie (refresh)
  
  4. GET /briefs
     Header: Authorization: Bearer {accessToken} -----> Verify token
                                                         Return data
  5. Returns briefs   <------ 
  
  6. Token expires after 15 min
  
  7. POST /auth/refresh
     {refreshToken}    ------>  Verify & generate new JWT
  8. New token        <------
```

**Rationale**:
- Stateless: No session storage needed; scales horizontally
- Works with SPA (React) and mobile apps
- Standard practice for modern APIs
- Refresh tokens separate concerns: short-lived access + long-lived refresh

**Alternatives**:
- Session cookies: Requires server-side session store; less suitable for mobile
- OAuth: Overkill for single organization; adds complexity

---

### Decision 3: Folder Structure & Patterns

**Chosen Pattern**: MVC-inspired with services layer

```
backend/src/
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Brief.ts
│   ├── Discussion.ts
│   ├── Deliverable.ts
│   └── Notification.ts
│
├── controllers/         # Request handlers
│   ├── authController.ts
│   ├── briefController.ts
│   └── discussionController.ts
│
├── services/            # Business logic & DB queries
│   ├── authService.ts
│   ├── briefService.ts
│   └── discussionService.ts
│
├── middleware/          # Auth, validation, error handling
│   ├── auth.ts          # JWT verification
│   ├── errorHandler.ts  # Global error catching
│   └── validation.ts    # Zod validation middleware
│
├── routes/              # API endpoint definitions
│   ├── auth.ts
│   ├── briefs.ts
│   ├── discussions.ts
│   └── index.ts
│
├── config/
│   ├── database.ts      # MongoDB connection
│   ├── env.ts           # Environment variables
│   └── constants.ts
│
└── index.ts             # Express app & server setup
```

**Rationale**:
- Separation of concerns: Models, business logic, routing
- Reusable services layer for controller and testing
- Middleware for cross-cutting concerns (auth, validation)
- Matches Django/Rails conventions; familiar to backend devs

---

### Decision 4: Request Validation - Zod

**Selected**: Zod for runtime validation

**Why**:
- Already used in frontend (CreateBrief form) → consistency across stack
- TypeScript-first; type inference from schema
- Can generate OpenAPI docs later
- Better error messages than manual validation

**Example**:
```typescript
const createBriefSchema = z.object({
  projectName: z.string().min(3),
  briefType: z.enum(['Corporate', 'Ecommerce', ...]),
  mainColor: z.string().regex(/^#[0-9A-F]{6}$/i),
});

app.post('/briefs', async (req, res) => {
  const validated = createBriefSchema.parse(req.body); // Throws on invalid
  // ... proceed with validated data
});
```

---

### Decision 5: Dependency Management

**Core Dependencies**:
- express (server framework)
- prisma (ORM for PostgreSQL)
- @prisma/client (Prisma client library)
- zod (validation)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- dotenv (env vars)
- cors (enable frontend requests)

**Dev Dependencies**:
- typescript
- @types/express, @types/node
- tsx (TypeScript runner)
- nodemon (auto-reload)
- eslint (linting)
- prisma (for CLI: migrations, seeds, studio)

**Rationale**: Minimal focused set; Prisma replaces Mongoose with superior TypeScript DX; can add tools (logging, monitoring) in later phases

---

### Decision 6: Error Handling & Response Format

**Global error handler**:
```typescript
// All endpoints return consistent shape:
{
  success: boolean;
  data?: T;
  error?: {
    code: string;      // AUTH_FAILED, BRIEF_NOT_FOUND, etc.
    message: string;   // User-friendly message
  };
}
```

**Rationale**: Frontend knows how to parse every response; consistent error codes for UI

---

### Decision 7: CORS Configuration

**Approach**:
```typescript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,  // Allow cookies
};
app.use(cors(corsOptions));
```

**Rationale**: Restrict to frontend domain; allow credentials for httpOnly cookies

---

## Trade-offs

| Issue | Choice | Trade-off |
|-------|--------|-----------|
| Database | MongoDB | Schema flexibility vs. ACID transactions |
| Auth | JWT | Stateless scalability vs. immediate logout on all devices |
| Validation | Zod | Frontend & backend consistency vs. slight duplication |
| ORM | Mongoose | JavaScript-friendly vs. less control than raw queries |

---

## Migration Plan (Frontend Integration)

**Phase 1: Parallel Development** (Now)
- Backend: Build API with mock data populated initially
- Frontend: Keep mock data; TanStack Query ready for API integration

**Phase 2: Frontend Integration** (Next sprint)
- Replace AuthContext `login()` with API call
- Replace AppContext with TanStack Query hooks
- Point `baseURL` to backend

**Phase 3: Cleanup** (After validation)
- Remove mock data from backend (seed real data or use forms)
- Archive this change proposal
- Update specs/ with final API documentation

---

## Open Questions

1. **Deployment**: Should backend run on same server as frontend (Vercel + serverless functions) or separate VPS?
   - **Decision**: Separate Node.js server (easier to develop; can migrate to serverless later)

2. **Database Seeding**: Should we keep mock data or user-created-only?
   - **Decision**: Keep 1-2 demo briefs in seed script for testing; real briefs come from forms

3. **Pagination**: Any limits on brief lists, discussions per brief?
   - **Decision**: Start with no pagination; add if needed (skip/limit pattern when needed)

4. **File Uploads**: How to handle logo assets, design files?
   - **Decision**: Out of scope; store URLs only for now (Figma links, external URLs)

5. **Rate Limiting**: Needed?
   - **Decision**: No; add in security hardening phase if needed
