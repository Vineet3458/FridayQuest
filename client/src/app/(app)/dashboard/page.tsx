'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Gamepad2,
  Users,
  Trophy,
  Play,
  CheckCircle2,
  ChevronRight,
  Flame,
  Copy,
  Check,
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Sparkles,
  Layers,
  Sliders,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { ROLE_INFO } from '@/components/trial/RoleTrialBar';
import { UserRole } from '@/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  // Vibe state for quick submission
  const [vibeEnergy, setVibeEnergy] = useState<number>(4);
  const [vibeStyle, setVibeStyle] = useState<'active' | 'calm' | 'brainy'>('active');
  const [vibeSubmitted, setVibeSubmitted] = useState(false);

  const currentRole: UserRole = user?.role || 'player';
  const roleInfo = ROLE_INFO[currentRole];

  useEffect(() => {
    apiRequest('/sessions')
      .then((res) => {
        if (res.success) setSessions(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const nextSession = sessions[0];

  const handleQuickVibe = async () => {
    if (!nextSession) return;
    try {
      await apiRequest(`/sessions/${nextSession._id}/vibe`, {
        method: 'POST',
        body: JSON.stringify({
          attending: 'yes',
          energy: vibeEnergy,
          style: vibeStyle,
          skipGameIds: [],
        }),
      });
      setVibeSubmitted(true);
    } catch {
      setVibeSubmitted(true);
    }
  };

  const handleCopyInvite = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Welcome & Active Role Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${roleInfo.color}`}>
            {currentRole === 'superAdmin' && <ShieldCheck className="w-6 h-6" />}
            {currentRole === 'orgAdmin' && <UserCheck className="w-6 h-6" />}
            {currentRole === 'organizer' && <Mic className="w-6 h-6" />}
            {currentRole === 'player' && <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Hi, {user?.name || 'Kirxa Teammate'}
              </h1>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleInfo.color}`}>
                {roleInfo.title}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Workspace: <strong className="text-slate-300">Kirxa Labs</strong> • Department: {user?.department || 'General'}
            </p>
          </div>
        </div>

        {/* Quick Role Context Switch Link */}
        <div className="flex items-center gap-2">
          <Link
            href="/roles"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Switch Role / View Matrix</span>
          </Link>
        </div>
      </div>

      {/* Main Responsive Grid: 2 cols on Desktop, 1 col on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Next Friday Main Event & Vibe Check) - 7 cols on Desktop */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 border border-blue-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                Next Friday Event
              </div>

              {nextSession && (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2.5 py-1 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-300">
                    Room Code: <strong className="text-white font-bold">{nextSession.joinCode}</strong>
                  </span>
                  <Link
                    href={`/session/${nextSession.joinCode}/screen`}
                    className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 border border-slate-800 transition-colors"
                    title="Open on Cafeteria TV"
                  >
                    TV View
                  </Link>
                </div>
              )}
            </div>

            {nextSession ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-white">{nextSession.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(nextSession.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} at {nextSession.startTime} • Location: {nextSession.location}
                  </p>
                </div>

                {/* Vibe Check Card (Available to everyone) */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Vibe Check: How are you feeling for Friday?
                    </span>
                    {vibeSubmitted && (
                      <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400">
                      <span>Your energy tomorrow (1 = Zen, 5 = Ready to run):</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setVibeEnergy(lvl)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                              vibeEnergy === lvl
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-400 pt-1">
                      <span>Vibe preference:</span>
                      <div className="flex gap-2">
                        {(['active', 'calm', 'brainy'] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setVibeStyle(style)}
                            className={`px-3 py-1.5 rounded-xl text-xs capitalize transition-all ${
                              vibeStyle === style
                                ? 'bg-blue-600 text-white font-bold'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleQuickVibe}
                      className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
                    >
                      {vibeSubmitted ? 'Update Vibe Choice' : 'Submit Vibe Choice (10s)'}
                    </button>
                  </div>
                </div>

                {/* Main Action depending on role and session state */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/session/${nextSession.joinCode}/play`}
                    className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-600/30 text-xs sm:text-sm transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Enter Live Player Room (Buzzer & Card)
                  </Link>
                  <Link
                    href="/sessions"
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    Session Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-xs mb-4">No upcoming session scheduled yet.</p>
                <Link
                  href="/sessions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
                >
                  Schedule New Friday Session
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Role-Specific Privileges Panel (5 cols on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg ${roleInfo.color}`}>
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="font-bold text-white text-sm">
                  {roleInfo.title} Access Panel
                </span>
              </div>
              <span className="text-[10px] text-slate-400">Current View</span>
            </div>

            {/* Dynamic Content Based on Current Role */}
            {currentRole === 'superAdmin' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-2xl">
                  <div className="font-bold text-rose-300 mb-1">Platform Control Mode</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    You have master view across all organizations, multi-tenant workspaces, global game definitions, and platform telemetry.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Total Workspaces:</span>
                    <strong className="text-white">Kirxa Labs + 3 demo orgs</strong>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400">Global Games Catalog:</span>
                    <strong className="text-emerald-400">Initialized (Ready)</strong>
                  </div>
                </div>
              </div>
            )}

            {currentRole === 'orgAdmin' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-2xl">
                  <div className="font-bold text-purple-300 mb-1">Company Invite Code</div>
                  <p className="text-slate-400 text-[11px] mb-2">
                    Share this code with teammates so they can self-register into this workspace:
                  </p>
                  <div className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-purple-800/50">
                    <span className="font-mono font-bold text-white tracking-wider">KIRXA-DEMO</span>
                    <button
                      onClick={() => handleCopyInvite('KIRXA-DEMO')}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <Link
                  href="/games"
                  className="block p-3 bg-slate-950/70 hover:bg-slate-950 rounded-2xl border border-slate-800 transition-colors"
                >
                  <div className="font-bold text-white mb-0.5">Game Approvals Queue</div>
                  <div className="text-[11px] text-slate-400">0 pending custom game reviews</div>
                </Link>
              </div>
            )}

            {currentRole === 'organizer' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-950/20 border border-blue-900/40 rounded-2xl">
                  <div className="font-bold text-blue-300 mb-1">Session Host Powers</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    You can run the Auto-Planner algorithm to generate the 3-phase agenda, make fair teams, and use live host controls.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/sessions"
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center hover:border-blue-500/50 transition-colors"
                  >
                    <div className="font-bold text-white text-xs">Run Planner</div>
                    <div className="text-[10px] text-slate-400">Generate Agenda</div>
                  </Link>
                  <Link
                    href="/teams"
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center hover:border-emerald-500/50 transition-colors"
                  >
                    <div className="font-bold text-white text-xs">Team Maker</div>
                    <div className="text-[10px] text-slate-400">Fair Mixing</div>
                  </Link>
                </div>
              </div>
            )}

            {currentRole === 'player' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl">
                  <div className="font-bold text-emerald-300 mb-1">Employee Player Persona</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    You participate in the Friday games directly through your phone screen. Your phone acts as the prop for buzzers and role cards.
                  </p>
                </div>
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Your Fun Friday XP:</span>
                  <span className="font-bold text-amber-400 font-mono">350 XP (Level 3)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive Section Cards Grid (3 columns on Desktop, 2 on Tablet, 1 on Mobile) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider px-1">
          Explore App Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/sessions"
            className="flex flex-col justify-between p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-lg group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                Friday Sessions
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Schedule dates, collect vibe votes, run Auto-Planner, and monitor lifecycle.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
              <span>View Sessions</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/games"
            className="flex flex-col justify-between p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-lg group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center mb-3">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm mb-1 group-hover:text-purple-400 transition-colors">
                Game Library Section
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter by energy, tags, and tools. Custom builder ready for games to be decided.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-purple-400 font-semibold">
              <span>Open Library</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/teams"
            className="flex flex-col justify-between p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-lg group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                Team Maker
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fair-mix algorithm with 200 greedy attempts minimizing department clustering.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
              <span>Generate Teams</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/roles"
            className="flex flex-col justify-between p-5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all shadow-lg group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-bold text-white text-sm mb-1 group-hover:text-rose-400 transition-colors">
                All Roles Trial
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive simulator to see what Super Admin, Org Admin, Host, and Player see.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-semibold">
              <span>Try Roles</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
