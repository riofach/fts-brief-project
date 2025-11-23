# FTS Brief Management System

A full-stack application for managing web design/development briefs. This system enables clients to submit project briefs and admins to manage, track, and collaborate on those projects.

## Project Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **State Management**: TanStack Query (React Query)
- **Authentication**: JWT-based auth with role management

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the `DATABASE_URL` and `JWT_SECRET`

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the project root:
   ```bash
   cd .
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add `VITE_API_URL=http://localhost:3000/api` (or your backend URL)

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- **Authentication**: Secure login for Clients and Admins
- **Brief Management**: Create, view, update, and track project briefs
- **Real-time Discussions**: Messaging system for each brief
- **Deliverables**: Admin-managed file/link sharing
- **Notifications**: Real-time updates for status changes and messages

## API Integration

The frontend communicates with the backend via a centralized API client (`src/api/client.ts`) using Axios and TanStack Query.

- **Authentication**: Tokens are stored in localStorage and automatically attached to requests.
- **Error Handling**: Global error boundaries and toast notifications handle API failures.
- **Optimistic Updates**: UI updates immediately for better perceived performance.

## Development

- **Frontend Port**: 8080 (default)
- **Backend Port**: 3000 (default)

For detailed documentation, see `openspec/project.md`.
