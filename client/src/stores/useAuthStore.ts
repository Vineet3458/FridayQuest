import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { apiRequest } from '../lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
      logout: async () => {
        try {
          await apiRequest('/auth/logout', { method: 'POST' });
        } catch {}
        set({ user: null, isAuthenticated: false });
      },
      checkAuth: async () => {
        try {
          const res = await apiRequest('/auth/me');
          if (res.success && res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          }
        } catch {
          // If session expired or invalid, keep state or reset if needed
        }
      },
    }),
    {
      name: 'fq_auth_session',
    }
  )
);
