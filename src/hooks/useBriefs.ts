import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import type {
	Brief,
	CreateBriefRequest,
	UpdateBriefStatusRequest,
	Deliverable,
	CreateDeliverableRequest,
	DeliverablesResponse,
	BriefsResponse,
	ApiError,
} from '../api';
import { queryKeys } from '../lib/queryClient';
import type { ErrorCode } from '../api';

// ====================
// BRIEF LIST HOOKS
// ====================

// Hook to fetch briefs list
export const useBriefs = (
	enabled = true,
	options?: {
		staleTime?: number;
		refetchOnWindowFocus?: boolean;
	}
) => {
	return useQuery({
		queryKey: queryKeys.briefs.all,
		queryFn: async (): Promise<Brief[]> => {
			const response = await api.get('/briefs');
			return response.data.data.briefs || [];
		},
		enabled,
		staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes default
		refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
		retry: (failureCount, error: any) => {
			// Don't retry on 401 or 403 errors
			if (error?.response?.status === 401 || error?.response?.status === 403) {
				return false;
			}
			return failureCount < 3;
		},
	});
};

// Hook to fetch briefs filtered by client
export const useBriefsByClient = (clientId?: string, enabled = true) => {
	return useQuery({
		queryKey: queryKeys.briefs.list(clientId),
		queryFn: async (): Promise<Brief[]> => {
			const response = await api.get('/briefs');
			const allBriefs: Brief[] = response.data.data.briefs;

			// Filter briefs by clientId on client side for now
			// Backend should support filtering by clientId in the future
			if (clientId) {
				return allBriefs.filter((brief) => brief.clientId === clientId);
			}
			return allBriefs;
		},
		enabled: enabled && !!clientId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error: any) => {
			if (error?.response?.status === 401 || error?.response?.status === 403) {
				return false;
			}
			return failureCount < 3;
		},
	});
};

// ====================
// SINGLE BRIEF HOOKS
// ====================

// Hook to fetch a single brief by ID
export const useBrief = (briefId?: string, enabled = true) => {
	// Ensure briefId is a valid string before making the request
	const validBriefId =
		briefId &&
		typeof briefId === 'string' &&
		briefId.length > 0 &&
		!briefId.includes('[object Object]')
			? briefId
			: undefined;

	return useQuery({
		queryKey: queryKeys.briefs.detail(validBriefId || ''),
		queryFn: async () => {
			if (!validBriefId) return null;
			const response = await api.get(`/briefs/${validBriefId}`);
			return response.data.data || null;
		},
		enabled: enabled && !!validBriefId,
		staleTime: 5 * 60 * 1000,
		retry: (failureCount, error: any) => {
			if (error?.response?.status === 404) {
				return false; // Don't retry for not found errors
			}
			if (error?.response?.status === 401 || error?.response?.status === 403) {
				return false;
			}
			return failureCount < 3;
		},
	});
};

// ====================
// BRIEF STATISTICS HOOKS
// ====================

// Type for statistics response
export interface BriefStatistics {
	total: number;
	pending: number;
	reviewed: number;
	inProgress: number;
	completed: number;
}

// Hook to fetch brief statistics for current user
export const useBriefStatistics = (enabled = true) => {
	return useQuery({
		queryKey: ['briefStatistics'],
		queryFn: async (): Promise<BriefStatistics> => {
			const response = await api.get('/briefs/statistics');
			return response.data.data;
		},
		enabled,
		staleTime: 30000, // Cache for 30 seconds
		refetchOnWindowFocus: true, // Refetch when user returns to tab
		retry: (failureCount, error: any) => {
			if (error?.response?.status === 401 || error?.response?.status === 403) {
				return false;
			}
			return failureCount < 2;
		},
	});
};

// ====================
// BRIEF CREATION HOOKS
// ====================

// Hook to create a new brief
export const useCreateBrief = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (briefData: CreateBriefRequest): Promise<Brief> => {
			const response = await api.post('/briefs', briefData);
			return response.data.data;
		},
		onSuccess: (newBrief) => {
			// Invalidate and refetch briefs list
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.list(newBrief.clientId) });
			queryClient.invalidateQueries({ queryKey: ['briefStatistics'] }); // Refetch statistics

			// Add the new brief to cache
			queryClient.setQueryData<Brief[]>(queryKeys.briefs.all, (oldBriefs = []) => [
				newBrief,
				...oldBriefs,
			]);

			toast.success('Brief created successfully');
		},
	});
};

