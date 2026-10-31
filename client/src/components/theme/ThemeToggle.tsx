'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'switch' | 'segmented';
}

export default function ThemeToggle({
  className = '',
  showLabel = false,
  variant = 'button',
}: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    initTheme();
    setMounted(true);
  }, [initTheme]);

  if (!mounted) {
    // Skeleton placeholder to prevent SSR hydration flicker
    if (variant === 'switch') {
      return (
        <div
          className={`w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`}
          aria-hidden="true"
        />
      );
    }
    if (variant === 'segmented') {
      return (
        <div
          className={`h-9 w-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse ${className}`}
          aria-hidden="true"
        />
      );
    }
    return (
      <div
        className={`w-9 h-9 rounded-full bg-slate-200/60 dark:bg-slate-800/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === 'dark';

  // Variant 1: Interactive Sliding Switch (Used in Settings or prominent controls)
  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        title={isDark ? 'Dark Theme active (click for Light)' : 'Light Theme active (click for Dark)'}
        onClick={toggleTheme}
        className={`w-14 h-7 rounded-full p-0.5 transition-colors duration-300 relative inline-flex items-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          isDark
            ? 'bg-indigo-600 text-white'
            : 'bg-amber-100 border border-amber-200 text-amber-600'
        } ${className}`}
      >
        <span className="sr-only">Toggle theme</span>
        {/* Sliding Knob */}
        <span
          className={`w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md transform transition-transform duration-300 flex items-center justify-center ${
            isDark ? 'translate-x-7 text-indigo-400' : 'translate-x-0 text-amber-500'
          }`}
        >
          {isDark ? (
            <Moon className="w-3.5 h-3.5 fill-indigo-400/30" />
          ) : (
            <Sun className="w-3.5 h-3.5 fill-amber-500/20" />
          )}
        </span>
      </button>
    );
  }

  // Variant 2: Segmented Pill Toggle (Light | Dark)
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 select-none ${className}`}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !isDark
              ? 'bg-white text-amber-600 shadow-xs border border-amber-200/50'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Light</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isDark
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Dark</span>
        </button>
      </div>
    );
  }

  // Variant 3: Default Single-Click Toggle Button (Header & Navbar)
  // Perfectly matches the circular Sun/Moon button in the reference screenshot
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={
        isDark
          ? 'Currently Dark Mode — Click to switch to Light'
          : 'Currently Light Mode — Click to switch to Dark'
      }
      className={`group relative inline-flex items-center justify-center gap-1.5 w-9 h-9 rounded-full transition-all duration-300 cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:scale-105 active:scale-95 ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-amber-300 shadow-xs'
          : 'bg-amber-50 hover:bg-amber-100/90 border-amber-200/70 text-amber-500 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 group-hover:-rotate-12 fill-amber-300/20" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 group-hover:rotate-45 fill-amber-500/20" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold mr-1">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
}
