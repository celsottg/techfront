import axios from 'axios';
import type { LoginRequest, LoginResponse } from './types';
import { clearAuthStorage, getStoredToken } from './utils/auth-storage';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const url = config.url ?? '';
  const isLoginRoute = url.includes('/login');
  if (isLoginRoute) {
    return config;
  }

  const token = getStoredToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;
    if (status === 401) {
      clearAuthStorage();
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        const currentPath = window.location.pathname + window.location.search;
        const redirectQuery = currentPath && currentPath !== '/'
          ? `?redirect=${encodeURIComponent(currentPath)}`
          : '';
        window.location.href = `/login${redirectQuery}`;
      }
    }
    return Promise.reject(error);
  },
);

export async function apiLogin(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await api.post('/login', credentials);
  return response.data as LoginResponse;
}

export const apiAluno = api;
export const apiProfessor = api;

export default api;
