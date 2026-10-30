import { create } from 'zustand';

export interface LiveSessionState {
  sessionId: string | null;
  sessionData: any | null;
  currentGame: any | null;
  currentGameIdx: number;
  stepIdx: number;
  round: number;
  timers: {
    endsAt?: string;
    durationSec?: number;
    running: boolean;
  };
  remainingSec: number;
  scores: Record<string, number>;
  leaderboard: Array<{
    rank: number;
    teamName: string;
    totalPoints: number;
    memberCount?: number;
  }>;
  buzzerState: {
    locked: boolean;
    lockedByUserId?: string;
    lockedByUserName?: string;
    lockedAt?: string;
  };
  assignedRole: {
    roleKey: string;
    roleLabel: string;
    secretValue?: string;
  } | null;
  assignedWord: string | null;
  paused: boolean;
  status: 'waiting' | 'in_progress' | 'completed' | string;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  announcement: string | null;

  setSessionData: (data: any) => void;
  setPublicState: (state: Partial<LiveSessionState>) => void;
  setAssignedRole: (role: LiveSessionState['assignedRole']) => void;
  setAssignedWord: (word: string | null) => void;
  setRemainingSec: (sec: number) => void;
  setConnectionStatus: (status: 'connected' | 'connecting' | 'disconnected') => void;
  setAnnouncement: (text: string | null) => void;
  setLeaderboard: (leaderboard: any[]) => void;
  reset: () => void;
}

export const useLiveSessionStore = create<LiveSessionState>((set) => ({
  sessionId: null,
  sessionData: null,
  currentGame: null,
  currentGameIdx: 0,
  stepIdx: 0,
  round: 1,
  timers: { running: false },
  remainingSec: 0,
  scores: {},
  leaderboard: [],
  buzzerState: { locked: false },
  assignedRole: null,
  assignedWord: null,
  paused: false,
  status: 'waiting',
  connectionStatus: 'connecting',
  announcement: null,

  setSessionData: (sessionData) => set({ sessionData, sessionId: sessionData?._id || null }),
  setPublicState: (partial) => set((prev) => ({ ...prev, ...partial })),
  setAssignedRole: (assignedRole) => set({ assignedRole }),
  setAssignedWord: (assignedWord) => set({ assignedWord }),
  setRemainingSec: (remainingSec) => set({ remainingSec }),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  setAnnouncement: (announcement) => set({ announcement }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  reset: () =>
    set({
      sessionId: null,
      sessionData: null,
      currentGame: null,
      currentGameIdx: 0,
      stepIdx: 0,
      round: 1,
      timers: { running: false },
      remainingSec: 0,
      scores: {},
      leaderboard: [],
      buzzerState: { locked: false },
      assignedRole: null,
      assignedWord: null,
      paused: false,
      status: 'waiting',
      connectionStatus: 'disconnected',
      announcement: null,
    }),
}));
