import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import { BaseRequest, RequestState } from '@/types/api';

export interface ResolveRequestInput {
  status: RequestState;
  rejectionReason?: string;
}

export const createRequest = async (
  leagueId: number,
  requestBody: BaseRequest
): Promise<ApiResult<BaseRequest>> =>
  await apiClient.post<BaseRequest>(`/leagues/${leagueId}/requests`, requestBody);

export const resolveRequest = async (
  requestId: number,
  resolveInput: ResolveRequestInput
): Promise<ApiResult<BaseRequest>> =>
  await apiClient.patch<BaseRequest>(`/requests/${requestId}`, resolveInput);

export const getJoinRequestsByTeamId = async (
  teamId: number
): Promise<ApiResult<BaseRequest[]>> =>
  await apiClient.get<BaseRequest[]>(`/teams/${teamId}/join-requests`);

export const getRequest = async (
  requestId: number
): Promise<ApiResult<BaseRequest>> =>
  await apiClient.get<BaseRequest>(`/requests/${requestId}`);
