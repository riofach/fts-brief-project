import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, tokenUtils } from '../api';
import type { User, LoginCredentials } from '../api';

// Query key factory for auth
export const authQueryKeys = {
  me: ['auth', 'me'] as const,
} as const;

// Hook to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: authApi.getCurrentUser,
    enabled: tokenUtils.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 errors (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Auto-refresh when query becomes stale
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Hook for login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      
      // Store tokens and user data
      tokenUtils.setTokens(
        response.accessToken, 
        response.refreshToken, 
        response.user
      );
      
      return response;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
    onError: (error: any) => {
      // Clear any existing auth data on login failure
      tokenUtils.clearTokens();
      console.error('Login failed:', error);
    },
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear all auth data
      tokenUtils.clearTokens();
      
      // Clear all queries from cache
      queryClient.clear();
    },
    onError: (error) => {
      // Still clear auth data even if API call fails
      tokenUtils.clearTokens();
      queryClient.clear();
      console.error('Logout failed:', error);
    },
  });
};

// Hook for token refresh
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await authApi.refreshToken(refreshToken);
      
      // Update stored access token
      localStorage.setItem('accessToken', response.accessToken);
      
      return response;
    },
    onSuccess: () => {
      // Invalidate user query to refetch with new token
      queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
    onError: (error) => {
      // Refresh failed, clear auth data
      tokenUtils.clearTokens();
      queryClient.clear();
      console.error('Token refresh failed:', error);
    },
  });
};

// Custom hook that combines authentication state
export const useAuth = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const refreshMutation = useRefreshToken();
  
  const isAuthenticated = !!user && tokenUtils.isAuthenticated();
  const isLoginLoading = loginMutation.isPending;
  const isLogoutLoading = logoutMutation.isPending;
  
  const login = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };
  
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const refreshToken = async () => {
    try {
      await refreshMutation.mutateAsync();
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };
  
  return {
    // User data
    user,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading,
    
    // Auth actions
    login,
    logout,
    refreshToken,
    
    // Loading states
    isLoggingIn: isLoginLoading,
    isLoggingOut: isLogoutLoading,
    isRefreshing: refreshMutation.isPending,
    
    // Error states
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    refreshError: refreshMutation.error,
  };
};

// Hook to check if user has specific role
export const useRequireRole = (requiredRole: 'ADMIN' | 'CLIENT') => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const hasRole = user?.role === requiredRole;
  const isAuthorized = isAuthenticated && hasRole;
  
  return {
    hasRole,
    isAuthorized,
    isLoading,
    user,
  };
};

export default useAuth;
