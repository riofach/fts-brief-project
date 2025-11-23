import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '../api/client';
import type {
  Discussion,
  CreateDiscussionRequest,
  DiscussionsResponse,
  User,
  ApiError,
} from '../api';
import { queryKeys } from '../lib/queryClient';
import type { ErrorCode } from '../api';

// ====================
// DISCUSSION LIST HOOKS
// ====================

// Hook to fetch discussions for a specific brief
export const useBriefDiscussions = (
  briefId?: string,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.discussions.byBrief(briefId || ''),
    queryFn: async () => {
      if (!briefId) return [];
      const response = await api.get(`/briefs/${briefId}/discussions`);
      return response.data.data.discussions || [];
    },
    enabled: enabled && !!briefId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) {
        return false;
      }
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook to fetch current user's own discussions
export const useMyDiscussions = (enabled = true) => {
  return useQuery({
    queryKey: queryKeys.discussions.my,
    queryFn: async (): Promise<Discussion[]> => {
      const response = await api.get('/discussions/my');
      return response.data.data.discussions || [];
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook for admin to search discussions
export const useSearchDiscussions = (searchQuery?: string, enabled = false) => {
  return useQuery({
    queryKey: queryKeys.discussions.search(searchQuery || ''),
    queryFn: async () => {
      if (!searchQuery) return [];
      const response = await api.get('/discussions/search', {
        params: { q: searchQuery }
      });
      return response.data.data.discussions || [];
    },
    enabled: enabled && !!searchQuery && searchQuery.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2; // Fewer retries for search
    },
  });
};

// ====================
// DISCUSSION CREATION HOOKS
// ====================

// Hook to post a new discussion message
export const usePostDiscussion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      briefId,
      message,
    }: { briefId: string; message: string }): Promise<Discussion> => {
      const response = await api.post(`/briefs/${briefId}/discussions`, {
        message
      });
      return response.data.data;
    },
    onSuccess: (newDiscussion, variables) => {
      // Update the specific brief discussions query cache
      queryClient.setQueryData<Discussion[]>(
        queryKeys.discussions.byBrief(variables.briefId),
        (oldDiscussions = []) => {
          // Append new discussion to the end (chronological order)
          return [...oldDiscussions, newDiscussion];
        }
      );
      
      // Invalidate other discussion queries that might be affected
      queryClient.invalidateQueries({ queryKey: queryKeys.discussions.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.discussions.all });
      
      // If the user can see notifications, invalidate those too
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      
      // toast.success('Message sent'); // Optional: Chat interfaces often don't toast on send
    },
  });
};

// ====================
// DISCUSSION DELETION HOOKS (ADMIN ONLY)
// ====================

// Hook to delete a discussion message (admin only)
export const useDeleteDiscussion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (discussionId: string): Promise<void> => {
      await api.delete(`/discussions/${discussionId}`);
    },
    onSuccess: (_, discussionId) => {
      // Remove the deleted discussion from all relevant query caches
      queryClient.removeQueries({
        predicate: (query) => {
          // Remove from specific brief discussions
          const briefKey = query.queryKey.find((key: string) => 
            key.startsWith('discussions-by-brief-')
          );
          if (briefKey) {
            // Get the existing discussions array and filter out the deleted one
            const existingDiscussions = query.state.data as Discussion[] | undefined;
            if (existingDiscussions) {
              const filtered = existingDiscussions.filter(d => d.id !== discussionId);
              queryClient.setQueryData(query.queryKey, filtered);
            }
            return true;
          }
          
          // Remove from my discussions
          if (query.queryKey.includes('discussions-my')) {
            const existingDiscussions = query.state.data as Discussion[] | undefined;
            if (existingDiscussions) {
              const filtered = existingDiscussions.filter(d => d.id !== discussionId);
              queryClient.setQueryData(query.queryKey, filtered);
            }
            return true;
          }
          
          // Remove from search results
          if (query.queryKey.some(key => key.startsWith('discussions-search-'))) {
            const existingDiscussions = query.state.data as Discussion[] | undefined;
            if (existingDiscussions) {
              const filtered = existingDiscussions.filter(d => d.id !== discussionId);
              queryClient.setQueryData(query.queryKey, filtered);
            }
            return true;
          }
          
          return false;
        },
      });
      
      // Invalidate all discussion-related queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.discussions.all });
      
      toast.success('Message deleted');
    },
  });
};

// ====================
// OPTIMISTIC UPDATES
// ====================

