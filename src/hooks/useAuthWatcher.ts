import { useEffect } from 'react';
import { tokenUtils } from '../api';

// Hook to monitor authentication state and handle token expiration
export const useAuthWatcher = () => {
  useEffect(() => {
    const checkAuthState = () => {
      const tokens = tokenUtils.getTokens();
      
      // If no access token, user is not authenticated
      if (!tokens.accessToken) {
        return;
      }
      
      // Check if token is expired
      if (tokenUtils.isTokenExpired(tokens.accessToken)) {
        // Try to refresh the token
        console.log('Access token expired, attempting refresh...');
        // The refresh logic will be handled by the API client interceptors
      }
    };

    // Check auth state on mount
    checkAuthState();

    // Set up periodic checks every 30 seconds
    const interval = setInterval(checkAuthState, 30000);

    // Listen for storage changes (in case tokens are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'refreshToken' || e.key === 'user') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};

// Hook to handle automatic logout on token expiration
export const useAutoLogout = () => {
  useEffect(() => {
    const handleTokenExpiration = (event: StorageEvent) => {
      if (event.key === 'accessToken' && event.newValue === null) {
        // Access token was removed, user should be logged out
        console.log('Access token removed, logging out user...');
        window.location.href = '/login';
      }
    };

    window.addEventListener('storage', handleTokenExpiration);

    return () => {
      window.removeEventListener('storage', handleTokenExpiration);
    };
  }, []);
};

// Hook to initialize authentication state
export const useInitializeAuth = () => {
  useEffect(() => {
    // Clear any stale tokens on app initialization
    const tokens = tokenUtils.getTokens();
    
    if (tokens.accessToken && tokenUtils.isTokenExpired(tokens.accessToken)) {
      console.log('Found expired tokens, clearing auth state...');
      tokenUtils.clearTokens();
    }
  }, []);
};

export default {
  useAuthWatcher,
  useAutoLogout,
  useInitializeAuth,
};
