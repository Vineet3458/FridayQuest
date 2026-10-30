'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Check,
  ChevronDown,
  Loader2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import { UserRole } from '@/types';
import { ROLE_INFO } from '@/lib/roles';

export { ROLE_INFO };

const ROLE_ICONS: Record<UserRole, typeof User> = {
  superAdmin: ShieldCheck,
  orgAdmin: UserCheck,
  organizer: Mic,
  player: User,
};

export default function RoleTrialBar() {
  const { user, setUser } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState<UserRole | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRole: UserRole = user?.role || 'player';
  const currentInfo = ROLE_INFO[currentRole];
  const CurrentIcon = ROLE_ICONS[currentRole];

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleSwitchRole = async (role: UserRole) => {
    if (switching) return;
    setSwitching(role);
    try {
      const res = await apiRequest('/auth/trial', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });

      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch {
      // Offline fallback: set realistic mock user in Zustand store
      const mockNames: Record<UserRole, { name: string; email: string; dept: string }> = {
        superAdmin: { name: 'Kirxa SuperAdmin', email: 'superadmin@kirxa.demo', dept: 'Platform Ops' },
        orgAdmin: { name: 'Riya Sharma (HR Admin)', email: 'riya.hr@kirxa.demo', dept: 'People & Culture' },
        organizer: { name: 'Kabir Patel (Friday Host)', email: 'kabir.host@kirxa.demo', dept: 'Engineering' },
        player: { name: 'Ananya Sen (Player)', email: 'ananya.player@kirxa.demo', dept: 'Design' },
      };
      const info = mockNames[role];
      setUser({
        id: `trial-${role}`,
        name: info.name,
        email: info.email,
        role,
        department: info.dept,
        status: 'active',
      });
    } finally {
      setSwitching(null);
      // Brief timeout before closing dropdown for smooth UX
      setTimeout(() => {
        setDropdownOpen(false);
      }, 200);
    }
  };

  const rolesList: UserRole[] = ['superAdmin', 'orgAdmin', 'organizer', 'player'];

  return (
    <div
      ref={dropdownRef}
      className="w-full bg-slate-900 text-slate-200 border-b border-slate-800 text-xs sticky top-0 z-40 select-none shadow-sm h-8 flex items-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {/* Left: Demo Mode Indicator */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-amber-400 uppercase tracking-wider">
            Demo Mode
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            • Switch trial persona to preview role access
          </span>
        </div>

        {/* Right: Selected Role Trigger Button & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
              dropdownOpen
                ? 'bg-slate-800 text-white ring-1 ring-blue-500/50'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60'
            }`}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-white">{currentInfo.title}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </button>

          {/* Compact Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 sm:right-0 mt-1.5 w-[calc(100vw-2rem)] max-w-[360px] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* Dropdown Header */}
              <div className="px-2.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Select Persona</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Switch between all 4 FridayQuest system roles
                  </p>
                </div>
                <Link
                  href="/roles"
                  onClick={() => setDropdownOpen(false)}
                  className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <span>Matrix</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Roles List */}
              <div className="space-y-1.5 mt-2">
                {rolesList.map((role) => {
                  const info = ROLE_INFO[role];
                  const Icon = ROLE_ICONS[role];
                  const isActive = currentRole === role;
                  const isSwitchingThis = switching === role;

                  return (
                    <button
                      key={role}
                      type="button"
                      disabled={switching !== null}
                      onClick={() => handleSwitchRole(role)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/40 dark:border-blue-500/40 shadow-xs'
                          : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/70 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${info.color}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {info.title}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                              {info.subtitle.split('(')[0]}
                            </span>
                          </div>

                          {isSwitchingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
                          ) : isActive ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          ) : null}
                        </div>

                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {info.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick helper tip */}
              <div className="mt-2 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Fast in-memory session switch</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Current: {currentInfo.title}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
