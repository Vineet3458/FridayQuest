'use client';

import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useThemeStore, ThemePreference } from '@/stores/useThemeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { preference, resolvedTheme, setPreference, initTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initTheme();
    setMounted(false);
    // Slight tick to avoid hydration mismatch
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, [initTheme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  const options: { id: ThemePreference; label: string; desc: string; icon: typeof Sun }[] = [
    {
      id: 'system',
      label: 'System Default',
      desc: 'Matches your device OS theme',
      icon: Laptop,
    },
    {
      id: 'light',
      label: 'Light Theme',
      desc: 'Clean & high contrast',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark Theme',
      desc: 'Deep navy & easy on eyes',
      icon: Moon,
    },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={`Theme: ${preference === 'system' ? 'System (' + resolvedTheme + ')' : preference}`}
        title={`Theme: ${preference === 'system' ? 'System (' + resolvedTheme + ')' : preference} - Click to change`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 border select-none cursor-pointer ${
          isDark
            ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200 shadow-sm'
            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
        }`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          {preference === 'system' ? (
            <Laptop className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          ) : preference === 'dark' ? (
            <Moon className="w-4 h-4 text-amber-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </div>

        {preference === 'system' ? (
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
            Auto
          </span>
        ) : showLabel ? (
          <span className="text-xs font-semibold">
            {preference === 'dark' ? 'Dark' : 'Light'}
          </span>
        ) : null}
      </button>

      {/* Popover Selection Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            Theme Preference
          </div>

          <div className="space-y-0.5">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = preference === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setPreference(opt.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold">{opt.label}</div>
                      <div className="text-[10px] opacity-70 font-normal">{opt.desc}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
