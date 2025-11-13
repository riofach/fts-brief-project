import { useEffect } from 'react';
import { toast } from './use-toast';
import type { ErrorCode } from '../api';

// Error code to user-friendly message mapping
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    UNAUTHORIZED: 'Please log in to continue.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    AUTH_FAILED: 'Invalid email or password. Please check your credentials.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    TOKEN_INVALID: 'Invalid or malformed token. Please log in again.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    BRIEF_NOT_FOUND: 'The requested brief could not be found.',
    USER_NOT_FOUND: 'User account not found.',
    DELIVERABLE_NOT_FOUND: 'The requested deliverable could not be found.',
    DISCUSSION_NOT_FOUND: 'The requested discussion could not be found.',
    NOTIFICATION_NOT_FOUND: 'The requested notification could not be found.',
    ROUTE_NOT_FOUND: 'The requested page could not be found.',
    INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};

// Hook to handle authentication errors globally
export const useAuthErrorHandler = () => {
  useEffect(() => {
    const handleAuthError = (event: CustomEvent) => {
      const { errorCode, context } = event.detail;
      const message = getAuthErrorMessage(errorCode);
      
      if (context === 'login') {
        toast({
          title: "Login Failed",
          description: message,
          variant: "destructive",
        });
      } else if (context === 'logout') {
        toast({
          title: "Logout Failed",
          description: message,
          variant: "destructive",
        });
      } else if (context === 'refresh') {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
      } else if (context === 'unauthorized') {
        toast({
          title: "Unauthorized",
          description: message,
          variant: "destructive",
        });
      }
    };

    window.addEventListener('auth-error', handleAuthError as EventListener);
    
    return () => {
      window.removeEventListener('auth-error', handleAuthError as EventListener);
    };
  }, []);
};

// Utility function to emit auth errors
export const emitAuthError = (errorCode: ErrorCode, context: string = 'general') => {
  window.dispatchEvent(
    new CustomEvent('auth-error', {
      detail: { errorCode, context }
    })
  );
};

export default {
  getAuthErrorMessage,
  useAuthErrorHandler,
  emitAuthError,
};
