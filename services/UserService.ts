import { UserCreateRequest, UserCreateResponse } from '@/types/api';
import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';

export const userRegister = async (
  newUser: UserCreateRequest,
): Promise<ApiResult<UserCreateResponse>> =>
  await apiClient.post<UserCreateResponse>('/users/register', newUser);