// ====================
// BRIEF STATUS UPDATE HOOKS
// ====================

// Hook to update brief status (admin only)
export const useUpdateBriefStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			briefId,
			status,
		}: {
			briefId: string;
			status: UpdateBriefStatusRequest['status'];
		}): Promise<Brief> => {
			const response = await api.put(`/briefs/${briefId}`, { status });
			return response.data.data;
		},
		onSuccess: (updatedBrief) => {
			// Update the brief in all relevant queries
			queryClient.setQueryData<Brief>(queryKeys.briefs.detail(updatedBrief.id), updatedBrief);

			// Invalidate briefs list to refetch with updated status
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.all });
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.list(updatedBrief.clientId) });
			queryClient.invalidateQueries({ queryKey: ['briefStatistics'] }); // Refetch statistics

			toast.success('Brief status updated successfully');
		},
	});
};

// ====================
// DELIVERABLE HOOKS
// ====================

// Removed: Deliverable hooks moved to useDeliverables.ts

// ====================
// OPTIMISTIC UPDATES
// ====================

// Hook for optimistic brief updates
export const useOptimisticBriefUpdate = () => {
	const queryClient = useQueryClient();

	const updateBriefOptimistically = (briefId: string, updates: Partial<Brief>) => {
		// Update the brief in detail query
		queryClient.setQueryData<Brief | undefined>(queryKeys.briefs.detail(briefId), (oldBrief) => {
			if (!oldBrief) return oldBrief;
			return { ...oldBrief, ...updates };
		});

		// Update the brief in lists
		queryClient.setQueryData<Brief[]>(queryKeys.briefs.all, (oldBriefs = []) =>
			oldBriefs.map((brief) => (brief.id === briefId ? { ...brief, ...updates } : brief))
		);

		queryClient.setQueryData<Brief[]>(queryKeys.briefs.list(), (oldBriefs = []) =>
			oldBriefs.map((brief) => (brief.id === briefId ? { ...brief, ...updates } : brief))
		);
	};

	const revertBriefUpdate = (briefId: string, previousData?: Brief) => {
		if (previousData) {
			updateBriefOptimistically(briefId, previousData);
		} else {
			// Invalidate queries if we don't have previous data
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.detail(briefId) });
			queryClient.invalidateQueries({ queryKey: queryKeys.briefs.all });
		}
	};

	return {
		updateBriefOptimistically,
		revertBriefUpdate,
	};
};

// ====================
// ERROR HANDLING HELPERS
// ====================

// Helper function to handle brief-related errors
export const getBriefErrorMessage = (errorCode: ErrorCode): string => {
	const errorMessages: Record<ErrorCode, string> = {
		BRIEF_NOT_FOUND: 'Brief not found.',
		USER_NOT_FOUND: 'User not found.',
		VALIDATION_ERROR: 'Please check your brief data and try again.',
		UNAUTHORIZED: 'You are not authorized to perform this action.',
		FORBIDDEN: 'You do not have permission to access this brief.',
		INTERNAL_SERVER_ERROR: 'An error occurred while processing your request.',
		// Other error codes
		AUTH_FAILED: 'Authentication failed.',
		TOKEN_EXPIRED: 'Your session has expired.',
		TOKEN_INVALID: 'Invalid token.',
		ROUTE_NOT_FOUND: 'API endpoint not found.',
		DELIVERABLE_NOT_FOUND: 'Deliverable not found.',
		DISCUSSION_NOT_FOUND: 'Discussion not found.',
		NOTIFICATION_NOT_FOUND: 'Notification not found.',
		BRIEF_ALREADY_EXISTS: 'A brief with this name already exists.',
		INVALID_STATUS_TRANSITION: 'Invalid status transition.',
	};

	return errorMessages[errorCode] || 'An error occurred while managing briefs.';
};

export default {
	// Query hooks
	useBriefs,
	useBriefsByClient,
	useBrief,
	useBriefStatistics,

	// Mutation hooks
	useCreateBrief,
	useUpdateBriefStatus,

	// Optimistic updates
	useOptimisticBriefUpdate,

	// Error handling
	getBriefErrorMessage,
};
