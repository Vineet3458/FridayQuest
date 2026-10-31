'use client';

import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
// Backward-compatibility aliases
export type ThemePreference = ThemeMode;
export type ResolvedTheme = ThemeMode;

interface ThemeState {
  theme: ThemeMode;
  resolvedTheme: ThemeMode;
  preference: ThemeMode;
  isCustomized: boolean;
  setTheme: (theme: ThemeMode) => void;
  setPreference: (pref: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const getBrowserTheme = (): ThemeMode => {
  if (typeof window === 'undefined') return 'light';
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

const applyToDocument = (mode: ThemeMode) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  resolvedTheme: 'light',
  preference: 'light',
  isCustomized: false,

  initTheme: () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('fq_theme');
      const browserTheme = getBrowserTheme();

      let activeTheme: ThemeMode;
      let customized = false;

      if (stored === 'light' || stored === 'dark') {
        activeTheme = stored;
        customized = true;
      } else {
        // Automatically set according to the Default theme of the user browser
        activeTheme = browserTheme;
        customized = false;
      }

      applyToDocument(activeTheme);
      set({
        theme: activeTheme,
        resolvedTheme: activeTheme,
        preference: activeTheme,
        isCustomized: customized,
      });

      // If user hasn't explicitly toggled, update when the browser theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleBrowserThemeChange = (e: MediaQueryListEvent) => {
        if (!get().isCustomized) {
          const nextBrowserTheme: ThemeMode = e.matches ? 'dark' : 'light';
          applyToDocument(nextBrowserTheme);
          set({
            theme: nextBrowserTheme,
            resolvedTheme: nextBrowserTheme,
            preference: nextBrowserTheme,
          });
        }
      };

      mediaQuery.removeEventListener('change', handleBrowserThemeChange);
      mediaQuery.addEventListener('change', handleBrowserThemeChange);
    } catch {}
  },

  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('fq_theme', theme);
      } catch {}
    }
    applyToDocument(theme);
    set({
      theme,
      resolvedTheme: theme,
      preference: theme,
      isCustomized: true,
    });
  },

  setPreference: (pref: ThemeMode) => {
    get().setTheme(pref);
  },

  toggleTheme: () => {
    const current = get().theme;
    const nextTheme: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
}));
