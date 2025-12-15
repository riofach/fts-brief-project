# Client Dashboard Statistics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add functional statistics endpoint and integrate it into client dashboard to display accurate brief counts

**Architecture:** Create new backend endpoint `/api/briefs/statistics` that returns role-based statistics (client-specific or admin-wide), then integrate with frontend using TanStack Query for caching and auto-refresh

**Tech Stack:** Express.js, Prisma, TypeScript (Backend) | React, TanStack Query, TypeScript (Frontend)

---

## Task 1: Backend Service - Add getUserBriefStatistics Method

**Files:**

- Modify: `backend/src/services/briefService.ts:663-774`

**Step 1: Write the failing test**

Create: `backend/src/services/__tests__/briefService.statistics.test.ts`

```typescript
import { BriefService } from '../briefService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('BriefService.getUserBriefStatistics', () => {
	let clientId: string;
	let adminId: string;

	beforeAll(async () => {
		// Create test users
		const client = await prisma.user.create({
			data: {
				email: 'test-client-stats@test.com',
				password: 'hashed',
				name: 'Test Client Stats',
				role: 'CLIENT',
			},
		});
		clientId = client.id;

		const admin = await prisma.user.create({
			data: {
				email: 'test-admin-stats@test.com',
				password: 'hashed',
				name: 'Test Admin Stats',
				role: 'ADMIN',
			},
		});
		adminId = admin.id;

		// Create test briefs for client
		await prisma.brief.createMany({
			data: [
				{
					clientId,
					projectName: 'Brief 1',
					projectDescription: 'Test',
					websiteType: 'Corporate',
					brandName: 'Test',
					mainColor: '#000000',
					fontPreference: 'Modern',
					moodTheme: ['Professional'],
					referenceLinks: [],
					status: 'PENDING',
				},
				{
					clientId,
					projectName: 'Brief 2',
					projectDescription: 'Test',
					websiteType: 'Corporate',
					brandName: 'Test',
					mainColor: '#000000',
					fontPreference: 'Modern',
					moodTheme: ['Professional'],
					referenceLinks: [],
					status: 'IN_PROGRESS',
				},
				{
					clientId,
					projectName: 'Brief 3',
					projectDescription: 'Test',
					websiteType: 'Corporate',
					brandName: 'Test',
					mainColor: '#000000',
					fontPreference: 'Modern',
					moodTheme: ['Professional'],
					referenceLinks: [],
					status: 'COMPLETED',
				},
			],
		});
	});

	afterAll(async () => {
		await prisma.brief.deleteMany({
			where: { clientId },
		});
		await prisma.user.deleteMany({
			where: { id: { in: [clientId, adminId] } },
		});
		await prisma.$disconnect();
	});

	it('should return client-specific statistics for CLIENT role', async () => {
		const stats = await BriefService.getUserBriefStatistics(clientId, 'CLIENT');

		expect(stats.total).toBe(3);
		expect(stats.pending).toBe(1);
		expect(stats.inProgress).toBe(1);
		expect(stats.completed).toBe(1);
		expect(stats.reviewed).toBe(0);
	});

	it('should return all statistics for ADMIN role', async () => {
		const stats = await BriefService.getUserBriefStatistics(adminId, 'ADMIN');

		expect(stats.total).toBeGreaterThanOrEqual(3);
		expect(stats.pending).toBeGreaterThanOrEqual(1);
	});

	it('should return zeros for client with no briefs', async () => {
		const newClient = await prisma.user.create({
			data: {
				email: 'empty-client@test.com',
				password: 'hashed',
				name: 'Empty Client',
				role: 'CLIENT',
			},
		});

		const stats = await BriefService.getUserBriefStatistics(newClient.id, 'CLIENT');

		expect(stats.total).toBe(0);
		expect(stats.pending).toBe(0);
		expect(stats.inProgress).toBe(0);
		expect(stats.completed).toBe(0);

		await prisma.user.delete({ where: { id: newClient.id } });
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd backend && npm test -- briefService.statistics.test.ts`  
Expected: FAIL with "getUserBriefStatistics is not a function"

**Step 3: Write minimal implementation**

Modify: `backend/src/services/briefService.ts`

