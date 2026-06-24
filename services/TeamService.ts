import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import { TeamDetails } from '@/types/api';

export const getTeamsByLeague = async (
  leagueId: number
): Promise<ApiResult<TeamDetails[]>> =>
  await apiClient.get<TeamDetails[]>(`/leagues/${leagueId}/teams`);

export const getTeamDetails = async (
  teamId: number
): Promise<ApiResult<TeamDetails>> =>
  await apiClient.get<TeamDetails>(`/teams/${teamId}`);
