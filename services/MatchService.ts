import { apiClient } from './ApiClient';
import { ApiResult } from '@/types/own';
import { MatchDetails, MatchUpdateRequest, ProposalState } from '@/types/api';

export interface MatchDateProposalCreateRequest {
  dateTimeSlotId: number;
}

export interface MatchDateProposalResolveRequest {
  status: ProposalState;
}

export const getMatchDetails = async (
  matchId: number
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.get<MatchDetails>(`/matches/${matchId}`);

export const updateMatch = async (
  matchId: number,
  requestBody: MatchUpdateRequest
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.patch<MatchDetails>(`/matches/${matchId}`, requestBody);

export const createProposal = async (
  matchId: number,
  proposal: MatchDateProposalCreateRequest
): Promise<ApiResult<any>> =>
  await apiClient.post<any>(`/matches/${matchId}/schedule/proposals`, proposal);

export const resolveProposal = async (
  matchId: number,
  proposalId: number,
  resolveRequest: MatchDateProposalResolveRequest
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.patch<MatchDetails>(
    `/matches/${matchId}/schedule/proposals/${proposalId}`,
    resolveRequest
  );

export const autoAssignReferee = async (
  matchId: number
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.post<MatchDetails>(`/matches/${matchId}/referee/auto`, {});

export const forceAssignReferee = async (
  matchId: number,
  refereeId: number,
  refereeType: 'FIRST' | 'SECOND'
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.put<MatchDetails>(
    `/matches/${matchId}/referee?refereeType=${refereeType}`,
    { refereeId }
  );

export const getRoundAvailability = async (
  roundId: number
): Promise<ApiResult<any[]>> =>
  await apiClient.get<any[]>(`/rounds/${roundId}/availability`);

export const forceScheduleMatch = async (
  matchId: number,
  dateTimeSlotId: number
): Promise<ApiResult<MatchDetails>> =>
  await apiClient.patch<MatchDetails>(`/matches/${matchId}/schedule/force`, { dateTimeSlotId });

export const registerResult = async (
  matchId: number,
  result: any
): Promise<ApiResult<any>> =>
  await apiClient.put<any>(`/matches/${matchId}/result`, result);

export const registerMatchSignature = async (
  matchId: number,
  moment: 'PRE_MATCH' | 'POST_MATCH'
): Promise<ApiResult<any>> =>
  await apiClient.patch<any>(`/matches/${matchId}/signatures`, { moment });

