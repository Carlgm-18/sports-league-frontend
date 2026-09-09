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

export const updateCurrentUser = async (
  userData: Partial<UserDetails>
): Promise<ApiResult<UserDetails>> =>
  await apiClient.patch<UserDetails>('/users/me', userData);

export const getUserInvitations = async (): Promise<ApiResult<any[]>> =>
  await apiClient.get<any[]>('/users/me/invitations');

export const resolveUserInvitation = async (
  requestId: number,
  accept: boolean
): Promise<ApiResult<any>> =>
  await apiClient.patch<any>(`/users/me/invitations/${requestId}`, {
    status: accept ? 'ACCEPTED' : 'REJECTED',
  });

