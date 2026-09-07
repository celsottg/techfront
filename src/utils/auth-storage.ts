import type { AuthUser, Role } from '../types';

export const AUTH_STORAGE_KEYS = {
  token: 'techfront:auth:token',
  role: 'techfront:auth:role',
  usuario: 'techfront:auth:usuario',
} as const;

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEYS.token);
}

export function getStoredRole(): Role | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEYS.role) as Role | null;
}

export function getStoredUsuario(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEYS.usuario);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.role);
  window.localStorage.removeItem(AUTH_STORAGE_KEYS.usuario);
}

export function setAuthStorage(data: { token: string; role: Role; usuario: AuthUser }): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_STORAGE_KEYS.token, data.token);
  window.localStorage.setItem(AUTH_STORAGE_KEYS.role, data.role);
  window.localStorage.setItem(AUTH_STORAGE_KEYS.usuario, JSON.stringify(data.usuario));
}

export function hasAllAuthStored(): boolean {
  return Boolean(getStoredToken() && getStoredRole() && getStoredUsuario());
}
