/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type PhaseBaseDetails = PhasePhaseBaseDetails;

export type ClassificationPhaseDetails = PhaseClassificationPhaseDetails;

export type TournamentPhaseDetails = PhaseTournamentPhaseDetails;

export type PhaseDetails = PhasePhaseDetails;

export type PhaseCreateRequest = PhasePhaseCreateRequest;

export type ClassificationPhaseCreateRequest =
  PhaseClassificationPhaseCreateRequest;

export type TournamentPhaseCreateRequest = PhaseTournamentPhaseCreateRequest;

export type PhaseBaseUpdateRequest = PhasePhaseBaseUpdateRequest;

export type ClassificationPhaseUpdateRequest =
  PhaseClassificationPhaseUpdateRequest;

export type TournamentPhaseUpdateRequest = PhaseTournamentPhaseUpdateRequest;

export type PhaseUpdateRequest = PhasePhaseUpdateRequest;

export type ClassificationGroupDetails = PhaseClassificationGroupDetails;

export type ClassificationGroupCreateRequest =
  PhaseClassificationGroupCreateRequest;

export type ClassificationGroupUpdateRequest =
  PhaseClassificationGroupUpdateRequest;

export type TournamentSlotDetails = PhaseTournamentSlotDetails;

export type TournamentSlotUpdateRequest = PhaseTournamentSlotUpdateRequest;

export type SportDetails = SportSportDetails;

export type FormErrorResponse = ErrorsFormErrorResponse;

export type ValidationError = ErrorsValidationError;

export type UserCategory = UserUserCategory;

export type SignImageUrl = UserSignImageUrl;

export type LicenseElement = UserLicenseElement;

export type LicensesList = UserLicensesList;

export type UserCreateRequest = UserUserCreateRequest;

export type UserCreateResponse = UserUserCreateResponse;

export type UserUpdateRequest = UserUserUpdateRequest;

export type UserLoginRequest = UserUserLoginRequest;

export type UserDetails = UserUserDetails;

export type UserSummary = UserUserSummary;

export type UserAuthResponse = UserUserAuthResponse;

export type LeagueState = LeagueLeagueState;

export type LeagueCategory = LeagueLeagueCategory;

export type LeagueCreateRequest = LeagueLeagueCreateRequest;

export type LeagueUpdateRequest = LeagueLeagueUpdateRequest;

export type ConfigurationCreateRequest = LeagueConfigurationCreateRequest;

export type ConfigurationUpdateRequest = LeagueConfigurationUpdateRequest;

export type ConfigurationDetails = LeagueConfigurationDetails;

export type PunctuationSystemCreateRequest =
  LeaguePunctuationSystemCreateRequest;

export type PunctuationSystemDetails = LeaguePunctuationSystemDetails;

export type PunctuationSystemRuleDetails = LeaguePunctuationSystemRuleDetails;

export type LeagueDetails = LeagueLeagueDetails;

export type LeagueSummary = LeagueLeagueSummary;

export type ParticipantDetails = ParticipantParticipantDetails;

export type ParticipantSummary = ParticipantParticipantSummary;

export type ParticipationRoleDTO = ParticipantParticipationRoleDTO;

export type ParticipantUpdateRequest = ParticipantParticipantUpdateRequest;

export type ParticipantAvailabilityDetails = DateTimeSlotDetails[];

export type TeamDetails = TeamTeamDetails;

export type TeamSummary = TeamTeamSummary;

export type TeamMembersDetails = TeamTeamMembersDetails;

export type RequestState = LeagueRequestsRequestState;

export type BaseRequest = LeagueRequestsBaseRequest;

export type TeamJoinRequestProperties = LeagueRequestsTeamJoinRequestProperties;

export type TeamJoinRequest = LeagueRequestsTeamJoinRequest;

export type TeamCreateRequestProperties =
  LeagueRequestsTeamCreateRequestProperties;

export type TeamCreateRequest = LeagueRequestsTeamCreateRequest;

export type RefereeRequest = LeagueRequestsRefereeRequest;

export type ResolveRequestInput = LeagueRequestsResolveRequestInput;

export type DateTimeSlotDetails = MatchDateTimeSlotDetails;

export type ProposalState = MatchProposalState;

export type MatchState = MatchMatchState;

export type MatchDateProposalCreateRequest =
  MatchMatchDateProposalCreateRequest;

export type MatchDateProposalResolveRequest =
  MatchMatchDateProposalResolveRequest;

export type MatchDateProposalDetails = MatchMatchDateProposalDetails;

