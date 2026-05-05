import { type ApiResult } from '@/types/own';
import { getStorageItemAsync } from '@/utils/storage';

const API_BASE_URL = 'http://localhost:8079/api/v1';
const TOKEN_KEY = 'access_token';

const getStandardHeaders = async (): Promise<HeadersInit> => {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = await getStorageItemAsync(TOKEN_KEY);
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const handleResponse = async <T>(response: Response): Promise<ApiResult<T>> => {
  if (response.status === 401) {
    // await SecureStore.deleteItemAsync('jwt_token');
    // // authStore.getState().logout();
    // return { ok: false, error: 'Sesión expirada' };
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    return {
      ok: false,
      error: {
        errorCode: response.status,
        errorMessage:
          errorBody.error || `Error inesperado (${response.status})`,
      },
    };
  }

  const data = await response.json();
  return { ok: true, data };
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<ApiResult<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: await getStandardHeaders(),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', error);
      return {
        ok: false,
        error: {
          errorCode: 500,
          errorMessage: 'Error de red. Revisa tu conexión.',
        },
      };
    }
  },

  post: async <T>(endpoint: string, body: any): Promise<ApiResult<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: await getStandardHeaders(),
        body: JSON.stringify(body),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error('API POST Error:', error);
      return {
        ok: false,
        error: {
          errorCode: 500,
          errorMessage: 'Error de red. Revisa tu conexión.',
        },
      };
    }
  },
};
