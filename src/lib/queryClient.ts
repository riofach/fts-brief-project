import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

// Create a client with sensible defaults
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // Only show toast for 5xx server errors on queries to avoid spamming
      const axiosError = error as AxiosError;
      if (axiosError.response?.status && axiosError.response.status >= 500) {
        toast.error('Server Error', {
          description: 'Something went wrong on the server. Please try again later.',
        });
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      // Show toast for all mutation errors (user actions)
      const message = error.response?.data?.error?.message || error.message || 'An error occurred';
      toast.error('Error', {
        description: message,
      });
    },
  }),
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      // Retry failed requests 3 times
      retry: 3,
      // Don't refetch on window focus for now (can be enabled later)
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect for now
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations 1 time
      retry: 1,
    },
  },
});

// Query keys for consistent cache management
export const queryKeys = {
  // Auth
  auth: {
    me: ['auth', 'me'] as const,
    user: ['auth', 'user'] as const,
  },
  
  // Briefs
  briefs: {
    all: ['briefs'] as const,
    lists: () => [...queryKeys.briefs.all, 'list'] as const,
    list: (filters?: string) => [...queryKeys.briefs.lists(), filters] as const,
    details: () => [...queryKeys.briefs.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.briefs.details(), id] as const,
    deliverables: (briefId: string) => [...queryKeys.briefs.detail(briefId), 'deliverables'] as const,
  },
  
  // Discussions
  discussions: {
    all: ['discussions'] as const,
    lists: () => [...queryKeys.discussions.all, 'list'] as const,
    list: (filters?: string) => [...queryKeys.discussions.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.discussions.all, 'detail', id] as const,
    byBrief: (briefId: string) => ['discussions-by-brief', briefId] as const,
    my: ['discussions', 'my'] as const,
    search: (params?: string) => [...queryKeys.discussions.all, 'search', params] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    unread: ['notifications', 'unread'] as const,
    detail: (id: string) => [...queryKeys.notifications.all, 'detail', id] as const,
  },
  
  // Deliverables
  deliverables: {
    all: ['deliverables'] as const,
    lists: () => ['deliverables', 'list'] as const,
    list: (briefId: string) => ['deliverables', 'list', briefId] as const,
  },
  
  // Users
  users: {
    all: ['users'] as const,
    lists: () => ['users', 'list'] as const,
    list: (filters?: string) => ['users', 'list', filters] as const,
    details: () => ['users', 'detail'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
} as const;

// Helper function to invalidate all queries
export const invalidateAllQueries = () => {
  queryClient.invalidateQueries();
};

// Helper function to clear all queries
export const clearAllQueries = () => {
  queryClient.clear();
};

export default queryClient;
