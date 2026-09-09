import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import {
  LeagueSummary,
  LeagueDetails,
  LeagueCreateRequest,
  LeaderboardResponse,
  MatchDetails,
  ParticipantDetails,
  ParticipantSummary
} from '@/types/api';

export const getAllLeagues = async (): Promise<ApiResult<LeagueSummary[]>> =>
  await apiClient.get<LeagueSummary[]>('/leagues');

export const createLeague = async (
  league: LeagueCreateRequest
): Promise<ApiResult<LeagueDetails>> =>
  await apiClient.post<LeagueDetails>('/leagues', league);

export const getLeague = async (
  leagueId: number
): Promise<ApiResult<LeagueDetails>> =>
  await apiClient.get<LeagueDetails>(`/leagues/${leagueId}`);

export const joinLeague = async (
  leagueId: number
): Promise<ApiResult<ParticipantDetails>> =>
  await apiClient.post<ParticipantDetails>(`/leagues/${leagueId}/participants`, {});

export const getLeagueParticipants = async (
  leagueId: number
): Promise<ApiResult<ParticipantSummary[]>> =>
  await apiClient.get<ParticipantSummary[]>(`/leagues/${leagueId}/participants`);

export const getLeaderboard = async (
  leagueId: number,
  phaseId?: number,
  roundId?: number
): Promise<ApiResult<LeaderboardResponse>> => {
  const params: Record<string, any> = { phaseId, roundId };
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const endpoint = `/leagues/${leagueId}/leaderboard${query ? `?${query}` : ''}`;
  return await apiClient.get<LeaderboardResponse>(endpoint);
};

export const getLeagueMatches = async (
  leagueId: number,
  phaseId?: number,
  teamId?: number,
  status?: string
): Promise<ApiResult<MatchDetails[]>> => {
  const params: Record<string, any> = { phaseId, teamId, status };
  const query = Object.entries(params)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  const endpoint = `/leagues/${leagueId}/matches${query ? `?${query}` : ''}`;
  return await apiClient.get<MatchDetails[]>(endpoint);
};

export const startLeague = async (
  leagueId: number
): Promise<ApiResult<void>> =>
  await apiClient.post<void>(`/leagues/${leagueId}/start`, {});

export const getUserLeagueStatus = async (
  leagueId: number
): Promise<ApiResult<any>> =>
  await apiClient.get<any>(`/leagues/${leagueId}/my-status`);

export const getUserAvailability = async (
  leagueId: number
): Promise<ApiResult<any[]>> =>
  await apiClient.get<any[]>(`/leagues/${leagueId}/my-status/availability`);

export const updateUserAvailability = async (
  leagueId: number,
  slotIds: number[]
): Promise<ApiResult<void>> =>
  await apiClient.put<void>(`/leagues/${leagueId}/my-status/availability`, slotIds);

export const updateLeague = async (
  leagueId: number,
  leagueData: any
): Promise<ApiResult<LeagueDetails>> =>
  await apiClient.patch<LeagueDetails>(`/leagues/${leagueId}`, leagueData);

export const updateLeagueConfiguration = async (
  leagueId: number,
  configData: any
): Promise<ApiResult<any>> =>
  await apiClient.patch<any>(`/leagues/${leagueId}/configuration`, configData);

export const deleteLeague = async (
  leagueId: number
): Promise<ApiResult<void>> =>
  await apiClient.delete<void>(`/leagues/${leagueId}`);

export const updatePunctuationSystem = async (
  leagueId: number,
  punctuationData: any
): Promise<ApiResult<any>> =>
  await apiClient.put<any>(`/leagues/${leagueId}/punctuation-system`, punctuationData);

export const getPhasesByLeague = async (
  leagueId: number
): Promise<ApiResult<any[]>> =>
  await apiClient.get<any[]>(`/leagues/${leagueId}/phases`);

export const getPhaseDetails = async (
  leagueId: number,
  phaseId: number | string
): Promise<ApiResult<any>> =>
  await apiClient.get<any>(`/leagues/${leagueId}/phases/${phaseId}`);