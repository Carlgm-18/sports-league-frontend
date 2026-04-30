import {
  UserAuthResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserDetails,
} from '@/types/api';
import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';

export const userRegister = async (
  newUser: UserCreateRequest,
): Promise<ApiResult<UserCreateResponse>> =>
  await apiClient.post<UserCreateResponse>('/users/register', newUser);

export const getCurrentUser = async (): Promise<ApiResult<UserDetails>> =>
  await apiClient.get<UserDetails>('/users/me');

export const userLogin = async (
  email: string,
  password: string,
): Promise<ApiResult<UserAuthResponse>> =>
  await apiClient.post<UserAuthResponse>('/users/login', { email, password });