Add after line 663 (after `getBriefStatistics` method):

```typescript
  /**
   * Get brief statistics for a specific user (role-based)
   * @param userId - User's ID
   * @param userRole - User's role (CLIENT or ADMIN)
   * @returns Promise<Statistics>
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
    try {
      // Build where clause based on role
      const where: any = userRole === 'CLIENT' ? { clientId: userId } : {};

      // Get total count and group by status
      const [total, briefsByStatus] = await Promise.all([
        prisma.brief.count({ where }),
        prisma.brief.groupBy({
          by: ['status'],
          where,
          _count: {
            status: true,
          },
        }),
      ]);

      // Initialize counts
      const stats = {
        total,
        pending: 0,
        reviewed: 0,
        inProgress: 0,
        completed: 0,
      };

      // Map status counts
      briefsByStatus.forEach((item) => {
        const status = item.status.toString();
        const count = item._count.status;

        switch (status) {
          case 'PENDING':
            stats.pending = count;
            break;
          case 'REVIEWED':
            stats.reviewed = count;
            break;
          case 'IN_PROGRESS':
            stats.inProgress = count;
            break;
          case 'COMPLETED':
            stats.completed = count;
            break;
        }
      });

      return stats;
    } catch (error) {
      throw createDatabaseError(error as any);
    }
  }
```

**Step 4: Run test to verify it passes**

Run: `cd backend && npm test -- briefService.statistics.test.ts`  
Expected: PASS (all 3 tests)

**Step 5: Commit**

```bash
cd backend
git add src/services/briefService.ts src/services/__tests__/briefService.statistics.test.ts
git commit -m "feat(backend): add getUserBriefStatistics method with tests"
```

---

## Task 2: Backend Controller - Add getStatistics Method

**Files:**

- Modify: `backend/src/controllers/briefController.ts:389-393`

**Step 1: Write the failing test**

Create: `backend/src/controllers/__tests__/briefController.statistics.test.ts`

```typescript
import request from 'supertest';
import express from 'express';
import { BriefController } from '../briefController';
import { authenticateToken } from '../../middleware/auth';

// Mock middleware
jest.mock('../../middleware/auth');

const app = express();
app.use(express.json());
app.get('/api/briefs/statistics', authenticateToken, BriefController.getStatistics);

describe('BriefController.getStatistics', () => {
	it('should return statistics for authenticated client', async () => {
		(authenticateToken as jest.Mock).mockImplementation((req, res, next) => {
			req.user = { userId: 'client-123', role: 'CLIENT' };
			next();
		});

		const response = await request(app).get('/api/briefs/statistics').expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.data).toHaveProperty('total');
		expect(response.body.data).toHaveProperty('pending');
		expect(response.body.data).toHaveProperty('inProgress');
		expect(response.body.data).toHaveProperty('completed');
	});

	it('should return 401 for unauthenticated request', async () => {
		(authenticateToken as jest.Mock).mockImplementation((req, res) => {
			res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED' } });
		});

		await request(app).get('/api/briefs/statistics').expect(401);
	});
});
```

**Step 2: Run test to verify it fails**

Run: `cd backend && npm test -- briefController.statistics.test.ts`  
Expected: FAIL with "getStatistics is not a function"

**Step 3: Write minimal implementation**

Modify: `backend/src/controllers/briefController.ts`

Add after line 389 (after `getDeliverables` method):

```typescript
  /**
   * Handle get brief statistics
   * GET /api/briefs/statistics
   */
  static async getStatistics(req: Request, res: Response) {
    try {
      const currentUser = req.user;

      if (!currentUser) {
        return res.status(HttpStatus.UNAUTHORIZED).json(
          RESPONSE_FORMAT.error(ErrorCode.UNAUTHORIZED, 'User not authenticated')
        );
      }

      const { userId, role: userRole } = currentUser;

      // Call service for business logic
      const statistics = await BriefService.getUserBriefStatistics(userId, userRole);

      return res.status(HttpStatus.OK).json(
        RESPONSE_FORMAT.success(statistics, 'Statistics retrieved successfully')
      );
    } catch (error) {
      console.error('Get statistics error:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        RESPONSE_FORMAT.error(ErrorCode.INTERNAL_SERVER_ERROR, 'Failed to retrieve statistics')
      );
    }
  }
```

