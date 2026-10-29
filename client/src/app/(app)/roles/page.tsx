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
  ArrowRight,
  Eye,
  Tv,
  Gamepad2,
  Users as UsersIcon,
  Calendar,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROLE_INFO } from '@/components/trial/RoleTrialBar';
import { UserRole } from '@/types';
import { apiRequest } from '@/lib/api';
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
    capability: 'Generate Fair-Mix Teams',
    category: 'Teams',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Run 200 greedy attempts with cost function to balance teams and mix departments.',
  },
  {
    capability: 'Live Game Host Controls',
    category: 'Live Play',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: false,
    description: 'Control live game on cafeteria TV: Next Step, Pause, Skip, Award bonus points.',
  },
  {
    capability: 'Secret Role Card Reveal',
    category: 'Phone Tool',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Private role card on phone screen. Press and hold to reveal role without moderator.',
  },
  {
    capability: 'Real-time Live Buzzer',
    category: 'Phone Tool',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Interactive big buzzer button with server timestamp and instant lockout.',
  },
  {
    capability: 'Submit Vibe Check (RSVP)',
    category: 'Participation',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Answer 4 quick questions: Coming? Energy level? Active/Calm/Brainy? Games to skip?',
  },
  {
    capability: 'Rate Games & View Recap',
    category: 'Participation',
    superAdmin: true,
    orgAdmin: true,
    organizer: true,
    player: true,
    description: 'Rate games 1 to 5 stars, review podium standings, and earn XP badges.',
  },
];

export default function RolesMatrixPage() {
  const { user, setUser } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'player');
  const [switching, setSwitching] = useState(false);

  const currentRole: UserRole = user?.role || 'player';

  const handleActivateRole = async (role: UserRole) => {
    setSelectedRole(role);
    setSwitching(true);
    try {
      const res = await apiRequest('/auth/trial', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch {
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
      setSwitching(false);
    }
  };

  const selectedInfo = ROLE_INFO[selectedRole];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Title & Intro */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          All Roles Trial & Access Explorer
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Role Privileges & Live Simulation
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          FridayQuest has 4 distinct roles designed for office dynamics. Select any role below to experience what they see, test their workflows, and switch your active session with 1 click.
        </p>
      </div>

      {/* Role Selector Cards Grid (Responsive 1-col mobile, 2-col tablet, 4-col laptop/desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(['superAdmin', 'orgAdmin', 'organizer', 'player'] as UserRole[]).map((role) => {
          const info = ROLE_INFO[role];
          const isSelected = selectedRole === role;
          const isActiveUser = currentRole === role;

          return (
            <div
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-900 ${info.borderColor} shadow-xl ring-2 ring-white/10`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
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
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Active
                    </span>
                  )}
                </div>

                <h2 className="font-extrabold text-base text-white">{info.title}</h2>
                <div className="text-xs text-slate-400 mb-2 font-medium">{info.subtitle}</div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {info.description}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleActivateRole(role);
                }}
                disabled={isActiveUser || switching}
                className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isActiveUser
                    ? 'bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20'
                }`}
              >
                {isActiveUser ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Currently Acting as {info.title}
                  </>
                ) : (
                  <>
                    <span>Switch to {info.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Role Deep Dive Showcase */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs uppercase font-bold tracking-widest text-blue-400 mb-1">
              Role Perspective Preview
            </div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              What does <span className={selectedInfo.textColor}>{selectedInfo.title}</span> see & access?
            </h2>
            <p className="text-xs text-slate-400 mt-1">{selectedInfo.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {currentRole !== selectedRole && (
              <button
                onClick={() => handleActivateRole(selectedRole)}
                className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4" /> Try Acting as {selectedInfo.title} Now
              </button>
            )}
            <Link
              href="/dashboard"
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid for Selected Role */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Calendar className="w-4 h-4 text-blue-400" />
              Sessions & Agenda View
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Players see upcoming Friday times, submit their 10-second Vibe Check, and see the final published agenda.'
                : 'Organizers and Admins can create new sessions, edit game durations, and trigger the Auto-Planner algorithm.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              Game Library & Custom Games
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Can browse all company games, search by energy level, and propose anonymous new game ideas.'
                : 'Can access the Custom Game Builder (Level 1 Rule Cards, Level 2 Tool-Based), validate flow rules, and publish.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <UsersIcon className="w-4 h-4 text-emerald-400" />
              Team Maker & Fair Mix
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedRole === 'player'
                ? 'Sees their assigned team, team color, and teammates before the event begins.'
                : 'Can configure number of teams, run 200 fair-mix permutations, and manually tweak team rosters.'}
            </p>
          </div>
        </div>
      </div>

      {/* Complete Access Permissions Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div>
          <h2 className="text-lg font-bold text-white">Comprehensive Permissions Matrix</h2>
          <p className="text-xs text-slate-400">
            Direct comparison of all capabilities specified in the Product & Technical Plan (MVP).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 font-bold">Feature Capability</th>
                <th className="py-3 px-2 font-bold text-center text-rose-400">Super Admin</th>
                <th className="py-3 px-2 font-bold text-center text-purple-400">Org Admin</th>
                <th className="py-3 px-2 font-bold text-center text-blue-400">Organizer</th>
                <th className="py-3 px-2 font-bold text-center text-emerald-400">Player</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {CAPABILITIES.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{row.capability}</div>
                    <div className="text-[11px] text-slate-400">{row.description}</div>
                  </td>

                  {/* Super Admin */}
                  <td className="py-3 px-2 text-center">
                    {row.superAdmin ? (
                      <Check className="w-4 h-4 text-rose-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Org Admin */}
                  <td className="py-3 px-2 text-center">
                    {row.orgAdmin ? (
                      <Check className="w-4 h-4 text-purple-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Organizer */}
                  <td className="py-3 px-2 text-center">
                    {row.organizer ? (
                      <Check className="w-4 h-4 text-blue-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Player */}
                  <td className="py-3 px-2 text-center">
                    {row.player ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
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

