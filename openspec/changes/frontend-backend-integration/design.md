# Frontend-Backend Integration Design Document

## Context
The FTS Brief Management System currently has a complete backend API with 18 endpoints serving a React frontend prototype that uses mock data stored in React Context. This change connects the frontend to the real backend API, transforming the prototype into a fully functional application with data persistence, real authentication, and live project management capabilities.

## Goals / Non-Goals

### Goals
- Connect React frontend to existing Node.js/Express backend API
- Replace mock data with real database operations
- Implement proper JWT-based authentication with token management
- Maintain existing UI/UX while adding real functionality
- Add comprehensive error handling and loading states
- Enable data persistence across browser sessions

### Non-Goals
- Modify backend API endpoints or database schema
- Change existing component designs or layouts
- Add new UI features beyond connection to existing backend
- Implement real-time features like WebSockets or push notifications
- Add comprehensive testing framework (focus on integration testing)

## Decisions

### Decision: Use TanStack Query over React Context for Server State
**What**: Replace AppContext (mock data) with TanStack Query for all backend API interactions.

**Why**: 
- TanStack Query provides built-in caching, background updates, and optimistic updates
- Better error handling and loading state management
- Automatic retry mechanisms for failed requests
- Separation of server state from client state
- More scalable for complex data dependencies

**Alternatives Considered**:
- Continue with React Context: Would require manual caching, error handling, and loading state management
- Redux Toolkit: Additional complexity without significant benefits for this use case
- React Query (older name for TanStack Query): Same as chosen solution

### Decision: Use Axios with Interceptors for API Client
**What**: Create centralized API client using axios with request/response interceptors.

**Why**:
- Automatic JWT token attachment to all requests
- Centralized error handling and response transformation
- Better request/response logging for debugging
- Support for request cancellation and timeout handling
- Easy integration with TanStack Query

**Alternatives Considered**:
- Fetch API: More verbose, requires manual interceptors
- React Query's built-in fetch: Less flexibility for custom interceptors

### Decision: Maintain Existing Component Structure
**What**: Keep all existing React components and only change data sources.

**Why**:
- Components are already well-designed and tested
- Minimizes risk of breaking existing functionality
- Faster implementation and testing
- Existing UI/UX patterns are proven and effective

**Alternatives Considered**:
- Component refactoring: Unnecessary risk and complexity
- Component library changes: Not needed for integration

## Architecture Changes

### New API Client Layer
```
src/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   ├── auth.ts           # Authentication API calls
│   ├── briefs.ts         # Brief management API calls
│   ├── discussions.ts    # Discussion API calls
│   └── notifications.ts  # Notification API calls
```

### TanStack Query Integration
```
src/
├── hooks/
│   ├── useAuth.ts        # Authentication queries/mutations
│   ├── useBriefs.ts      # Brief management queries/mutations
│   ├── useDiscussions.ts # Discussion queries/mutations
│   └── useNotifications.ts # Notification queries/mutations
```

### Context Migration Strategy
- Replace AppContext with TanStack Query hooks
- Keep AuthContext but connect to real authentication API
- Remove mock data dependencies
- Maintain existing provider structure for compatibility

## Data Flow Changes

### Current Flow (Mock Data)
```
User Action → React Context → Mock Data → UI Update
```

### New Flow (API Integration)
```
User Action → TanStack Query Hook → API Client → Backend API → Database
                                                    ↘
UI Update ← Query Cache ← Response ← TanStack Query ←
```

## Error Handling Strategy

### Network Errors
- Connection failures: Show offline message with retry option
- Timeout errors: Display timeout message with retry option
- DNS failures: Show connection error with troubleshooting steps

### API Errors
- 4xx errors: Parse error response, show specific user-friendly message
- 5xx errors: Show generic server error with retry option
- Authentication errors: Redirect to login with return URL

### Error Boundaries
- Wrap critical components in error boundaries
- Graceful degradation for non-critical failures
- Recovery mechanisms for common error scenarios

## Loading State Strategy

### Loading Patterns
- **Initial Load**: Skeleton screens for content areas
- **Create/Update**: Optimistic updates with success/error feedback
- **Delete**: Confirmation dialogs with immediate UI updates
- **Navigation**: Route-based loading states

### Performance Optimizations
- Query prefetching for anticipated user actions
- Intelligent background updates for stale data
- Request deduplication for multiple simultaneous requests
- Proper query invalidation patterns

## Migration Plan

### Phase 1: Foundation (Tasks 1.1-1.4)
1. Set up API client and TanStack Query configuration
2. Create TypeScript types from backend API documentation
3. Test basic connectivity to backend endpoints

### Phase 2: Authentication (Tasks 2.1-2.5)
1. Replace mock authentication with real JWT-based auth
2. Implement token refresh mechanism
3. Update protected routes and user state management

### Phase 3: Core Features (Tasks 3.1-4.5)
1. Migrate brief management to real API
2. Connect discussion system to backend
3. Implement deliverable management

### Phase 4: Polish (Tasks 5.1-7.5)
1. Add notification system integration
2. Implement comprehensive error handling
3. Add loading states and user feedback

### Phase 5: Validation (Tasks 8.1-9.4)
1. End-to-end testing with real backend
2. Performance validation
3. Documentation updates

## Risks / Trade-offs

### Risk: Breaking Changes to User Experience
**Mitigation**: Extensive testing of each component during migration
**Recovery**: Feature flags to disable problematic integrations

### Risk: Performance Degradation
**Mitigation**: Query caching and optimization strategies
**Recovery**: Query optimization and caching improvements

### Risk: API Dependency
**Mitigation**: Proper error handling and offline capabilities
**Recovery**: Graceful degradation and retry mechanisms

## Security Considerations

### Token Management
- Store JWT tokens securely (httpOnly cookies preferred, but localStorage acceptable for demo)
- Implement proper token expiration handling
- Clear tokens on logout and authentication failures

### API Security
- Validate all API responses on frontend
- Sanitize displayed content to prevent XSS
- Implement proper CORS handling

## Open Questions

1. **Token Storage**: Should we use httpOnly cookies (more secure) or localStorage (simpler) for demo purposes?
2. **Offline Support**: Should we implement offline capabilities or focus on online-only functionality?
3. **Real-time Updates**: Should we add WebSocket support for live notifications in future iterations?
4. **Performance Monitoring**: Should we add performance monitoring for API calls and user experience metrics?

## Success Metrics

### User Experience
- Login/logout works seamlessly with real backend
- All CRUD operations persist data correctly
- Error states provide clear guidance to users
- Loading states provide appropriate feedback

### Technical Performance
- API response times under 500ms for typical operations
- Query cache hit rate above 80%
- Error rate below 5% for user actions
- Zero data loss during operations

### Integration Quality
- All 18 backend endpoints utilized appropriately
- Proper error handling for all failure scenarios
- Loading states for all asynchronous operations
- Successful token refresh and session management
