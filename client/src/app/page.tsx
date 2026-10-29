'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Gamepad2,
  Users,
  Trophy,
  ArrowRight,
  Activity,
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Tv,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';

export default function LandingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [joinCode, setJoinCode] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [trialLoading, setTrialLoading] = useState<UserRole | null>(null);

  useEffect(() => {
    apiRequest<any>('/health')
      .then((res) => {
        if ((res as any).status === 'healthy' || res.data?.status === 'healthy') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('disconnected');
        }
      })
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    router.push(`/session/${joinCode.trim().toUpperCase()}/play`);
  };

  const handleQuickTrial = async (role: UserRole) => {
    setTrialLoading(role);
    try {
      const res = await apiRequest('/auth/trial', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        router.push('/dashboard');
      }
    } catch {
      // Offline fallback
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
      router.push('/dashboard');
    } finally {
      setTrialLoading(null);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col justify-between">
      {/* Top Banner Status */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>
          <span>FridayQuest • Release 1.0 (MVP)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
            <Activity
              className={`w-3.5 h-3.5 ${
                backendStatus === 'connected'
                  ? 'text-green-400 animate-pulse'
                  : backendStatus === 'checking'
                  ? 'text-yellow-400'
                  : 'text-red-400'
              }`}
            />
            <span className="text-slate-300">
              {backendStatus === 'connected' ? 'Backend Live' : backendStatus === 'checking' ? 'Connecting...' : 'API Offline'}
            </span>
          </div>

          <Link
            href="/session/DEMO/screen"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <Tv className="w-3.5 h-3.5 text-blue-400" /> TV Screen View
          </Link>
        </div>
      </div>

      {/* Main Responsive Grid: Hero Left, Role Trial & Join Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Left Column (Hero & Pitch) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-800/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Offline-First Fun Friday Game Master
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Turn Office Fridays Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pure Magic</span>
          </h1>

          <p className="text-slate-300 sm:text-base text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
            The game-show host that lives inside every phone. It explains rules, starts synchronized timers, secretly deals roles, locks buzzers, counts points, and remembers who bonded with whom.
          </p>

          {/* Quick Room Code Join Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur max-w-lg mx-auto lg:mx-0">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Have a 6-letter room code from your TV?
            </div>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. KIRX7F"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                maxLength={8}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center sm:text-left font-mono text-lg font-bold tracking-widest text-white uppercase focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all text-sm"
              >
                <span>Join Game</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quick Feature Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
              <Gamepad2 className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <div className="text-xs sm:text-sm font-bold text-white">No Referee</div>
              <div className="text-[10px] sm:text-xs text-slate-400">Phone moderates</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
              <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <div className="text-xs sm:text-sm font-bold text-white">Fair Mix</div>
              <div className="text-[10px] sm:text-xs text-slate-400">Meet new peers</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 sm:p-4 text-center">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <div className="text-xs sm:text-sm font-bold text-white">Live Scores</div>
              <div className="text-[10px] sm:text-xs text-slate-400">No manual tally</div>
            </div>
          </div>
        </div>

        {/* Right Column (Instant Role Trial Cards & Actions) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">All Roles Trial Options</h2>
                <p className="text-xs text-slate-400">
                  Select any persona to see exactly what each role sees on the website:
                </p>
              </div>
              <Link
                href="/roles"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                Matrix →
              </Link>
            </div>

            {/* Trial Buttons Grid (2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Super Admin */}
              <button
                type="button"
                onClick={() => handleQuickTrial('superAdmin')}
                disabled={trialLoading !== null}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-500/10">
                    Platform
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-rose-300">
                  Super Admin
                </div>
                <div className="text-[10px] text-slate-400">All workspaces & metrics</div>
              </button>

              {/* Org Admin */}
              <button
                type="button"
                onClick={() => handleQuickTrial('orgAdmin')}
                disabled={trialLoading !== null}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-purple-400 px-1.5 py-0.5 rounded bg-purple-500/10">
                    HR Admin
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-purple-300">
                  Org Admin
                </div>
                <div className="text-[10px] text-slate-400">User approvals & games</div>
              </button>

              {/* Organizer */}
              <button
                type="button"
                onClick={() => handleQuickTrial('organizer')}
                disabled={trialLoading !== null}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10">
                    Session Host
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-blue-300">
                  Organizer
                </div>
                <div className="text-[10px] text-slate-400">Auto-planner & live host</div>
              </button>

              {/* Player */}
              <button
                type="button"
                onClick={() => handleQuickTrial('player')}
                disabled={trialLoading !== null}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                    Employee
                  </span>
                </div>
                <div className="font-bold text-xs text-white group-hover:text-emerald-300">
                  Player View
                </div>
                <div className="text-[10px] text-slate-400">Vibe check, buzzer & card</div>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/register"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center shadow-md shadow-blue-600/20 text-xs transition-colors"
              >
                Create Company Workspace
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/join"
                  className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl text-center text-xs font-semibold border border-slate-800 transition-colors"
                >
                  Join with Code
                </Link>
                <Link
                  href="/login"
                  className="flex-1 py-2.5 px-3 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl text-center text-xs font-semibold border border-slate-800 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="mt-8 pt-4 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Prepared for Kirxa | FridayQuest MVP Release 1.0</span>
        <span>Responsive for Laptop/Desktop, Tablets & Mobiles</span>
      </div>
    </main>
  );
}
