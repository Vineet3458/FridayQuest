'use client';

import { useState } from 'react';
import { ShieldCheck, UserCheck, Mic, User, Check, Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import { UserRole } from '@/types';
import Link from 'next/link';

export const ROLE_INFO: Record<
  UserRole,
  {
    title: string;
    subtitle: string;
    badge: string;
    color: string;
    textColor: string;
    borderColor: string;
    description: string;
    features: string[];
  }
> = {
  superAdmin: {
    title: 'Super Admin',
    subtitle: 'Platform Owner (Kirxa)',
    badge: 'Platform Control',
    color: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500',
    description: 'Creates and manages company workspaces, oversees all organizations and system-wide settings.',
    features: [
      'Manage all organizations & workspaces',
      'Platform-wide metrics & telemetry',
      'Global game template overrides',
      'Full organizer & live host privileges',
    ],
  },
  orgAdmin: {
    title: 'Org Admin',
    subtitle: 'HR / Company Admin (e.g. Riya)',
    badge: 'Company Control',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500',
    description: 'Manages company staff, approves new joiners, configures invite codes, approves custom games, and creates seasons.',
    features: [
      'Approve & manage employees',
      'View & share company invite code',
      'Review & publish custom game builder drafts',
      'Auto-planner & Team Maker management',
    ],
  },
  organizer: {
    title: 'Organizer',
    subtitle: 'Fun Friday Host / Emcee (e.g. Kabir)',
    badge: 'Session Host',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500',
    description: 'Rotates each week. Creates the Friday session, runs Auto-Planner, generates teams, and controls the live game engine.',
    features: [
      'Create & publish Friday sessions',
      'Run pure Auto-Planner algorithm',
      'Generate fair mixed teams',
      'Live control panel (Next step, pause, skip, bonus award)',
    ],
  },
  player: {
    title: 'Player',
    subtitle: 'Employee / Participant (e.g. Ananya)',
    badge: 'Player View',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    description: 'Any team member. Submits 10-second Vibe Check, plays on mobile, uses phone-as-prop tools, and rates games.',
    features: [
      'Submit Vibe Check (energy, mood, skips)',
      'Phone-as-prop: Secret Role Card (press & hold)',
      'Phone-as-prop: Real-time Buzzer with lockout',
      'Post-game 1-5 ratings & recap review',
    ],
  },
};

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
    <div className="w-full bg-slate-950/95 border-b border-slate-800 backdrop-blur z-40 sticky top-0 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Active Role Indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                    active
                      ? `${info.color} shadow-sm font-bold ring-1 ring-white/20`
                      : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
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
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="View Role Access Details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Role Privileges Breakdown */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pb-2 text-xs">
            {(['superAdmin', 'orgAdmin', 'organizer', 'player'] as UserRole[]).map((role) => {
              const info = ROLE_INFO[role];
              const isCurrent = currentRole === role;
              return (
                <div
                  key={role}
                  className={`p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-slate-900/90 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-900/40 border-slate-800/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`font-bold ${info.textColor} flex items-center gap-1`}>
                      {info.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">
                        Active Now
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-[11px] mb-2 leading-snug">{info.description}</p>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {info.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {!isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleSwitchRole(role)}
                      className="mt-2.5 w-full py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
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

