# FTS Brief Management System - Full Stack Project

## Purpose
Brief Management System for PT Fujiyama Technology Solutions (FTS). This full-stack application enables clients to submit detailed project briefs for web design/development projects, and provides admins with tools to manage those briefs, add deliverables, communicate with clients, and track project progress. The system includes a React frontend with a complete Node.js/Express backend API.

## Project Architecture
**Full-Stack Application** with separate frontend and backend:

- **Frontend**: React 18 + TypeScript (Vite)
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Deployment**: Railway (backend) + Vercel/Netlify (frontend ready)

## Complete Tech Stack

### Frontend Stack
- **Language**: TypeScript
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: React Context API (AuthContext, AppContext)
- **Data Fetching**: TanStack Query (React Query) - Ready for API integration
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui built on Radix UI primitives
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite with SWC
- **Linting**: ESLint 9 with TypeScript ESLint

### Backend Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Railway deployment)
- **ORM**: Prisma (Type-safe database access)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schemas
- **Password Hashing**: bcryptjs
- **CORS**: Cross-origin resource sharing configured
- **Development**: nodemon + tsx for hot reload
- **Build**: TypeScript compilation with tsc
- **Database Management**: Prisma migrations + seeding

## Project Conventions

### Code Style

#### Frontend Conventions
- **ESLint Configuration**: TypeScript recommended rules + React hooks rules enforced
- **Unused Variables**: Warning disabled (@typescript-eslint/no-unused-vars: off)
- **Component Exports**: Prefer constant exports (react-refresh/only-export-components: warn)
- **Modern Syntax**: ES2020+ features
- **Formatting**: Follow existing patterns (check surrounding code)
- **Path Aliases**: Use `@/` for src imports (e.g., `@/components/ui/button`)

#### Backend Conventions
- **ESLint Configuration**: TypeScript ESLint with strict rules
- **Error Handling**: Consistent error response format `{ success: false, error: { code, message } }`
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Database**: Prisma ORM with type-safe queries and migrations
- **Authentication**: JWT tokens with role-based access control
- **Validation**: Zod schemas for request validation
- **Response Format**: Consistent success format `{ success: true, data, message }`

### Naming Conventions

#### Frontend Conventions
- **Components**: PascalCase for all component files and exports (e.g., `UserProfile.tsx`, `BriefCard.tsx`)
- **Utilities & Hooks**: camelCase for functions (e.g., `useAuth.ts`, `utils.ts`)
- **Page Components**: Descriptive PascalCase ending in "Page" (e.g., `LandingPage.tsx`, `AdminDashboard.tsx`)
- **Type/Interface Files**: Place types in `mockData.ts` or co-locate with component if component-specific
- **Constants**: UPPER_SNAKE_CASE for constants (e.g., `BRIEF_STATUS`, `USER_ROLES`)
- **CSS Classes**: Use Tailwind classes; custom classes in kebab-case if needed

