# Client Dashboard Statistics - Design Document

**Date**: 2025-12-15  
**Feature**: Functional Statistics Cards in Client Dashboard  
**Status**: Design Approved

---

## Problem Statement

Client dashboard statistics cards currently show **0** for all metrics (Total Briefs, Pending, In Progress, Completed) even when briefs exist. The statistics need to display accurate counts based on the logged-in client's briefs.

## Current State

### Backend

- ✅ `BriefService.getBriefStatistics()` exists but only for ADMIN (all briefs)
- ❌ No endpoint to expose statistics via HTTP
- ❌ No client-specific statistics method

### Frontend

- ✅ Manual calculation exists in `ClientDashboard.tsx` (lines 35-43)
- ❌ Status mismatch: frontend uses lowercase (`'pending'`), backend uses uppercase (`'PENDING'`)
- ❌ Inefficient: fetches all briefs just to count them

## Chosen Solution: Backend Statistics Endpoint (Best Practice)

### Approach

Create new endpoint `GET /api/briefs/statistics` that returns role-based statistics:

- **CLIENT**: Statistics for their own briefs only
- **ADMIN**: Statistics for all briefs in system

### Benefits

✅ **Performance**: No need to fetch all briefs for counting  
✅ **Scalability**: Efficient for thousands of briefs  
✅ **Consistency**: Single source of truth from database  
✅ **Caching**: TanStack Query auto-cache & refetch  
✅ **Maintainability**: Business logic in backend, UI in frontend

---

## Architecture Design

### Backend Changes

#### 1. New Service Method

**File**: `backend/src/services/briefService.ts`

```typescript
/**
 * Get brief statistics for a specific user (role-based)
 * @param userId - User's ID
 * @param userRole - User's role (CLIENT or ADMIN)
 * @returns Statistics object with counts by status
 */
static async getUserBriefStatistics(
  userId: string,
  userRole: 'CLIENT' | 'ADMIN'
): Promise<{
  total: number;
  pending: number;
  reviewed: number;
  inProgress: number;
  completed: number;
}> {
  // If CLIENT: filter by clientId = userId
  // If ADMIN: count all briefs
  // Use Prisma groupBy for efficient counting
}
```

#### 2. New Controller Method

**File**: `backend/src/controllers/briefController.ts`

```typescript
/**
 * GET /api/briefs/statistics
 * Get brief statistics for current user
 */
static async getStatistics(req: Request, res: Response) {
  const { userId, role } = req.user;
  const stats = await BriefService.getUserBriefStatistics(userId, role);
  return res.status(200).json(
    RESPONSE_FORMAT.success(stats, 'Statistics retrieved successfully')
  );
}
```

#### 3. New Route

**File**: `backend/src/routes/briefs.ts`

```typescript
// IMPORTANT: Define BEFORE /:id route to avoid conflict
router.get('/statistics', BriefController.getStatistics);
```

### Frontend Changes

#### 1. API Hook (TanStack Query)

**File**: `src/api/briefs.ts` or `src/hooks/useBriefs.ts`

```typescript
export const useBriefStatistics = () => {
	return useQuery({
		queryKey: ['briefStatistics'],
		queryFn: async () => {
			const response = await apiClient.get('/briefs/statistics');
			return response.data.data;
		},
		staleTime: 30000, // Cache for 30 seconds
		refetchOnWindowFocus: true,
	});
};
```

#### 2. Update ClientDashboard Component

**File**: `src/pages/ClientDashboard.tsx`

**Changes**:

1. Remove `getStatusStats()` function (lines 35-43)
2. Replace with `useBriefStatistics()` hook
3. Update JSX to use `stats.pending`, `stats.inProgress`, `stats.completed`
4. Handle loading state for statistics

#### 3. Cache Invalidation

**File**: `src/api/mutations.ts` (or wherever mutations are defined)

```typescript
// After creating brief or updating status
onSuccess: () => {
	queryClient.invalidateQueries(['briefStatistics']);
	queryClient.invalidateQueries(['briefs']);
};
```

---

## Error Handling & Edge Cases

### Backend

- **User not authenticated**: Return 401
- **Database error**: Return 500 with error message
- **No briefs**: Return zeros (not an error)

### Frontend

- **Statistics loading**: Show skeleton/loading state
- **Statistics error**: Show fallback UI with zeros, but still display briefs list
- **Network error**: Use cached data (TanStack Query)
- **Concurrent updates**: Auto-refetch with cache invalidation

### Edge Cases

- ✅ New user with no briefs → all zeros
- ✅ Client with mixed status briefs → correct counts
- ✅ Admin viewing all briefs → system-wide counts
- ✅ Brief created/updated → statistics auto-refresh

---

## Testing Strategy

### Backend Tests (TDD)

1. ✅ Client gets only their own statistics
2. ✅ Admin gets all system statistics
3. ✅ Returns zeros for user with no briefs
4. ✅ Correct count for each status (PENDING, REVIEWED, IN_PROGRESS, COMPLETED)
5. ✅ Unauthorized access returns 401
6. ✅ Database error handled gracefully

### Frontend Tests

1. ✅ Statistics cards display correct numbers
2. ✅ Loading state shows skeleton
3. ✅ Error state shows fallback
4. ✅ Statistics update after brief creation
5. ✅ Statistics update after status change

---

## Implementation Order

1. **Backend Service Method** (TDD)

   - Write failing tests
   - Implement `getUserBriefStatistics()`
   - Verify tests pass

2. **Backend Controller & Route**

   - Add controller method
   - Add route (before `/:id`)
   - Test endpoint manually

3. **Frontend API Hook**

   - Create `useBriefStatistics()` hook
   - Test with mock data

4. **Frontend Component Update**

   - Replace manual calculation
   - Handle loading/error states
   - Verify UI updates

5. **Cache Invalidation**

   - Add to create brief mutation
   - Add to update status mutation
   - Test auto-refresh

6. **End-to-End Testing**
   - Create brief → stats update
   - Update status → stats update
   - Multiple clients → isolated stats

---

## Files to Modify

### Backend (3 files)

1. `backend/src/services/briefService.ts` - Add method
2. `backend/src/controllers/briefController.ts` - Add controller
3. `backend/src/routes/briefs.ts` - Add route

### Frontend (2-3 files)

1. `src/api/briefs.ts` - Add hook
2. `src/pages/ClientDashboard.tsx` - Update component
3. `src/api/mutations.ts` - Add invalidation

---

## Success Criteria

✅ Client dashboard shows accurate statistics  
✅ Statistics update in real-time after changes  
✅ Performance: < 100ms response time  
✅ All tests passing (backend + frontend)  
✅ No console errors  
✅ Graceful error handling

---

## Next Steps

Proceed to **Implementation Plan** (`/writing-plans`) for detailed step-by-step tasks.
