import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import { ResultDetails } from '@/types/api';

export const registerResult = async (
  matchId: number,
  resultDetails: ResultDetails
): Promise<ApiResult<ResultDetails>> =>
  await apiClient.put<ResultDetails>(`/matches/${matchId}/result`, resultDetails);
