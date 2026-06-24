import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import { SignImageUrl } from '@/types/api';

export const uploadUserSignature = async (
  signature: SignImageUrl
): Promise<ApiResult<SignImageUrl>> =>
  await apiClient.post<SignImageUrl>('/users/me/signature', signature);

export const getUserSignature = async (): Promise<ApiResult<SignImageUrl>> =>
  await apiClient.get<SignImageUrl>('/users/me/signature');
