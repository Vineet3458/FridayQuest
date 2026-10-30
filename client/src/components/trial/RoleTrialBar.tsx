'use client';

import { useState } from 'react';
import { ShieldCheck, UserCheck, Mic, User, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import { UserRole } from '@/types';
import { ROLE_INFO } from '@/lib/roles';

export { ROLE_INFO };

export default function RoleTrialBar() {
  const { user, setUser } = useAuthStore();
  const [expanded, setExpanded] = useState(false);
  const [switching, setSwitching] = useState<UserRole | null>(null);

  const currentRole: UserRole = user?.role || 'player';
  const currentInfo = ROLE_INFO[currentRole];

  const handleSwitchRole = async (role: UserRole) => {
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
      // Offline fallback: set mock user in Zustand store
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
    }
  };

  return (
    <div className="w-full bg-slate-100/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur z-40 sticky top-0 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Active Role Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Role Trial Mode:
            </span>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentInfo.color}`}>
              {currentRole === 'superAdmin' && <ShieldCheck className="w-3.5 h-3.5" />}
              {currentRole === 'orgAdmin' && <UserCheck className="w-3.5 h-3.5" />}
              {currentRole === 'organizer' && <Mic className="w-3.5 h-3.5" />}
              {currentRole === 'player' && <User className="w-3.5 h-3.5" />}
              <span>{currentInfo.title}</span>
              <span className="text-[10px] opacity-70 hidden sm:inline">({currentInfo.subtitle})</span>
            </div>
          </div>

          {/* Quick Role Switch Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {(['superAdmin', 'orgAdmin', 'organizer', 'player'] as UserRole[]).map((role) => {
              const active = currentRole === role;
              const info = ROLE_INFO[role];
              return (
                <button
                  key={role}
                  type="button"
                  disabled={switching !== null}
                  onClick={() => handleSwitchRole(role)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                    active
                      ? `${info.color} shadow-sm font-bold ring-1 ring-blue-500/20 dark:ring-white/20`
                      : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-current" />}
                  <span>{info.title}</span>
                </button>
              );
            })}

            {/* Toggle Role Privileges Details */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
              title="View Role Access Details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Role Privileges Breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pb-2 text-xs">
            {(['superAdmin', 'orgAdmin', 'organizer', 'player'] as UserRole[]).map((role) => {
              const info = ROLE_INFO[role];
              const isCurrent = currentRole === role;
              return (
                <div
                  key={role}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-white dark:bg-slate-900/90 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-90 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold ${info.textColor} flex items-center gap-1`}>
                      {info.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-semibold">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] mb-2 leading-snug">{info.description}</p>
                  <ul className="space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
                    {info.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleSwitchRole(role)}
                      className="mt-2.5 w-full py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      Switch to {info.title}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
