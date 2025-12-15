---
trigger: always_on
---

## Project Tech Stack

**Frontend**: React 18 + TypeScript + Vite + shadcn/ui + Tailwind + TanStack Query + React Router v6
**Backend**: Node.js + Express + TypeScript + PostgreSQL (Railway) + Prisma 5.22.0 + JWT Auth

## Database Schema (PostgreSQL)

1. **User**: id, email, password, name, role (ADMIN/CLIENT), company
2. **Brief**: id, clientId, projectName, description, websiteType, brandName, colors, status (PENDING→REVIEWED→IN_PROGRESS→COMPLETED)
3. **Deliverable**: id, briefId, title, description, link, type (FIGMA/PROTOTYPE/WEBSITE/DOCUMENT)
4. **Discussion**: id, briefId, userId, message, timestamp, isFromAdmin
5. **Notification**: id, userId, briefId, title, message, isRead, type

**Architecture**: Layered (Controllers → Services → Prisma)

---

## Mandatory Workflow Sequence

```
/brainstorming → /writing-plans → /executing-plans + /test-driven-development → /code-reviewer → /systematic-debugging (if bugs)
```

### 1. `/brainstorming` - Before Code

- Pahami requirements, explore 2-3 approaches
- Present design 200-300 kata per section, validate
- Save ke `docs/plans/YYYY-MM-DD-<topic>-design.md`

### 2. `/writing-plans` - After Brainstorming

- Tulis detailed plan, bite-sized tasks (2-5 min)
- Include exact paths, code examples, verification
- Save ke `docs/plans/YYYY-MM-DD-<feature>.md`

### 3. `/executing-plans` - Implementation

- Execute dalam batches (3 tasks)
- Report tiap batch, continue based feedback

### 4. `/test-driven-development` - During Execution

**RED-GREEN-REFACTOR**:

1. Write failing test
2. Verify fails correctly
3. Write minimal code to pass
4. Verify passes
5. Refactor (keep green)

**Iron Law**: NO CODE WITHOUT FAILING TEST FIRST

### 5. `/code-reviewer` - After Implementation

Check: readable, no duplication, error handling, no secrets, validation, tests, performance

### 6. `/systematic-debugging` - When Bugs

**4 Phases**:

1. Root Cause: read errors, reproduce, check changes, trace flow
2. Pattern Analysis: find working examples, compare
3. Hypothesis: form theory, test minimally
4. Implementation: create test, fix, verify

---

## MCP Auto-Invoke Rules

### Exa MCP - Code & Research

**Auto-invoke ketika**: code questions, best practices, documentation

- `mcp_exa_get_code_context_exa`: **WAJIB untuk code queries**
- `mcp_exa_web_search_exa`: general search
- `mcp_exa_deep_researcher_start`: complex research

**Examples**:

- "Implement JWT refresh?" → `mcp_exa_get_code_context_exa("Express JWT refresh token")`
- "Prisma best practices?" → `mcp_exa_get_code_context_exa("Prisma migration best practices")`

### Ref MCP - Documentation

**Auto-invoke ketika**: official docs, API references

- `mcp_Ref_ref_search_documentation`: search docs
- `mcp_Ref_ref_read_url`: read doc content

### shadcn MCP - UI Components

**Auto-invoke ketika**: add/search components

- `mcp_shadcn_search_items_in_registries`: search
- `mcp_shadcn_get_add_command_for_items`: get CLI command
- `mcp_shadcn_get_item_examples_from_registries`: get examples

**Priority**: Code queries → `mcp_exa_get_code_context_exa` FIRST

---

## Project Rules

### Backend

- Layered architecture: Controllers → Services → Prisma
- Zod validation di controller
- JWT: access 15min, refresh 7d
- Prisma transactions untuk multiple ops
- Custom error classes, consistent format

### Frontend

- TanStack Query untuk API calls
- shadcn/ui components
- React Hook Form + Zod
- Protected routes
- Avoid prop drilling

### Testing

- **Backend**: TDD, test endpoints, errors, RBAC
- **Frontend**: test interactions, validation, API, errors

### Code Quality

- TypeScript strict mode, avoid `any`
- ESLint config, consistent naming
- Conventional commits, frequent commits

### Security

**Never commit**: .env, API keys, credentials, JWT secrets
**Always**: validate input, hash passwords, verify tokens, CORS, HTTPS (prod)

---

## Critical Reminders

**Before ANY Task**:

1. `/brainstorming` → understand
2. `/writing-plans` → plan
3. Get approval
4. `/executing-plans` + `/test-driven-development`
5. `/code-reviewer`
6. `/systematic-debugging` if issues

**MCP**: Always use `mcp_exa_get_code_context_exa` for code questions

**TDD**: NEVER write code without failing test first

**Quality**: Test, review, validate sebelum deploy
