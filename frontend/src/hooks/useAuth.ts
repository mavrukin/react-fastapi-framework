/**
 * Authentication hook for managing user session.
 */

import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/auth';

const AUTH_STORAGE_KEY = 'reach_auth_user';
const AUTH_TOKEN_KEY = 'reach_auth_token';

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, token: string, name?: string) => void;
  logout: () => void;
}

/**
 * Hook for managing authentication state.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
  }, []);

  const login = useCallback(
    (email: string, authToken: string, name?: string) => {
      const userData: User = { email, name };
      setUser(userData);
      setToken(authToken);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      localStorage.setItem(AUTH_TOKEN_KEY, authToken);
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }, []);

  return {
    user,
    token,
    isAuthenticated: user !== null && token !== null,
    login,
    logout,
  };
}
