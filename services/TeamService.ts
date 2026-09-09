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

export const updateParticipantDorsal = async (
  participantId: number,
  dorsal: number
): Promise<ApiResult<any>> =>
  await apiClient.patch<any>(`/participants/${participantId}`, { dorsal });

export const kickPlayerFromTeam = async (
  teamId: number,
  participantId: number
): Promise<ApiResult<void>> =>
  await apiClient.delete<void>(`/teams/${teamId}/members/${participantId}`);

export const deleteTeam = async (
  teamId: number
): Promise<ApiResult<void>> =>
  await apiClient.delete<void>(`/teams/${teamId}`);

export const invitePlayerToTeam = async (
  teamId: number,
  emailOrUserId: string | number
): Promise<ApiResult<any>> =>
  await apiClient.post<any>(`/teams/${teamId}/invitations`, { user: emailOrUserId });

