import { create } from 'zustand';
import { User } from '../types';
import { apiRequest } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  checkAuth: async () => {
    try {
      const res = await apiRequest('/auth/me');
      if (res.success && res.data?.user) {
        set({ user: res.data.user, isAuthenticated: true });
        return true;
      }
    } catch {
      // The API is the source of truth; never retain an unverified local identity.
    }

    set({ user: null, isAuthenticated: false });
    return false;
  },
}));
