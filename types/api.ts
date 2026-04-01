
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum UserCategory {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum MatchState {
  NOT_SCHEDULED = "NOT_SCHEDULED",
  SCHEDULED = "SCHEDULED",
  IN_GAME = "IN_GAME",
  ENDED = "ENDED",
}

export enum LeagueCategory {
  MALE = "MALE",
  FEMALE = "FEMALE",
  BOTH = "BOTH",
}

export enum LeagueState {
  TEAM_ASSEMBLE = "TEAM_ASSEMBLE",
  MATCH_MAKING = "MATCH_MAKING",
  IN_PROGRESS = "IN_PROGRESS",
  ENDED = "ENDED",
}

export enum RequestState {
  PENDING = "PENDING",
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}

export enum ProposalState {
  PENDING = "PENDING",
  DISMISSED = "DISMISSED",
  APPROVED = "APPROVED",
}

export enum Role {
  ADMIN = "ADMIN",
  REFEREE = "REFEREE",
  PLAYER = "PLAYER",
  CAPTAIN = "CAPTAIN",
}

export type ParticipantRoles = Role[];

export interface DateTimeSlot {
  /** @format date-time */
  dateTime: string;
  /** Slot duration in hours */
  duration: number;
}

export interface ImageUrl {
  /** @format uri */
  imageUrl: string;
}

export interface FormErrorResponse {
  /** @format date-time */
  timestamp: string;
  /** @example 400 */
  status: number;
  /** Lista detallada de fallos de validación en campos específicos */
  errors: ValidationError[];
}

export interface ValidationError {
  /** @example "email" */
  field: string;
  /** @example "El formato del correo electrónico no es válido." */
  message: string;
  /** @example "juan-at-uib.es" */
  rejectedValue: string;
}

export interface UserCreateRequest {
  /** @maxLength 50 */
  firstName: string;
  /** @maxLength 50 */
  lastName: string;
  /**
   * @format email
   * @maxLength 50
   */
  email: string;
  category: UserCategory;
  licenses?: {
    sportName?: string;
    license?: string;
  }[];
}

export interface UserUpdateRequest {
  /** @maxLength 50 */
  firstName?: string;
  /** @maxLength 50 */
  lastName?: string;
  category?: UserCategory;
  licenses?: {
    sportName?: string;
    license?: string;
  }[];
}

export interface UserDetails {
  id: number;
  fullName: string;
  /** @format email */
  email: string;
  category: string;
  /** @format uri */
  profileImageUrl?: string;
  signature?: ImageUrl;
  licenses: {
    sportName?: string;
    license?: string;
  }[];
}

export interface UserLoginRequest {
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

export interface UserAuthResponse {
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
  user: UserDetails;
}

export interface LeagueCreateRequest {
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
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  /** @format date-time */
  maxInscriptionDate: string;
  configuration: ConfigurationCreateRequest;
  punctuationSystem?: PunctuationSystemCreateRequest;
  phases: (TournamentPhase | ClassificationPhase)[];
}

export interface LeagueUpdateRequest {
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
  /** @format date-time */
  startDate?: string;
  /** @format date-time */
  endDate?: string;
  /** @format date-time */
  maxInscriptionDate?: string;
  phases?: (TournamentPhase | ClassificationPhase)[];
}

export interface ConfigurationCreateRequest {
  category: LeagueCategory;
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
}

export interface ConfigurationUpdateRequest {
  category?: LeagueCategory;
  minTeamFemaleIntegrants?: number;
  minTeamMembers?: number;
  maxTeamMembers?: number;
  /** Duración de una jornada en semanas */
  roundDuration?: number;
}

export interface ConfigurationDetails {
  category: LeagueCategory;
  minTeamFemaleIntegrants?: number;
  minTeamMembers: number;
  maxTeamMembers: number;
  /** Duración de una jornada en semanas */
  roundDuration: number;
}

export interface PunctuationSystemCreateRequest {
  localScore: number;
  visitorScore: number;
  localPoints: number;
  visitorPoints: number;
}

export interface PunctuationSystemRuleDetails {
  localScore: number;
  visitorScore: number;
  localPoints: number;
  visitorPoints: number;
}

export interface LeagueBasePhase {
  name: string;
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  sequenceOrder: string;
}

export type TournamentPhase = LeagueBasePhase & {
  matchesOrder?: TournamentSlot[];
};

export interface TournamentSlot {
  indexOrder: number;
  match: MatchDetails;
}

export type ClassificationPhase = LeagueBasePhase & {
  groups?: ClassificationGroup[];
};

export interface ClassificationGroup {
  topWinners: number;
  teams?: TeamDetails[];
}

export interface LeagueDetails {
  id: number;
  name: string;
  description: string;
  /** @format uri */
  iconImageUrl: string;
  /** @format uri */
  bannerImageUrl: string;
  /** @format uri */
  locationUrl: string;
  /** @format date-time */
  startDate: string;
  /** @format date-time */
  endDate: string;
  /** @format date-time */
  maxInscriptionDate: string;
  status: LeagueState;
  /** @format date-time */
  createdAt: string;
  configuration: ConfigurationDetails;
  punctuationSystem?: PunctuationSystemRuleDetails;
}

export interface LeaderboardDetails {
  teams: {
    team?: TeamDetails;
    position?: number;
    playedMatches?: number;
    wonMatches?: number;
    lostMatches?: number;
    wonSets?: number;
    lostSets?: number;
    wonPoints?: number;
    lostPoints?: number;
  }[];
}

export interface ParticipantDetails {
  participantId: number;
  userId: number;
  team: TeamDetails;
  /** Número del dorsal del jugador cuando está en un equipo */
  dorsal: number;
  roles: string[];
  /** @format date-time */
  joinDate: string;
}

export interface TeamDetails {
  id: number;
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
   * @pattern #[0-9A-F]{8}
   * @example "#FFAABB77"
   */
  primaryColor: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{8}
   * @example "#FFAABB77"
   */
  secondaryColor: string;
  /** @format uri */
  iconImageUrl: string;
  /** @format date-time */
  deletedAt?: string;
  leagueId: number;
}

export interface TeamMembersDetails {
  members?: ParticipantDetails[];
}

export interface BaseRequest {
  participantId: number;
  leagueId: number;
  /** @format date-time */
  createdAt: string;
  /** @format date-time */
  resolvedAt: string;
  rejectionReason?: string;
  status?: RequestState;
}

export type TeamJoinRequest = BaseRequest & {
  /** @example 101 */
  teamId: number;
};

export type TeamCreateRequest = BaseRequest & {
  name: string;
  initials: string;
  description: string;
  motto: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{8}
   * @example "#FFAABB77"
   */
  primaryColor: string;
  /**
   * @format regex
   * @pattern #[0-9A-F]{8}
   * @example "#FFAABB77"
   */
  secondaryColor: string;
  /** @format uri */
  iconImageUrl?: string;
};

export type RefereeRequest = BaseRequest & {
  /** @example "UIB-REF-2026-X88" */
  licenseReference: string;
};

export interface MatchDateProposalRequest {
  dateTimeSlot?: DateTimeSlot;
}

export interface MatchDateProposalDetails {
  status: ProposalState;
  /** @format uri */
  proposedAt: string;
  /** @format uri */
  resolvedAt?: string;
}

export interface MatchDetails {
  status?: MatchState;
  localTeam?: TeamDetails;
  visitorTeam?: TeamDetails;
  dateTime?: DateTimeSlot;
  proposal?: MatchDateProposalDetails;
  round?: number;
  resultResumee?: ResultResumee;
  completeResult?: ResultDetails;
}

export interface ResultResumee {
  localTotalScore: number;
  visitorTotalScore: number;
  /** @format uri */
  recordUrl: string;
}

export type ResultDetails = ResultResumee & {
  signatures: {
    beforeMatchSignatures: MatchSignatures;
    afterMatchSignatures: MatchSignatures;
  };
  observations: string[];
  periods: MatchPeriod[];
};

export interface MatchSignatures {
  firstRefereeSignature: ImageUrl;
  secondRefereeSignature: ImageUrl;
  localCaptainSignature: ImageUrl;
  visitorCaptainSignature: ImageUrl;
}

export interface MatchPeriod {
  periodNumber: number;
  localScore: number;
  visitorScore: number;
  events: (SubstitutionEvent | SanctionEvent | TimeoutEvent)[];
}

export interface MatchEvent {
  /** @format time */
  happenedAtTime: number;
  atLocalScore: number;
  atVisitorScore: number;
}

export type SubstitutionEvent = MatchEvent & {
  incomingPlayer: ParticipantDetails;
  outgoingPlayer: ParticipantDetails;
};

export type SanctionEvent = MatchEvent & {
  sactionType: string;
  reason: string;
  appliedTo: ParticipantDetails;
};

export type TimeoutEvent = MatchEvent & {
  /**
   * Timeout duration in minutes and seconds
   * @format regex
   * @pattern [0-9]{2}:[0-9]{2}
   */
  durationTime: string;
};

export interface IncidenceCreateRequest {
  description: string;
}

export interface IncidenceUpdateRequest {
  reason: string;
}

export interface IncidenceDetails {
  incidenceId?: number;
  description: string;
  resolution: string;
}
