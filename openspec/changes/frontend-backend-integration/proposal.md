# Frontend-Backend Integration Change Proposal

## Why
The current FTS Brief Management System has a complete, production-ready backend API with 18 endpoints, but the React frontend is still using mock data stored in React Context. This disconnect means users cannot persist data, authenticate properly, or access real-time project information. The system needs to connect the frontend to the backend API to become a fully functional application.

## What Changes
- Replace React Context-based mock data with TanStack Query API calls
- Implement JWT-based authentication with token management and refresh
- Connect all frontend components to real backend endpoints
- Add proper error handling for API failures and network issues
- Maintain existing UI/UX while enabling data persistence
- Add loading states and optimistic updates for better user experience

### Breaking Changes
- **Authentication Flow**: Will change from hardcoded mock users to real API-based login
- **Data Persistence**: Briefs, discussions, and notifications will persist in database instead of resetting on refresh
- **Error Handling**: New error states will appear when API calls fail

## Impact
- **Affected specs**: 
  - User authentication system (currently mock-based)
  - Brief management system (currently using static data)
  - Discussion system (currently local state only)
  - Notification system (currently mock-based)
  - UI components will need to handle loading and error states

- **Affected code**: 
  - Frontend contexts (AuthContext, AppContext)
  - All page components using mock data
  - Custom hooks and utility functions
  - API client layer needs to be created
  - Error handling and loading states

- **User Experience**: 
  - Real data persistence across sessions
  - Proper authentication with role-based access
  - Live project updates and notifications
  - Professional-grade error handling

## Technical Approach
1. Create API client layer with axios and interceptors
2. Implement TanStack Query hooks for all data operations
3. Replace Context providers with Query-based state management
4. Add comprehensive error boundaries and loading states
5. Test integration with existing backend API endpoints

## Success Criteria
- Users can log in with real credentials and persist sessions
- All brief operations (create, read, update) work with database
- Discussions and notifications sync with backend
- Proper error handling for network issues and API failures
- Loading states provide clear feedback during data operations
- Existing UI/UX remains unchanged while adding real functionality
