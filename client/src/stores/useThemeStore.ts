'use client';

import { create } from 'zustand';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'dark';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
};

const applyToDocument = (resolved: ResolvedTheme) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: 'system', // Defaults to user's OS / device system theme
  resolvedTheme: 'dark',

  initTheme: () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('fq_theme') as ThemePreference | null;
      // Default to 'system' unless user explicitly saved 'light' or 'dark'
      const validPref: ThemePreference =
        stored === 'light' || stored === 'dark' ? stored : 'system';

      const systemTheme = getSystemTheme();
      const resolved: ResolvedTheme = validPref === 'system' ? systemTheme : validPref;

      applyToDocument(resolved);
      set({ preference: validPref, resolvedTheme: resolved });

      // Automatically listen to real-time OS system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        if (get().preference === 'system') {
          const newResolved: ResolvedTheme = e.matches ? 'dark' : 'light';
          applyToDocument(newResolved);
          set({ resolvedTheme: newResolved });
        }
      };

      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } catch {}
  },

  setPreference: (pref: ThemePreference) => {
    if (typeof window !== 'undefined') {
      try {
        if (pref === 'system') {
          localStorage.removeItem('fq_theme');
        } else {
          localStorage.setItem('fq_theme', pref);
        }
      } catch {}
    }

    const systemTheme = getSystemTheme();
    const resolved: ResolvedTheme = pref === 'system' ? systemTheme : pref;
    applyToDocument(resolved);
    set({ preference: pref, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const { preference, resolvedTheme } = get();
    // Quick toggle:
    // If on system -> switch to opposite of resolved
    // If on manual -> switch back to system default!
    if (preference === 'system') {
      get().setPreference(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      get().setPreference('system');
    }
  },
}));
