import { create } from 'zustand';

export interface LiveSessionState {
  sessionId: string | null;
  currentGame: any | null;
  currentGameIdx: number;
  stepIdx: number;
  round: number;
  timers: {
    endsAt?: string;
    durationSec?: number;
    running: boolean;
  };
  scores: Record<string, number>;
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
  paused: boolean;
  status: string;

  setPublicState: (state: Partial<LiveSessionState>) => void;
  setAssignedRole: (role: LiveSessionState['assignedRole']) => void;
  reset: () => void;
}

export const useLiveSessionStore = create<LiveSessionState>((set) => ({
  sessionId: null,
  currentGame: null,
  currentGameIdx: 0,
  stepIdx: 0,
  round: 1,
  timers: { running: false },
  scores: {},
  buzzerState: { locked: false },
  assignedRole: null,
  paused: false,
  status: 'waiting',

  setPublicState: (partial) => set((prev) => ({ ...prev, ...partial })),
  setAssignedRole: (assignedRole) => set({ assignedRole }),
  reset: () =>
    set({
      sessionId: null,
      currentGame: null,
      currentGameIdx: 0,
      stepIdx: 0,
      round: 1,
      timers: { running: false },
      scores: {},
      buzzerState: { locked: false },
      assignedRole: null,
      paused: false,
      status: 'waiting',
    }),
}));

