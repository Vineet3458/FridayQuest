export type UserRole = 'superAdmin' | 'orgAdmin' | 'organizer' | 'player';
export type UserStatus = 'pending' | 'active';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
  status: UserStatus;
  orgId?: string;
  xp?: number;
  level?: number;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  inviteCode: string;
}

export interface GameDefinition {
  name: string;
  slug: string;
  level: 1 | 2 | 3;
  players: { min: number; max: number };
  durationMin: number;
  energy: 'low' | 'medium' | 'high';
  props?: string[];
  tags?: string[];
  teamMode: 'teams' | 'individual' | 'pairs' | 'rounds-of-n';
  tools: string[];
  rulesShort: string;
  rulesFull: string;
}

export interface Game {
  _id: string;
  name: string;
  slug: string;
  level: number;
  status: 'draft' | 'submitted' | 'approved' | 'published';
  version: number;
  definition: GameDefinition;
  avgRating: number;
}

export interface Session {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  durationMin: number;
  location: string;
  status: 'draft' | 'voting' | 'planned' | 'live' | 'done';
  joinCode: string;
  agenda: Array<{
    gameId: string;
    gameName: string;
    version: number;
    order: number;
    durationMin: number;
  }>;
  propsChecklist: string[];
}

