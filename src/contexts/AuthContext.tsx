import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthUser, LoginRequest, LoginResponse, Role } from '../types';
import { apiLogin } from '../api';
import {
  clearAuthStorage,
  getStoredRole,
  getStoredToken,
  getStoredUsuario,
  hasAllAuthStored,
  setAuthStorage,
} from '../utils/auth-storage';

interface AuthContextValue {
  token: string | null;
  role: Role | null;
  usuario: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readInitial(): { token: string | null; role: Role | null; usuario: AuthUser | null } {
  if (!hasAllAuthStored()) {
    clearAuthStorage();
    return { token: null, role: null, usuario: null };
  }
  return {
    token: getStoredToken(),
    role: getStoredRole(),
    usuario: getStoredUsuario(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = readInitial();
  const [token, setToken] = useState<string | null>(initial.token);
  const [role, setRole] = useState<Role | null>(initial.role);
  const [usuario, setUsuario] = useState<AuthUser | null>(initial.usuario);

  const isAuthenticated = Boolean(token && role && usuario);

  useEffect(() => {
    const syncStorage = () => {
      const next = readInitial();
      setToken(next.token);
      setRole(next.role);
      setUsuario(next.usuario);
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiLogin(credentials);
    setAuthStorage({
      token: response.token,
      role: response.role,
      usuario: response.usuario,
    });
    setToken(response.token);
    setRole(response.role);
    setUsuario(response.usuario);
    return response;
  }, []);

  const logout = useCallback((): void => {
    clearAuthStorage();
    setToken(null);
    setRole(null);
    setUsuario(null);
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    token,
    role,
    usuario,
    isAuthenticated,
    login,
    logout,
  }), [token, role, usuario, isAuthenticated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider />');
  }
  return ctx;
}