**Step 4: Run test to verify it passes**

Run: `cd backend && npm test -- briefController.statistics.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
cd backend
git add src/controllers/briefController.ts src/controllers/__tests__/briefController.statistics.test.ts
git commit -m "feat(backend): add getStatistics controller method"
```

---

## Task 3: Backend Route - Add Statistics Endpoint

**Files:**

- Modify: `backend/src/routes/briefs.ts:64-108`

**Step 1: Add route BEFORE /:id route**

Modify: `backend/src/routes/briefs.ts`

Add after line 72 (after the list briefs route, BEFORE the /:id route):

```typescript
// GET /api/briefs/statistics - Get user's brief statistics
router.get('/statistics', BriefController.getStatistics);
```

**Step 2: Test endpoint manually**

Run backend server:

```bash
cd backend
npm run dev
```

Test with curl (in new terminal):

```bash
# Login first to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@demo.com","password":"client123"}'

# Use token to get statistics
curl http://localhost:3000/api/briefs/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: JSON response with statistics:

```json
{
	"success": true,
	"data": {
		"total": 2,
		"pending": 1,
		"reviewed": 0,
		"inProgress": 1,
		"completed": 0
	},
	"message": "Statistics retrieved successfully"
}
```

**Step 3: Commit**

```bash
cd backend
git add src/routes/briefs.ts
git commit -m "feat(backend): add GET /api/briefs/statistics route"
```

---

## Task 4: Frontend API Hook - Create useBriefStatistics

**Files:**

- Modify: `src/api/briefs.ts` or `src/hooks/useBriefs.ts`

**Step 1: Find existing API hooks file**

Check if file exists:

```bash
ls src/api/briefs.ts
# OR
ls src/hooks/useBriefs.ts
```

**Step 2: Add useBriefStatistics hook**

Add to the file (after existing hooks):

```typescript
/**
 * Hook to fetch brief statistics for current user
 * Uses TanStack Query for caching and auto-refetch
 */
export const useBriefStatistics = () => {
	return useQuery({
		queryKey: ['briefStatistics'],
		queryFn: async () => {
			const response = await apiClient.get('/briefs/statistics');
			return response.data.data; // Extract data from RESPONSE_FORMAT
		},
		staleTime: 30000, // Cache for 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
		retry: 2, // Retry failed requests twice
	});
};

// Type for statistics response
export interface BriefStatistics {
	total: number;
	pending: number;
	reviewed: number;
	inProgress: number;
	completed: number;
}
```

**Step 3: Export the hook**

Ensure it's exported from the file (add to exports if needed)

**Step 4: Commit**

```bash
git add src/api/briefs.ts
git commit -m "feat(frontend): add useBriefStatistics hook"
```

---

## Task 5: Frontend Component - Update ClientDashboard

**Files:**

- Modify: `src/pages/ClientDashboard.tsx:1-220`

**Step 1: Import the new hook**

Modify line 9:

```typescript
import { useBriefsByClient, useBriefStatistics } from '@/api';
```

**Step 2: Replace manual calculation with API hook**

Replace lines 16-45 with:

```typescript
// Use TanStack Query to fetch user's briefs and statistics
const {
	data: userBriefs = [],
	isLoading: briefsLoading,
	error: briefsError,
} = useBriefsByClient(user?.id, isAuthenticated);
const { data: stats, isLoading: statsLoading } = useBriefStatistics();
const navigate = useNavigate();
```

**Step 3: Remove getStatusStats function**

Delete lines 35-43 (the `getStatusStats` function)

**Step 4: Update stats usage**

Replace line 45:

```typescript
// REMOVE: const stats = getStatusStats();
// Stats now comes from useBriefStatistics() hook
```

**Step 5: Handle loading state for statistics**

Update the stats cards section (lines 106-154) to handle loading:

```typescript
{
	/* Stats Cards */
}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
	<Card className="bg-card shadow-md">
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Total Briefs</p>
					<p className="text-2xl font-bold text-foreground">
						{statsLoading ? '...' : stats?.total || 0}
					</p>
				</div>
				<FileText className="h-8 w-8 text-primary" />
			</div>
		</CardContent>
	</Card>

	<Card className="bg-card shadow-md">
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Pending</p>
					<p className="text-2xl font-bold text-foreground">
						{statsLoading ? '...' : stats?.pending || 0}
					</p>
				</div>
				<Clock className="h-8 w-8 text-warning" />
			</div>
		</CardContent>
	</Card>

	<Card className="bg-card shadow-md">
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">In Progress</p>
					<p className="text-2xl font-bold text-foreground">
						{statsLoading ? '...' : stats?.inProgress || 0}
					</p>
				</div>
				<Clock className="h-8 w-8 text-primary" />
			</div>
		</CardContent>
	</Card>

	<Card className="bg-card shadow-md">
		<CardContent className="p-6">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-muted-foreground">Completed</p>
					<p className="text-2xl font-bold text-foreground">
						{statsLoading ? '...' : stats?.completed || 0}
					</p>
				</div>
				<CheckCircle2 className="h-8 w-8 text-success" />
			</div>
		</CardContent>
	</Card>