// Hook for optimistic discussion updates
export const useOptimisticDiscussionUpdate = () => {
  const queryClient = useQueryClient();
  
  const addDiscussionOptimistically = (
    briefId: string,
    tempId: string,
    message: string,
    userId: string
  ) => {
    // Create temporary discussion object
    const tempDiscussion: Discussion = {
      id: tempId,
      briefId,
      userId,
      message,
      timestamp: new Date().toISOString(),
      isFromAdmin: false // Will be determined by server
    };
    
    // Add to the brief discussions cache
    queryClient.setQueryData<Discussion[]>(
      queryKeys.discussions.byBrief(briefId),
      (oldDiscussions = []) => [...oldDiscussions, tempDiscussion]
    );
  };
  
  const removeOptimisticDiscussion = (
    briefId: string,
    tempId: string
  ) => {
    // Remove from the brief discussions cache
    queryClient.setQueryData<Discussion[]>(
      queryKeys.discussions.byBrief(briefId),
      (oldDiscussions = []) => 
        oldDiscussions.filter(d => d.id !== tempId)
    );
  };
  
  const replaceOptimisticDiscussion = (
    briefId: string,
    tempId: string,
    realDiscussion: Discussion
  ) => {
    // Replace the optimistic discussion with the real one
    queryClient.setQueryData<Discussion[]>(
      queryKeys.discussions.byBrief(briefId),
      (oldDiscussions = []) => 
        oldDiscussions.map(d => 
          d.id === tempId ? realDiscussion : d
        )
    );
  };
  
  return {
    addDiscussionOptimistically,
    removeOptimisticDiscussion,
    replaceOptimisticDiscussion,
  };
};

// ====================
// COMPOSITE HOOKS
// ====================

// Hook that provides all discussion functionality for a component
export const useDiscussions = (briefId?: string, enabled = true) => {
  const discussionsQuery = useBriefDiscussions(briefId, enabled);
  const postDiscussionMutation = usePostDiscussion();
  const deleteDiscussionMutation = useDeleteDiscussion();
  const optimisticUpdate = useOptimisticDiscussionUpdate();
  
  return {
    // Data and loading states
    discussions: discussionsQuery.data || [],
    isLoading: discussionsQuery.isLoading,
    error: discussionsQuery.error,
    
    // Mutations
    postDiscussion: postDiscussionMutation.mutate,
    deleteDiscussion: deleteDiscussionMutation.mutate,
    
    // Mutation states
    isPosting: postDiscussionMutation.isPending,
    isDeleting: deleteDiscussionMutation.isPending,
    postError: postDiscussionMutation.error,
    deleteError: deleteDiscussionMutation.error,
    
    // Optimistic updates
    optimisticUpdate,
    
    // Utils
    refetch: discussionsQuery.refetch,
  };
};

// ====================
// ADMIN DISCUSSION HOOKS
// ====================

// Hook that provides admin-specific discussion functionality
export const useAdminDiscussions = (briefId?: string, enabled = true) => {
  const discussionsQuery = useBriefDiscussions(briefId, enabled);
  const deleteDiscussionMutation = useDeleteDiscussion();
  const searchDiscussionsQuery = useSearchDiscussions();
  
  return {
    // Data and loading states
    discussions: discussionsQuery.data || [],
    isLoading: discussionsQuery.isLoading,
    error: discussionsQuery.error,
    
    // Admin-specific operations
    deleteDiscussion: deleteDiscussionMutation.mutate,
    searchDiscussions: searchDiscussionsQuery.refetch,
    
    // Search functionality
    searchResults: searchDiscussionsQuery.data || [],
    isSearching: searchDiscussionsQuery.isLoading,
    searchError: searchDiscussionsQuery.error,
    
    // Mutation states
    isDeleting: deleteDiscussionMutation.isPending,
    deleteError: deleteDiscussionMutation.error,
    
    // Utils
    refetch: discussionsQuery.refetch,
  };
};

// ====================
// ERROR HANDLING HELPERS
// ====================

// Helper function to handle discussion-related errors
export const getDiscussionErrorMessage = (errorCode: ErrorCode): string => {
  const errorMessages: Record<ErrorCode, string> = {
    DISCUSSION_NOT_FOUND: 'Discussion not found.',
    BRIEF_NOT_FOUND: 'Brief not found.',
    USER_NOT_FOUND: 'User not found.',
    VALIDATION_ERROR: 'Please check your message and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'You do not have permission to access this discussion.',
    INTERNAL_SERVER_ERROR: 'An error occurred while processing your request.',
    
    // Other error codes
    AUTH_FAILED: 'Authentication failed.',
    TOKEN_EXPIRED: 'Your session has expired.',
    TOKEN_INVALID: 'Invalid token.',
    ROUTE_NOT_FOUND: 'API endpoint not found.',
    DELIVERABLE_NOT_FOUND: 'Deliverable not found.',
    NOTIFICATION_NOT_FOUND: 'Notification not found.',
    BRIEF_ALREADY_EXISTS: 'A brief with this name already exists.',
    INVALID_STATUS_TRANSITION: 'Invalid status transition.',
  };

  return errorMessages[errorCode] || 'An error occurred while managing discussions.';
};

export default {
  // Query hooks
  useBriefDiscussions,
  useMyDiscussions,
  useSearchDiscussions,
  
  // Mutation hooks
  usePostDiscussion,
  useDeleteDiscussion,
  
  // Optimistic updates
  useOptimisticDiscussionUpdate,
  
  // Composite hooks
  useDiscussions,
  useAdminDiscussions,
  
  // Error handling
  getDiscussionErrorMessage,
};
