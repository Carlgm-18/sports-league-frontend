import { userLogin } from '@/services/UserService';
import { ApiResult } from '@/types/own';
import { createContext, ReactNode, useContext, useState, useEffect } from 'react';

import { UserAuthResponse } from '@/types/api';
import { useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'access_token';

type AuthContextType = {
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<ApiResult<UserAuthResponse>>;
  logout: () => void;
  authToken: string | null;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments, isLoading, router]);

  const login = async (email: string, password: string) => {
    const result = await userLogin(email, password);
    if (result.ok) {
      const token = result.data.accessToken;
      setAuthToken(token);
      setIsAuthenticated(true);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    return result;
  };

  const logout = async () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const value = {
    isAuthenticated,
    authToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
