# Project Context

## Purpose
Brief Management System for PT Fujiyama Technology Solutions (FTS). This application enables clients to submit detailed project briefs for web design/development projects, and provides admins with tools to manage those briefs, add deliverables, communicate with clients, and track project progress. Currently in prototype phase using mock data.

## Tech Stack
- **Language**: TypeScript
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API (AuthContext, AppContext)
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite with SWC
- **Linting**: ESLint 9 with TypeScript ESLint

## Project Conventions

### Code Style
- **ESLint Configuration**: TypeScript recommended rules + React hooks rules enforced
- **Unused Variables**: Warning disabled (@typescript-eslint/no-unused-vars: off)
- **Component Exports**: Prefer constant exports (react-refresh/only-export-components: warn)
- **Modern Syntax**: ES2020+ features
- **Formatting**: Follow existing patterns (check surrounding code)
- **Path Aliases**: Use `@/` for src imports (e.g., `@/components/ui/button`)

### Architecture Patterns
- **Page-Based Routing**: All pages in `src/pages/`, route configuration in `App.tsx`
- **Component Organization**: 
  - UI components in `src/components/ui/` (shadcn)
  - Feature components in `src/components/`
  - Custom hooks in `src/hooks/`
- **State Management**: 
  - Global state via Context API (AuthContext for auth, AppContext for app data)
  - Server state via TanStack Query
- **Protected Routes**: Role-based access control (client/admin) using ProtectedRoute wrapper
- **Data Layer**: Mock data in `src/data/mockData.ts` (will be replaced with API)
- **Type Safety**: All interfaces defined in mockData.ts (User, Brief, Deliverable, Discussion, Notification)

### Testing Strategy
- **Linting**: Run `npm run lint` before committing
- **Build Verification**: Run `npm run build` to check for type errors and build issues
- Currently no unit tests - prototype phase with mock data

### Git Workflow
- **Main Branch**: `main` (default)
- **Commit Style**: Based on recent commits, use descriptive messages (e.g., "Add mock data for prototype")
- **Uncommitted Files**: .factory/, AGENTS.md, openspec/ currently untracked
- Built with Lovable (https://lovable.dev) - changes from Lovable auto-commit

## Domain Context
**Brief Management System** for a web design/development agency (PT Fujiyama Technology Solutions)

**Key Entities**:
- **Users**: Two roles - `client` (submits briefs) and `admin` (manages briefs)
- **Briefs**: Project specifications including brand details, design preferences, mood themes, reference links
- **Deliverables**: Outputs added by admin (Figma designs, prototypes, websites, documents)
- **Discussions**: Message threads between client and admin on specific briefs
- **Notifications**: System notifications for status updates, new messages, deliverable additions

**Workflows**:
1. Client creates a brief with project requirements (brand, colors, fonts, mood, references)
2. Admin reviews brief and updates status (pending → reviewed → in-progress → completed)
3. Admin adds deliverables (designs, prototypes, etc.) throughout the project
4. Both parties can discuss via message threads on the brief
5. Notifications keep users informed of updates

**Website Types Supported**: Corporate, E-commerce, Portfolio, Hotel/Hospitality, Restaurant, Healthcare, Education, Non-profit, Blog/News, Entertainment

**Design Preferences**: Font styles (Modern, Classic, Playful, Minimalist, Elegant), Mood themes (Elegant, Minimalist, Fun, Professional, Techy, Creative, Bold, Warm)

## Important Constraints
- **Prototype Phase**: Currently using mock data (`src/data/mockData.ts`) - no backend API yet
- **Mock Authentication**: Hardcoded users for demo purposes (admin@fts.com, client@demo.com)
- **No Persistence**: All data resets on page refresh
- **Windows Environment**: Development on Windows (paths use backslashes)
- **Build Modes**: Supports both production and development builds (npm run build:dev)

## External Dependencies
- **Lovable Platform**: Project originally built with Lovable (lovable-tagger in dev dependencies)
- **shadcn/ui**: Component system - follow shadcn conventions for UI components
- **No Backend**: Currently no API, database, or external services (prototype only)
- **Future Integration**: Will need backend API for authentication, brief management, file uploads, real-time notifications
