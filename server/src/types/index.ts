export type UserRole = 'superAdmin' | 'orgAdmin' | 'organizer' | 'player';
export type UserStatus = 'pending' | 'active';

export interface AuthUserPayload {
  userId: string;
  orgId: string;
  role: UserRole;
  email: string;
  tokenVersion?: number;
}

export type GameLevel = 1 | 2 | 3;
export type GameStatus = 'draft' | 'submitted' | 'approved' | 'published' | 'archived';
export type GameTeamMode = 'teams' | 'individual' | 'pairs' | 'rounds-of-n';

export interface GameRoleDefinition {
  key: string;
  label: string;
  count: number;
  visible?: boolean;
}

export interface GameFlowStep {
  step:
    | 'announce'
    | 'deal_roles'
    | 'deal_words'
    | 'timer'
    | 'action'
    | 'buzz_round'
    | 'vote'
    | 'qr_hunt'
    | 'manual_score'
    | 'reveal'
    | 'score';
  text?: string;
  tool?: string;
  actor?: string;
  type?: string;
  timerSec?: number;
  options?: string[];
  [key: string]: unknown;
}

export interface GameScoringRule {
  when: string | Record<string, unknown>;
  award: Array<{
    role?: string;
    team?: string;
    points: number;
  }>;
}

export interface GameDefinition {
  name: string;
  slug: string;
  level: GameLevel;
  players: { min: number; max: number };
  durationMin: number;
  energy: 'low' | 'medium' | 'high';
  noise?: 'low' | 'medium' | 'high';
  props?: string[];
  tags?: string[];
  teamMode: GameTeamMode;
  tools: string[];
  roles?: GameRoleDefinition[];
  rounds?: number;
  flow?: GameFlowStep[];
  scoring?: GameScoringRule[];
  rulesShort: string;
  rulesFull: string;
}

export type SessionStatus = 'draft' | 'voting' | 'planned' | 'live' | 'done';

export interface SessionAgendaItem {
  gameId: string;
  gameName: string;
  version: number;
  order: number;
  start?: string;
  durationMin: number;
}