</div>;
```

**Step 6: Test in browser**

Run frontend:

```bash
npm run dev
```

Navigate to: http://localhost:8080/dashboard  
Expected: Statistics cards show actual numbers (not zeros)

**Step 7: Commit**

```bash
git add src/pages/ClientDashboard.tsx
git commit -m "feat(frontend): integrate statistics API in ClientDashboard"
```

---

## Task 6: Cache Invalidation - Auto-refresh Statistics

**Files:**

- Modify: `src/api/mutations.ts` (or wherever create brief mutation is defined)

**Step 1: Find create brief mutation**

Search for the mutation that creates briefs:

```bash
grep -r "createBrief" src/
```

**Step 2: Add cache invalidation**

In the `onSuccess` callback of create brief mutation, add:

```typescript
onSuccess: () => {
	queryClient.invalidateQueries(['briefStatistics']); // Refetch statistics
	queryClient.invalidateQueries(['briefs']); // Refetch briefs list
	// ... existing success logic
};
```

**Step 3: Add to update status mutation**

Similarly, add to any mutation that updates brief status:

```typescript
onSuccess: () => {
	queryClient.invalidateQueries(['briefStatistics']);
	queryClient.invalidateQueries(['briefs']);
	// ... existing success logic
};
```

**Step 4: Test auto-refresh**

1. Open dashboard
2. Note current statistics
3. Create new brief
4. Return to dashboard
5. Verify statistics updated automatically

**Step 5: Commit**

```bash
git add src/api/mutations.ts
git commit -m "feat(frontend): add cache invalidation for statistics"
```

---

## Task 7: End-to-End Verification

**Step 1: Test complete flow**

1. Login as client
2. View dashboard → statistics should show correct counts
3. Create new brief → statistics auto-update
4. Update brief status → statistics auto-update
5. Logout and login as different client → see only their statistics

**Step 2: Test edge cases**

1. New client with no briefs → all zeros
2. Network error → graceful fallback
3. Multiple tabs → statistics sync across tabs

**Step 3: Check console for errors**

Open browser DevTools → Console  
Expected: No errors

**Step 4: Verify performance**

Open DevTools → Network tab  
Check `/api/briefs/statistics` response time  
Expected: < 100ms

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete client dashboard statistics feature"
```

---

## Verification Checklist

- [ ] Backend tests passing (`npm test` in backend/)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Statistics show correct numbers in UI
- [ ] Statistics update after creating brief
- [ ] Statistics update after changing status
- [ ] Loading states work correctly
- [ ] Error states handled gracefully
- [ ] No console errors
- [ ] Performance < 100ms
- [ ] Works for multiple clients (isolated data)

---

## Rollback Plan

If issues occur:

1. Revert last commit: `git revert HEAD`
2. Or revert to specific commit: `git reset --hard COMMIT_HASH`
3. Restart servers: `npm run dev` (both backend and frontend)

---

## Notes

- Route order matters: `/statistics` must be BEFORE `/:id` in routes file
- Status values are uppercase in backend: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- TanStack Query handles caching automatically
- Cache invalidation ensures statistics stay fresh
