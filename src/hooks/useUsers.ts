import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api, { handleApiResponse } from '../api/client';
import type { User, ApiResponse } from '../api';
import { queryKeys } from '../lib/queryClient';

// Hook to fetch user by ID
export const useUser = (userId?: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId || ''),
    queryFn: async (): Promise<User> => {
      if (!userId) throw new Error('User ID is required');
      const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return handleApiResponse(response);
    },
    enabled: enabled && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: unknown) => {
      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 404 || axiosError?.response?.status === 400) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook to get client name by ID with fallback
export const useClientName = (clientId?: string, enabled = true) => {
  const { data: client, isLoading, error } = useUser(clientId, enabled);
  
  return {
    clientName: client?.name || clientId || 'Unknown Client',
    isLoading,
    error,
    isFallback: !client,
  };
};

// Query keys for user management
export const queryKeysUsers = {
  all: ['users'] as const,
  lists: () => [...queryKeysUsers.all, 'list'] as const,
  list: (filters?: string) => [...queryKeysUsers.lists(), filters] as const,
  details: () => [...queryKeysUsers.all, 'detail'] as const,
  detail: (id: string) => [...queryKeysUsers.details(), id] as const,
};

export default {
  useUser,
  useClientName,
};