export type MatchDetails = MatchMatchDetails;

export type MatchUpdateRequest = MatchMatchUpdateRequest;

export type MatchSummary = MatchMatchSummary;

export type ResultSummary = MatchResultSummary;

export type ResultDetails = MatchResultDetails;

export type ResultRegisterRequest = MatchResultRegisterRequest;

export type MatchSignatures = MatchMatchSignatures;

export type MatchPeriod = MatchMatchPeriod;

export type MatchEvent = MatchMatchEvent;

export type SubstitutionEvent = MatchSubstitutionEvent;

export type SanctionEvent = MatchSanctionEvent;

export type TimeoutEvent = MatchTimeoutEvent;

export type IncidenceCreateRequest = IncidenceIncidenceCreateRequest;

export type IncidenceResolutionRequest = IncidenceIncidenceResolutionRequest;

export type IncidenceDetails = IncidenceIncidenceDetails;

export type UserLeagueStatus = LeagueUserLeagueStatus;

export type LeaderboardRow = LeagueLeaderboardRow;

export type LeaderboardGroup = LeagueLeaderboardGroup;

export type LeaderboardResponse = LeagueLeaderboardResponse;

export type RoundDetails = RoundRoundDetails;

export interface PhasePhaseBaseDetails {
  /** @format int64 */
  id: number;
  name: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  sequenceOrder: number;
  type: PhaseType;
  rounds?: RoundRoundDetails[];
}

export type PhaseClassificationPhaseDetails = PhasePhaseBaseDetails & {
  groups?: PhaseClassificationGroupDetails[];
};

export type PhaseTournamentPhaseDetails = PhasePhaseBaseDetails & {
  matchesOrder: PhaseTournamentSlotDetails[];
  stagesNumber: number;
};

export type PhasePhaseDetails =
  | ({
      type: "CLASSIFICATION";
    } & ClassificationPhaseDetails)
  | ({
      type: "TOURNAMENT";
    } & TournamentPhaseDetails);

export type PhasePhaseCreateRequest = BasePhasePhaseCreateRequest &
  (
    | BasePhasePhaseCreateRequestTypeMapping<
        "CLASSIFICATION",
        ClassificationPhaseCreateRequest
      >
    | BasePhasePhaseCreateRequestTypeMapping<
        "TOURNAMENT",
        TournamentPhaseCreateRequest
      >
  );

export type PhaseClassificationPhaseCreateRequest = PhasePhaseCreateRequest & {
  groups?: PhaseClassificationGroupCreateRequest[];
};

export type PhaseTournamentPhaseCreateRequest = PhasePhaseCreateRequest & {
  stagesNumber: number;
};

export type PhasePhaseBaseUpdateRequest = BasePhasePhaseBaseUpdateRequest &
  (
    | BasePhasePhaseBaseUpdateRequestTypeMapping<
        "CLASSIFICATION",
        ClassificationPhaseUpdateRequest
      >
    | BasePhasePhaseBaseUpdateRequestTypeMapping<
        "TOURNAMENT",
        TournamentPhaseUpdateRequest
      >
  );

export type PhaseClassificationPhaseUpdateRequest =
  PhasePhaseBaseUpdateRequest & {
    groups?: PhaseClassificationGroupUpdateRequest[];
  };

export type PhaseTournamentPhaseUpdateRequest = PhasePhaseBaseUpdateRequest & {
  matchesOrder?: PhaseTournamentSlotUpdateRequest[];
  stagesNumber?: number;
};

export type PhasePhaseUpdateRequest =
  | ({
      type: "CLASSIFICATION";
    } & ClassificationPhaseUpdateRequest)
  | ({
      type: "TOURNAMENT";
    } & TournamentPhaseUpdateRequest);

export interface PhaseClassificationGroupDetails {
  groupName: string;
  topWinners: number;
  teams: TeamTeamSummary[];
}

export interface PhaseClassificationGroupCreateRequest {
  /**
   * @minLength 5
   * @maxLength 20
   */
  groupName: string;
  topWinners: number;
}

export interface PhaseClassificationGroupUpdateRequest {
  groupName?: string;
  topWinners?: number;
}

export interface PhaseTournamentSlotDetails {
  indexOrder: number;
  match: MatchMatchSummary;
}

export interface PhaseTournamentSlotUpdateRequest {
  indexOrder?: number;
}

export interface SportSportDetails {
  /** @format int64 */
  sportId: number;
  /** @maxLength 50 */
  sportName: string;
}

