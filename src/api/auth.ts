import api from './client';
import type {
  ApiResponse,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  User,
} from './types';
import { handleApiResponse, handleApiError } from './client';

// Authentication API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error; // This won't be reached due to handleApiError throwing
    }
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
        refreshToken,
      });
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Logout errors are not critical, we still want to clear local storage
      console.warn('Logout API call failed:', error);
    }
  },

  // Get current user information
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<User>>('/auth/me');
      return handleApiResponse(response);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Token management utilities
export const tokenUtils = {
  // Store tokens securely
  setTokens: (accessToken: string, refreshToken: string, user: User): void => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear tokens
  clearTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get stored tokens
  getTokens: () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      user: localStorage.getItem('user'),
    };
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  },

  // Check if token is expired (basic check)
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true; // Consider invalid tokens as expired
    }
  },
};

export default authApi;
