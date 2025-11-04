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

### Naming Conventions
- **Components**: PascalCase for all component files and exports (e.g., `UserProfile.tsx`, `BriefCard.tsx`)
- **Utilities & Hooks**: camelCase for functions (e.g., `useAuth.ts`, `utils.ts`)
- **Page Components**: Descriptive PascalCase ending in "Page" (e.g., `LandingPage.tsx`, `AdminDashboard.tsx`)
- **Type/Interface Files**: Place types in `mockData.ts` or co-locate with component if component-specific
- **Constants**: UPPER_SNAKE_CASE for constants (e.g., `BRIEF_STATUS`, `USER_ROLES`)
- **CSS Classes**: Use Tailwind classes; custom classes in kebab-case if needed

### Architecture Patterns
- **Page-Based Routing**: All pages in `src/pages/`, route configuration in `App.tsx`
- **Component Organization**: 
  - **UI components** (`src/components/ui/`): shadcn/ui primitives (Button, Card, Dialog, etc.)
  - **Feature components** (`src/components/common/`): Reusable domain-specific components (Navbar, BriefCard, etc.)
  - **Layout components** (`src/components/layout/`): Page layouts and structural components
  - **Custom hooks** (`src/hooks/`): Reusable logic hooks (e.g., use-toast.ts)
  - **Pages** (`src/pages/`): Full page components that connect to routes
- **State Management**: 
  - **AuthContext**: Manages user authentication state (user, login, logout)
  - **AppContext**: Manages app-level data (briefs, discussions, notifications)
  - **ThemeContext**: Manages light/dark theme state
  - **TanStack Query**: For caching and synchronizing server state (prepare for API integration)
- **Protected Routes**: Role-based access control (client/admin) using ProtectedRoute wrapper in App.tsx
- **Data Layer**: Mock data in `src/data/mockData.ts` containing all interfaces and mock data arrays
- **Type Safety**: All interfaces defined in mockData.ts (User, Brief, Deliverable, Discussion, Notification)

### Utility Functions
- **`cn()`** in `src/lib/utils.ts`: Combines clsx and tailwind-merge for safe Tailwind class merging
  - Usage: `className={cn("px-4 py-2", isActive && "bg-blue-500")}`

### Context API Patterns
- **Contexts located in** `src/contexts/`:
  - `AuthContext.tsx`: `useAuth()` hook provides `{ user, login, logout }`
  - `AppContext.tsx`: `useApp()` hook provides app data and methods
  - `ThemeContext.tsx`: `useTheme()` hook provides `{ theme, toggleTheme }`
- **Consumer Pattern**: Always use hook within BrowserRouter provider boundary
  - Example: `const { user } = useAuth()` inside components wrapped by AuthProvider

### Form Patterns
- **React Hook Form + Zod**: Used for form validation and submission
- **Pattern**: Define Zod schema, use `useForm()` with resolver, handle validation in component
- **Error Display**: Display validation errors from `formState.errors` in UI
- **Example**: See CreateBrief page for complete form implementation with multiple fields

### Common Patterns

#### Loading States
- Use conditional rendering with `isLoading` flags from queries or contexts
- Show skeleton loaders or spinner components while data loads
- Pattern: `{isLoading ? <SkeletonCard /> : <Card data={data} />}`

#### Empty States
- Provide user-friendly messages when no data exists
- Example: "No briefs yet. Create your first brief to get started."
- Include action buttons to navigate to creation flows

#### Error Handling
- Catch errors in try-catch blocks; display user-friendly messages via toast notifications
- Use `toast.error()` from sonner for error notifications
- Log errors to console in development; prepare for error tracking service in production

#### Status Updates
- Display current status badges (pending, reviewed, in-progress, completed)
- Use color-coded UI indicators for status visibility
- Example: `<Badge variant={statusVariant}>{status}</Badge>`

#### Role-Based UI
- Check user role from `useAuth()` before rendering admin-specific UI
- Pattern: `{user?.role === 'admin' && <AdminControls />}`
- All protected pages handled at route level in App.tsx