export interface ErrorsFormErrorResponse {
  /** @format date-time */
  timestamp: string;
  /** @example 400 */
  status: number;
  /** Lista detallada de fallos de validación en campos específicos */
  errors: ErrorsValidationError[];
}

export interface ErrorsValidationError {
  /** @example "email" */
  field: string;
  /** @example "El formato del correo electrónico no es válido." */
  message: string;
  /** @example "juan-at-uib.es" */
  rejectedValue: string;
}

export enum UserUserCategory {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface UserSignImageUrl {
  /** @format uri */
  signImageUrl?: string;
  /** @format date-time */
  uploatAt?: string;
}

export interface UserLicenseElement {
  sport: SportSportDetails;
  license: string;
}

export type UserLicensesList = UserLicenseElement[];

export interface UserUserCreateRequest {
  /** @maxLength 50 */
  firstName: string;
  /** @maxLength 50 */
  lastName: string;
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  /**
   * @format password
   * @minLength 10
   * @maxLength 64
   */
  password: string;
  /**
   * @format password
   * @minLength 10
   * @maxLength 64
   */
  confirmPassword: string;
  category: UserUserCategory;
  licenses?: UserLicensesList;
}

export interface UserUserCreateResponse {
  /** @maxLength 50 */
  firstName: string;
  /** @maxLength 50 */
  lastName: string;
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  category: UserUserCategory;
  licenses?: UserLicensesList;
}

export interface UserUserUpdateRequest {
  /** @maxLength 50 */
  firstName?: string;
  /** @maxLength 50 */
  lastName?: string;
  category?: UserUserCategory;
  licenses?: UserLicensesList;
}

export interface UserUserLoginRequest {
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  /**
   * @format password
   * @maxLength 50
   */
  password: string;
}

export interface UserUserDetails {
  /** @format int64 */
  userId: number;
  fullName: string;
  /** @format email */
  email: string;
  category: UserUserCategory;
  /** @format date-time */
  createdAt: string;
  /** @format uri */
  profileImageUrl: string;
  signature?: UserSignImageUrl;
  licenses: UserLicensesList;
}

export interface UserUserSummary {
  /** @format int64 */
  userId: number;
  fullName: string;
  category: UserUserCategory;
  /** @format uri */
  profileImageUrl: string;
}

export interface UserUserAuthResponse {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  accessToken: string;
  refreshToken: string;
  /**
   * Segundos de validez del token
   * @example 3600
   */
  expiresIn: number;
  /** @example "Bearer" */
  tokenType: string;
  user: UserUserSummary;
}

export enum LeagueLeagueState {
  TEAM_ASSEMBLE = "TEAM_ASSEMBLE",
  MATCH_MAKING = "MATCH_MAKING",
  IN_PROGRESS = "IN_PROGRESS",
  ENDED = "ENDED",
}

export enum LeagueLeagueCategory {
  MALE = "MALE",
  FEMALE = "FEMALE",
  MIXT = "MIXT",
}

export interface LeagueLeagueCreateRequest {
  /** @maxLength 50 */
  name: string;
  /** @maxLength 500 */
  description: string;
  /** @format uri */
  iconImageUrl?: string;
  /** @format uri */
  bannerImageUrl?: string;
  /** @format uri */
  locationUrl: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  /** @format date */
  maxInscriptionDate?: string;
  /** @format int64 */
  configurationId?: number | null;
  customConfiguration?: LeagueConfigurationCreateRequest;
  /** @format int64 */
  punctuationSystemId?: number | null;
  customPunctuationSystem?: LeaguePunctuationSystemCreateRequest;
  /** @minItems 1 */
  phases: PhasePhaseCreateRequest[];
}

export interface LeagueLeagueUpdateRequest {
  /** @maxLength 50 */
  name?: string;
  /** @maxLength 500 */
  description?: string;
  /** @format uri */
  iconImageUrl?: string;
  /** @format uri */
  bannerImageUrl?: string;
  /** @format uri */
  locationUrl?: string;
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
  /** @format date */
  maxInscriptionDate?: string;
}

export interface LeagueConfigurationCreateRequest {
  /**
   * @minLength 5
   * @maxLength 50
   */
  name: string;
  category: LeagueLeagueCategory;
  /** @min 1 */
  minTeamFemaleIntegrants?: number;
  /**
   * @min 2
   * @max 20
   */
  minTeamMembers: number;
  /**
   * @min 20
   * @max 50
   */
  maxTeamMembers: number;
  /**
   * Duración de una jornada en semanas
   * @min 1
   * @max 4
   */
  roundDuration: number;
  /** @format int64 */
  sportId: number;
}

export interface LeagueConfigurationUpdateRequest {
  minTeamFemaleIntegrants?: number;
  minTeamMembers?: number;
  maxTeamMembers?: number;
  /** Duración de una jornada en semanas */
  roundDuration?: number;
}

export interface LeagueConfigurationDetails {
  category: LeagueLeagueCategory;
  minTeamFemaleIntegrants?: number;
  minTeamMembers: number;
  maxTeamMembers: number;
  /** Duración de una jornada en semanas */
  roundDuration: number;
  sport: SportSportDetails;
}

export interface LeaguePunctuationSystemCreateRequest {
  name: string;
  rules: LeaguePunctuationSystemRuleDetails[];
  /** @format int64 */
  sportId: number;
}

export interface LeaguePunctuationSystemDetails {
  name: string;
  rules: LeaguePunctuationSystemRuleDetails[];
  sport: SportSportDetails;
}

export interface LeaguePunctuationSystemRuleDetails {
  localScore: number;
  visitorScore: number;
  localPoints: number;
  visitorPoints: number;
}

export interface LeagueLeagueDetails {
  /** @format int64 */
  leagueId: number;
  name: string;
  description: string;
  /** @format uri */
  iconImageUrl?: string;
  /** @format uri */
  bannerImageUrl?: string;
  /** @format uri */
  locationUrl: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  /** @format date */
  maxInscriptionDate?: string;
  status: LeagueLeagueState;
  /** @format date-time */
  createdAt: string;
  configuration: LeagueConfigurationDetails;
  punctuationSystem: LeaguePunctuationSystemDetails;
}

export interface LeagueLeagueSummary {
  /** @format int64 */
  leagueId: number;
  name: string;
  description: string;
  /** @format uri */
  iconImageUrl?: string;
  /** @format uri */
  bannerImageUrl?: string;
  /** @format uri */
  locationUrl: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  /** @format date */
  maxInscriptionDate?: string;
  status: LeagueLeagueState;
  category: LeagueLeagueCategory;
}

export interface ParticipantParticipantDetails {
  /** @format int64 */
  participantId: number;
  /** @format int64 */
  userId: number;
  /** @format int64 */
  leagueId: number;
  team?: TeamTeamSummary;
  /** Player dorsal when participant is in a team */
  dorsal?: number;
  roles: ParticipantParticipationRoleDTO[];
  /** @format date-time */
  joinDate: string;
}

export interface ParticipantParticipantSummary {
  /** @format int64 */
  participantId: number;
  fullName: string;
  team?: TeamTeamSummary;
  roles: ParticipantParticipationRoleDTO[];
  /** Número del dorsal del jugador cuando está en un equipo */
  dorsal?: number;
}

export enum ParticipantParticipationRoleDTO {
  ADMIN = "ADMIN",
  REFEREE = "REFEREE",
  PLAYER = "PLAYER",
  CAPTAIN = "CAPTAIN",
}

export interface ParticipantParticipantUpdateRequest {
  /** Player dorsal when participant is in a team */
  dorsal: number;
}

export interface TeamTeamDetails {
  /** @format int64 */
  teamId: number;
  name: string;
  /**
   * @format regex
   * @pattern [A-Z][0-9A-Z]
   */
  initials: string;
  /** @maxLength 500 */
  description: string;
  motto: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB"
   */
  primaryColor: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB"
   */
  secondaryColor: string;
  /** @format uri */
  iconImageUrl?: string;
  /** @format date-time */
  deletedAt?: string;
  members: ParticipantParticipantDetails[];
}

export interface TeamTeamSummary {
  /** @format int64 */
  teamId: number;
  name: string;
  /**
   * @format regex
   * @pattern [A-Z][0-9A-Z]
   */
  initials: string;
  motto: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB77"
   */
  primaryColor: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB77"
   */
  secondaryColor: string;
  /** @format uri */
  iconImageUrl?: string;
}

export interface TeamTeamMembersDetails {
  members?: ParticipantParticipantDetails[];
}

export enum LeagueRequestsRequestState {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}

export type LeagueRequestsBaseRequest = BaseLeagueRequestsBaseRequest &
  (
    | BaseLeagueRequestsBaseRequestRequestTypeMapping<
        "TEAM_JOIN",
        TeamJoinRequest
      >
    | BaseLeagueRequestsBaseRequestRequestTypeMapping<
        "TEAM_CREATE",
        TeamCreateRequest
      >
    | BaseLeagueRequestsBaseRequestRequestTypeMapping<"REFEREE", RefereeRequest>
  );

export interface LeagueRequestsTeamJoinRequestProperties {
  /** @format int64 */
  teamId: number;
  /** @format int64 */
  playerId: number;
  /** Indicates if the request goes from a player to a team (APPLIANCE) or from a team to a player (INVITATION). */
  way: "APPLIANCE" | "INVITATION";
}

export type LeagueRequestsTeamJoinRequest = LeagueRequestsBaseRequest &
  LeagueRequestsTeamJoinRequestProperties;

export interface LeagueRequestsTeamCreateRequestProperties {
  name: string;
  initials: string;
  description: string;
  motto: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB"
   */
  primaryColor: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{6}
   * @example "#FFAABB"
   */
  secondaryColor: string;
  /** @format uri */
  iconImageUrl?: string;
}

export type LeagueRequestsTeamCreateRequest = LeagueRequestsBaseRequest &
  LeagueRequestsTeamCreateRequestProperties;

export type LeagueRequestsRefereeRequest = LeagueRequestsBaseRequest;

export interface LeagueRequestsResolveRequestInput {
  status: LeagueRequestsRequestState;
  rejectionReason?: string;
}

export interface MatchDateTimeSlotDetails {
  /** @format int64 */
  dateTimeSlotId: number;
  /** @format date-time */
  dateTime: string;
  /** Slot duration in hours */
  duration: number;
  /** @format int64 */
  roundId: number;
}

export enum MatchProposalState {
  PENDING = "PENDING",
  DISMISSED = "DISMISSED",
  APPROVED = "APPROVED",
}

export enum MatchMatchState {
  NOT_SCHEDULED = "NOT_SCHEDULED",
  SCHEDULED = "SCHEDULED",
  IN_GAME = "IN_GAME",
  ENDED = "ENDED",
}

export interface MatchMatchDateProposalCreateRequest {
  /** @format int64 */
  dateTimeSlotId: number;
}

export interface MatchMatchDateProposalResolveRequest {
  status: MatchProposalState;
}

export interface MatchMatchDateProposalDetails {
  /** @format int64 */
  proposalId: number;
  status: MatchProposalState;
  dateTimeSlot: MatchDateTimeSlotDetails;
  /** @format date-time */
  proposedAt: string;
  /** @format date-time */
  resolvedAt?: string;
}

export interface MatchMatchDetails {
  /** @format int64 */
  matchId: number;
  status: MatchMatchState;
  localTeam?: TeamTeamSummary;
  visitorTeam?: TeamTeamSummary;
  dateTime?: MatchDateTimeSlotDetails;
  proposal?: MatchMatchDateProposalDetails | null;
  /** @format int64 */
  roundId: number;
  firstReferee?: ParticipantParticipantDetails;
  secondReferee?: ParticipantParticipantDetails;
  resultSummary?: MatchResultSummary;
  resultDetails?: MatchResultDetails;
}

export interface MatchMatchUpdateRequest {
  status: MatchMatchState;
  result?: MatchResultRegisterRequest;
}

export interface MatchMatchSummary {
  /** @format int64 */
  matchId: number;
  status: MatchMatchState;
  localTeam?: TeamTeamSummary;
  visitorTeam?: TeamTeamSummary;
  dateTime?: MatchDateTimeSlotDetails;
  proposalState?: "PENDING" | "PROPOSED";
  /** @format int64 */
  roundId: number;
  firstReferee?: ParticipantParticipantSummary;
  secondReferee?: ParticipantParticipantSummary;
  resultSummary?: MatchResultSummary;
}

export interface MatchResultSummary {
  localTotalScore: number;
  visitorTotalScore: number;
  /** @format uri */
  recordUrl: string;
}

export type MatchResultDetails = MatchResultSummary & {
  signatures: {
    beforeMatchSignatures: MatchMatchSignatures;
    afterMatchSignatures: MatchMatchSignatures;
  };
  observations: string[];
  periods: MatchMatchPeriod[];
};

export interface MatchResultRegisterRequest {
  /** @format int64 */
  winnerTeamId: number;
  signatures: {
    beforeMatchSignatures: MatchMatchSignatures;
    afterMatchSignatures: MatchMatchSignatures;
  };
  observations: string[];
  periods: MatchMatchPeriod[];
}

export interface MatchMatchSignatures {
  firstRefereeSignature: UserSignImageUrl;
  secondRefereeSignature: UserSignImageUrl;
  localCaptainSignature: UserSignImageUrl;
  visitorCaptainSignature: UserSignImageUrl;
}

export interface MatchMatchPeriod {
  periodNumber: number;
  localScore: number;
  visitorScore: number;
  /** Ej: HALF, QUARTER, SET */
  periodType: string;
  events: (MatchSubstitutionEvent | MatchSanctionEvent | MatchTimeoutEvent)[];
}

export interface MatchMatchEvent {
  /** @format time */
  happenedAtTime: number;
  atLocalScore: number;
  atVisitorScore: number;
  /** @format int64 */
  responsibleTeamId: number;
}

export type MatchSubstitutionEvent = MatchMatchEvent & {
  incomingPlayer: ParticipantParticipantDetails;
  outgoingPlayer: ParticipantParticipantDetails;
};

export type MatchSanctionEvent = MatchMatchEvent & {
  sactionType: string;
  reason: string;
  appliedTo: ParticipantParticipantDetails;
};

export type MatchTimeoutEvent = MatchMatchEvent & {
  /**
   * Timeout duration in minutes and seconds
   * @format regex
   * @pattern [0-9]{2}:[0-9]{2}
   */
  durationTime: string;
};

export interface IncidenceIncidenceCreateRequest {
  description: string;
}

export interface IncidenceIncidenceResolutionRequest {
  resolution: string;
}

export interface IncidenceIncidenceDetails {
  /** @format int64 */
  incidenceId: number;
  description: string;
  resolution?: string;
  creator: ParticipantParticipantSummary;
}

export interface LeagueUserLeagueStatus {
  /** @format int64 */
  leagueId: number;
  /** @format int64 */
  participantId?: number;
  /**
   * Nulo si el usuario aún no tiene equipo en esta liga
   * @format int64
   */
  teamId?: number;
  roles: ParticipantParticipationRoleDTO[];
  /** @format date-time */
  joinDate: string;
}

export interface LeagueLeaderboardRow {
  position: number;
  team: TeamTeamSummary;
  playedMatches: number;
  wonMatches?: number;
  lostMatches?: number;
  drawnMatches?: number;
  points?: number;
  wonSets?: number;
  lostSets?: number;
  wonPoints?: number;
  lostPoints?: number;
}

/** Esquema para agrupar clasificaciones (Ej: Grupo A, Grupo B, o 'General') */
export interface LeagueLeaderboardGroup {
  /** @format int64 */
  groupId: number;
  groupName: string;
  standings: LeagueLeaderboardRow[];
}

export type LeagueLeaderboardResponse = LeagueLeaderboardGroup[];

export interface RoundRoundDetails {
  /** @format int64 */
  roundId: number;
  /** Weekgame 1, Weekgame 2, etc. */
  roundNumber: number;
  /**
   * Round start date
   * @format date
   */
  startDate: string;
}

export type MainFormErrorResponse = ErrorsFormErrorResponse;

export enum PhaseType {
  CLASSIFICATION = "CLASSIFICATION",
  TOURNAMENT = "TOURNAMENT",
}

interface BasePhasePhaseCreateRequest {
  name: string;
  /** @format date */
  startDate: string;
  /** @format date */
  endDate: string;
  sequenceOrder: number;
  type: PhaseType;
}

type BasePhasePhaseCreateRequestTypeMapping<Key, Type> = {
  type: Key;
} & Type;

interface BasePhasePhaseBaseUpdateRequest {
  name?: string;
  /** @format date */
  startDate?: string;
  /** @format date */
  endDate?: string;
  sequenceOrder?: number;
  type?: PhaseType;
}

type BasePhasePhaseBaseUpdateRequestTypeMapping<Key, Type> = {
  type: Key;
} & Type;

export enum RequestType {
  TEAM_JOIN = "TEAM_JOIN",
  TEAM_CREATE = "TEAM_CREATE",
  REFEREE = "REFEREE",
}

interface BaseLeagueRequestsBaseRequest {
  /** @format int64 */
  requestId: number;
  /** Discriminator */
  requestType: RequestType;
  /** @format int64 */
  participantId: number;
  /** @format int64 */
  leagueId: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  resolvedAt?: string;
  rejectionReason?: string;
  status: LeagueRequestsRequestState;
}

type BaseLeagueRequestsBaseRequestRequestTypeMapping<Key, Type> = {
  requestType: Key;
} & Type;
