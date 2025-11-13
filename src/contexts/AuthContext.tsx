import React, { createContext, useContext } from 'react';
import { useAuth as useAuthQuery } from '../hooks/useAuth';
import type { User } from '../api';

// AuthContext types
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isRefreshing: boolean;
  isAuthenticated: boolean;
  loginError: any;
  logoutError: any;
  refreshError: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthQuery();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
