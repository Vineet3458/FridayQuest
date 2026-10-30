'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Check,
  X,
  Sparkles,
  Tv,
  Gamepad2,
  Users as UsersIcon,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROLE_INFO } from '@/lib/roles';
import { UserRole } from '@/types';
import Link from 'next/link';

interface CapabilityRow {
  capability: string;
  category: string;
  superAdmin: boolean;
  orgAdmin: boolean;
  organizer: boolean;
  player: boolean;
  description: string;
}

const CAPABILITIES: CapabilityRow[] = [
  {
    capability: 'Multi-Company Workspaces',
    category: 'Platform',
    superAdmin: true,
    orgAdmin: false,
    organizer: false,
    player: false,
    description: 'Create & manage multiple company accounts on FridayQuest.',
  },
  {
    capability: 'User Approvals & Invites',
    category: 'Workspace',
    superAdmin: true,
    orgAdmin: true,
    organizer: false,
    player: false,
    description: 'Approve new joiners and share company invite codes (e.g. KIRXA-7F3Q).',
  },
  {
    capability: 'Custom Game Builder Approval',
    category: 'Game Catalog',
    superAdmin: true,
    orgAdmin: true,
    organizer: false,
    player: false,
    description: 'Review custom games (Level 1 Rule Card & Level 2 Tool-Based) and publish to company library.',
  },
  {
    capability: 'Create Friday Session',
    category: 'Sessions',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Schedule a Fun Friday event with date, time, duration, and cafeteria location.',
  },
  {
    capability: 'Run Auto-Planner (Arranger)',
    category: 'Sessions',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Auto-schedule warm-up, main event, and finale using vibe scores and headcount.',
  },
  {
    capability: 'Team Maker (Fair Mixing Permutations)',
    category: 'Sessions',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Generate 2-6 mixed teams minimizing cross-department clustering.',
  },
  {
    capability: 'Live Session Master Control',
    category: 'Live Engine',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Next step, pause timer, skip game, trigger buzzer reset, and award bonus points.',
  },
  {
    capability: 'Phone-as-Prop: Secret Role Card',
    category: 'Phone Tools',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Press & hold screen to reveal secret role (e.g., Impostor / Mafia). Releases hide role.',
  },
  {
    capability: 'Phone-as-Prop: Live Buzzer Lockout',
    category: 'Phone Tools',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Tap buzzer within milliseconds. Server locks all other devices until host resets.',
  },
  {
    capability: '10-Second Friday Vibe Check',
    category: 'Pre-Event',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Rate energy 1-5, prefer active/calm/brainy games, and flag games to skip.',
  },
  {
    capability: 'Post-Game Anonymous Rating',
    category: 'Post-Event',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Rate 1-5 stars and select quick tags (e.g., #TooLoud, #LovedTheImpostor).',
  },
];

export default function RolesMatrixPage() {
  const user = useAuthStore((state) => state.user);
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'player');

  const currentRole: UserRole = user?.role || 'player';

  const selectedInfo = ROLE_INFO[selectedRole];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Title & Intro */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Role access reference
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Role Privileges
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          Review permissions for each account role. Previewing a role here does not change your account or grant access.
        </p>
      </div>

      {/* Role reference cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['superAdmin', 'orgAdmin', 'organizer', 'player'] as UserRole[]).map((role) => {
          const info = ROLE_INFO[role];
          const isSelected = selectedRole === role;
          const isActiveUser = currentRole === role;

          return (
            <button
              type="button"
              key={role}
              onClick={() => setSelectedRole(role)}
              aria-pressed={isSelected}
              className={`w-full cursor-pointer rounded-2xl border p-5 text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `bg-white dark:bg-slate-900 ${info.borderColor} shadow-lg ring-2 ring-blue-500/20 dark:ring-white/10`
                  : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl ${info.color}`}>
                    {role === 'superAdmin' && <ShieldCheck className="w-5 h-5" />}
                    {role === 'orgAdmin' && <UserCheck className="w-5 h-5" />}
                    {role === 'organizer' && <Mic className="w-5 h-5" />}
                    {role === 'player' && <User className="w-5 h-5" />}
                  </div>

                  {isActiveUser && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                      Active
                    </span>
                  )}
                </div>

                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{info.title}</h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">{info.subtitle}</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {info.description}
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isActiveUser ? 'Your account role' : 'Select to preview permissions'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Role Deep Dive Showcase */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400 mb-1">
              Permission Reference
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              What does <span className={selectedInfo.textColor}>{selectedInfo.title}</span> see & access?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition-colors border border-slate-200 dark:border-transparent"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid for Selected Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Calendar className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              Sessions & Agenda View
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Players see upcoming Friday times, submit their 10-second Vibe Check, and see the final published agenda.'
                : 'Organizers and Admins can create new sessions, edit game durations, and trigger the Auto-Planner algorithm.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Gamepad2 className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Game Library & Custom Games
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Can browse all company games, search by energy level, and propose anonymous new game ideas.'
                : 'Can access the Custom Game Builder (Level 1 Rule Cards, Level 2 Tool-Based), validate flow rules, and publish.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <UsersIcon className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              Team Maker & Fair Mix
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Sees their assigned team, team color, and teammates before the event begins.'
                : 'Can configure number of teams, run 200 fair-mix permutations, and manually tweak team rosters.'}
            </p>
          </div>
        </div>
      </div>

      {/* Complete Access Permissions Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Comprehensive Permissions Matrix</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct comparison of all capabilities specified in the Product & Technical Plan (MVP).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">Feature Capability</th>
                <th className="py-3 px-2 font-bold text-center text-rose-500 dark:text-rose-400">Super Admin</th>
                <th className="py-3 px-2 font-bold text-center text-purple-500 dark:text-purple-400">Org Admin</th>
                <th className="py-3 px-2 font-bold text-center text-blue-500 dark:text-blue-400">Organizer</th>
                <th className="py-3 px-2 font-bold text-center text-emerald-500 dark:text-emerald-400">Player</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {CAPABILITIES.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{row.capability}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.description}</div>
                  </td>

                  {/* Super Admin */}
                  <td className="py-3 px-2 text-center">
                    {row.superAdmin ? (
                      <Check className="w-4 h-4 text-rose-500 dark:text-rose-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Org Admin */}
                  <td className="py-3 px-2 text-center">
                    {row.orgAdmin ? (
                      <Check className="w-4 h-4 text-purple-500 dark:text-purple-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Organizer */}
                  <td className="py-3 px-2 text-center">
                    {row.organizer ? (
                      <Check className="w-4 h-4 text-blue-500 dark:text-blue-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Player */}
                  <td className="py-3 px-2 text-center">
                    {row.player ? (
                      <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 dark:text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