#### Backend Conventions
- **Controllers**: PascalCase ending with "Controller" (e.g., `AuthController.ts`, `BriefController.ts`)
- **Services**: PascalCase ending with "Service" (e.g., `AuthService.ts`, `BriefService.ts`)
- **Middleware**: camelCase ending with "Middleware" (e.g., `authMiddleware.ts`, `validationMiddleware.ts`)
- **Routes**: camelCase plural for route files (e.g., `auth.ts`, `briefs.ts`)
- **Utils**: camelCase for utility files (e.g., `jwt.ts`, `dateUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE in `constants.ts`
- **Database Models**: PascalCase matching Prisma schema (e.g., `User`, `Brief`, `Deliverable`)

### Architecture Patterns

#### Frontend Architecture Patterns
- **Page-Based Routing**: All pages in `src/pages/`, route configuration in `App.tsx`
- **Component Organization**: 
  - **UI components** (`src/components/ui/`): shadcn/ui primitives (Button, Card, Dialog, etc.)
  - **Feature components** (`src/components/common/`): Reusable domain-specific components (Navbar, BriefCard, etc.)
  - **Layout components** (`src/components/layout/`): Page layouts and structural components
  - **Custom hooks** (`src/hooks/`): Reusable logic hooks (e.g., use-toast.ts)
  - **Pages** (`src/pages/`): Full page components that connect to routes
- **State Management**: 
  - **AuthContext**: Manages user authentication state (user, login, logout)
  - **AppContext**: Manages app-level data (briefs, discussions, notifications) - *Ready for migration to API*
  - **ThemeContext**: Manages light/dark theme state
  - **TanStack Query**: Ready for backend API integration
- **Protected Routes**: Role-based access control (client/admin) using ProtectedRoute wrapper in App.tsx
- **Data Layer**: Currently mock data in `src/data/mockData.ts` - *Ready for API migration*
- **Type Safety**: TypeScript interfaces defined (User, Brief, Deliverable, Discussion, Notification)

#### Backend Architecture Patterns
- **Layered Architecture**: Clear separation of concerns (Controllers → Services → Database)
- **Controller Layer**: HTTP request handlers, input validation, response formatting
- **Service Layer**: Business logic, data transformation, complex operations
- **Data Access Layer**: Prisma ORM with type-safe database operations
- **Middleware Stack**: Authentication, validation, error handling, CORS
- **Route Organization**: Modular route files (`auth.ts`, `briefs.ts`, `discussions.ts`)
- **Error Handling**: Global error handler with consistent response format
- **JWT Authentication**: Token-based auth with role management
- **Database Design**: PostgreSQL with proper relationships and constraints

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

## API Integration Status

### Backend API Status: ✅ COMPLETE
- **Production-Ready Backend**: Complete Node.js/Express API with PostgreSQL database
- **18 API Endpoints**: Full CRUD operations for all entities
- **Authentication**: JWT-based auth with role management
- **Database**: Railway PostgreSQL with Prisma ORM
- **Documentation**: Complete API documentation in `backend/API_RESPONSE_FORMATS.md`

### Frontend Integration: Ready to Migrate
- **Current State**: Using mock data in React Context
- **Target State**: TanStack Query for server state management
- **Backend Ready**: All endpoints available at `http://localhost:3000/api`

### API Endpoint Structure (Available Now)
```
Authentication:
POST   /api/auth/login           # User login with JWT tokens
POST   /api/auth/refresh         # Refresh access token
POST   /api/auth/logout          # User logout
GET    /api/auth/me              # Get current user

Briefs Management:
GET    /api/briefs               # List user's briefs (role-based)
POST   /api/briefs               # Create new brief
GET    /api/briefs/:id           # Get brief details
PUT    /api/briefs/:id           # Update brief status (admin only)
GET    /api/briefs/:id/deliverables  # Get brief deliverables
POST   /api/briefs/:id/deliverables  # Add deliverable (admin only)

Discussions:
POST   /api/briefs/:id/discussions    # Post message
GET    /api/briefs/:id/discussions    # Get discussion messages
GET    /api/discussions/my            # Get user's messages
GET    /api/discussions/search        # Admin search (admin only)
DELETE /api/discussions/:id           # Delete message (admin only)

System:
GET    /health                   # Health check
GET    /api                      # API information
```

### Migration Strategy (Frontend → Backend Integration)
1. **Create API Client**: Build service layer in `src/api/client.ts`
2. **Replace Context**: Migrate from AppContext to TanStack Query
3. **Update Authentication**: Replace mock login with real API calls
4. **Data Migration**: Replace mock data with API calls
5. **Error Handling**: Implement API error handling with toast notifications

### API Client Pattern (Implementation Ready)
```typescript
// src/api/client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      // Redirect to login if refresh fails
    }
    return Promise.reject(error);
  }
);

export default api;
```

### TanStack Query Integration Pattern
```typescript
// Frontend hooks ready for implementation
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/client';

// Authentication
const { data: user } = useQuery({
  queryKey: ['user'],
  queryFn: () => api.get('/auth/me').then(res => res.data),
});

// Briefs management
const { data: briefs, isLoading } = useQuery({
  queryKey: ['briefs', user?.id],
  queryFn: () => api.get('/briefs').then(res => res.data.data.briefs),
});

const createBriefMutation = useMutation({
  mutationFn: (data) => api.post('/briefs', data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['briefs'] }),
});
```

## External Dependencies

### Frontend Dependencies
- **Lovable Platform**: Project originally built with Lovable (lovable-tagger in dev dependencies)
- **shadcn/ui**: Component system - follow shadcn conventions for UI components
- **TanStack Query**: Installed and ready for API integration (v5.83.0)
- **Framer Motion**: For animations (v12.23.24)
- **Recharts**: For charting/graphs if needed

### Backend Dependencies
- **Node.js**: Runtime environment (v18+)
- **Express.js**: Web application framework
- **Prisma**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Relational database management system
- **JWT**: JSON Web Token for authentication
- **Zod**: TypeScript-first schema validation
- **bcryptjs**: Password hashing library
- **CORS**: Cross-origin resource sharing
- **tsx**: TypeScript runner for development

### Database & Deployment
- **Railway**: PostgreSQL database hosting and backend deployment
- **Prisma Migrations**: Version-controlled database schema changes
- **Environment Management**: Development and production environment configurations

## Project Status Summary

### ✅ Completed Phases (100%)
1. **Backend Development**: Complete Node.js/Express API with PostgreSQL
2. **Frontend Prototype**: React application with mock data and UI components
3. **Database Design**: PostgreSQL schema with proper relationships
4. **Authentication System**: JWT-based auth with role management
5. **API Documentation**: Comprehensive API response format documentation
6. **Environment Setup**: Complete configuration for development and production

### 🚀 Current State
- **Backend**: Production-ready API with 18 endpoints
- **Frontend**: Fully functional prototype with modern UI
- **Database**: Populated with demo data and ready for production
- **Documentation**: Complete setup and integration guides available

### 📋 Next Steps
1. **Frontend Integration**: Migrate from mock data to backend API
2. **Deployment**: Deploy backend to Railway, frontend to Vercel/Netlify
3. **Testing**: End-to-end testing with real data
4. **Production**: Go live with full-stack application

### 🔗 Integration Points
- **API Base URL**: `http://localhost:3000/api` (development)
- **CORS Configuration**: Configured for frontend domain
- **Authentication**: JWT tokens with refresh mechanism
- **Error Handling**: Consistent error responses across frontend and backend
- **Type Safety**: Shared TypeScript interfaces for API communication

## Key Project Files

### Backend (Complete)
```
backend/
├── src/
│   ├── config/          # Environment and constants
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/          # API endpoint definitions
│   └── utils/           # JWT and utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Demo data seeding
│   └── migrations/      # Database migrations
├── API_RESPONSE_FORMATS.md  # Complete API documentation
├── .env.example         # Environment configuration template
└── README.md            # Setup and deployment guide
```

### Frontend (Ready for Integration)
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── common/          # Feature components
│   └── layout/          # Layout components
├── pages/               # Route components
├── contexts/            # React Context (ready for migration)
├── hooks/               # Custom hooks
├── data/
│   └── mockData.ts      # Mock data (ready for API migration)
└── lib/
    └── utils.ts         # Utility functions
```

This project represents a complete full-stack application ready for production deployment and frontend-backend integration.