### Development Setup
- **Dev Server**: `npm run dev` starts Vite dev server (typically http://localhost:5173)
- **Build Output**: `dist/` directory contains production build
- **Environment**: Windows development environment (paths use backslashes)
- **Mock Data**: All users and data reset on refresh; hardcoded for demo purposes
- **TypeScript**: Strict mode enabled (tsconfig.json) for type safety

### Code Organization Examples

**Component Structure**:
```
src/components/
├── ui/              # shadcn primitives
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── common/          # Reusable feature components
│   ├── Navbar.tsx
│   ├── BriefCard.tsx
│   └── ...
└── layout/          # Page layout components
    ├── Header.tsx
    └── ...

src/pages/
├── LandingPage.tsx
├── LoginPage.tsx
├── ClientDashboard.tsx
└── ...

src/hooks/
├── use-toast.ts     # Toast notification hook
└── ...

src/contexts/
├── AuthContext.tsx
├── AppContext.tsx
└── ThemeContext.tsx
```

**Import Pattern**:
```typescript
// Always use @ path alias
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
```

### Testing Strategy
- **Linting**: Run `npm run lint` before committing
- **Build Verification**: Run `npm run build` to check for type errors and build issues
- **Local Testing**: Manual testing against mock data in browser
- Currently no unit tests - prototype phase with mock data
- **Pre-commit**: Ensure lint passes and build succeeds

### Git Workflow
- **Main Branch**: `main` (default)
- **Commit Style**: Based on recent commits, use descriptive messages (e.g., "Add mock data for prototype")
- **Uncommitted Files**: .factory/, AGENTS.md, openspec/ currently untracked
- **Pre-commit Checklist**: Run lint and build before pushing
- Built with Lovable (https://lovable.dev) - changes from Lovable auto-commit

## Type System & Data Structure

### Core Interfaces (all defined in `src/data/mockData.ts`)
```typescript
interface User {
  id: string;
  email: string;
  password: string;      // Mock only; never used in production
  name: string;
  role: 'client' | 'admin';
  company?: string;
}

interface Brief {
  id: string;
  clientId: string;
  projectName: string;
  projectDescription: string;
  websiteType: string;   // Corporate, E-commerce, Portfolio, etc.
  brandName: string;
  brandSlogan?: string;
  mainColor: string;     // Hex color code
  secondaryColor?: string;
  fontPreference: string; // Modern, Classic, Playful, Minimalist, Elegant
  moodTheme: string[];    // Array of moods (Elegant, Minimalist, Fun, etc.)
  referenceLinks: string[];
  logoAssets?: string;
  additionalNotes?: string;
  status: 'pending' | 'reviewed' | 'in-progress' | 'completed';
  createdAt: string;     // ISO date string
  updatedAt: string;
  deliverables: Deliverable[];
}

interface Deliverable {
  id: string;
  briefId: string;
  title: string;
  description: string;
  link: string;          // URL to Figma, prototype, website, etc.
  type: 'figma' | 'prototype' | 'website' | 'document';
  addedAt: string;       // ISO date string
}

interface Discussion {
  id: string;
  briefId: string;
  userId: string;
  message: string;
  timestamp: string;     // ISO date string
  isFromAdmin: boolean;
}

interface Notification {
  id: string;
  userId: string;
  briefId: string;
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  type: 'status_update' | 'new_message' | 'deliverable_added';
}
```

### Mock Data Location
- **File**: `src/data/mockData.ts`
- **Contains**: All interfaces + mockUsers, mockBriefs arrays
- **Reset**: On page refresh (no persistence)
- **Demo Accounts**:
  - Admin: `admin@fts.com` / `admin123`
  - Client: `client@demo.com` / `client123`

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

## API Integration Planning

### Current State: Mock Data
- All data managed locally in React Context
- No backend API calls (using mock data from `src/data/mockData.ts`)
- Data persists only during session (resets on refresh)

### Transition Strategy (Future)
1. **Create API Layer**: Build service layer in `src/api/` or `src/services/`
2. **Replace Context**: Migrate from AppContext to TanStack Query for server state
3. **Use Existing Hooks**: TanStack Query already installed and ready (currently unused)
4. **Authentication**: Move from hardcoded users to proper API-based auth
5. **Error Handling**: Implement centralized error handling for API failures

### TanStack Query Pattern (when ready)
```typescript
// Example pattern for API integration
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch briefs
const { data: briefs, isLoading } = useQuery({
  queryKey: ['briefs', userId],
  queryFn: () => api.getBriefs(userId),
});

// Create brief
const { mutate: createBrief } = useMutation({
  mutationFn: (data) => api.createBrief(data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['briefs'] }),
});
```

### API Endpoint Structure (recommended)
```
POST   /auth/login
POST   /auth/logout
GET    /briefs                    # List user's briefs
POST   /briefs                    # Create brief
GET    /briefs/:id                # Get brief details
PUT    /briefs/:id                # Update brief
POST   /briefs/:id/deliverables   # Add deliverable
GET    /briefs/:id/discussions    # Get discussion threads
POST   /briefs/:id/discussions    # Post message
GET    /notifications             # Get user notifications
PUT    /notifications/:id/read    # Mark notification as read
```

## External Dependencies
- **Lovable Platform**: Project originally built with Lovable (lovable-tagger in dev dependencies)
- **shadcn/ui**: Component system - follow shadcn conventions for UI components
- **TanStack Query**: Installed and ready for API integration (v5.83.0)
- **Framer Motion**: For animations (v12.23.24)
- **Recharts**: For charting/graphs if needed
- **Current State**: No backend API or external services (prototype only)
- **Future Integration**: Will need backend API for authentication, brief management, file uploads, real-time notifications
