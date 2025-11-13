import { QueryClient } from '@tanstack/react-query';

// Create a client with sensible defaults
export const queryClient = new QueryClient({
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
    lists: () => [...queryKeys.deliverables.all, 'list'] as const,
    list: (briefId: string) => [...queryKeys.deliverables.lists(), briefId] as const,
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
