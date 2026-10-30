'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Gamepad2,
  Users,
  Trophy,
  Play,
  ChevronRight,
  Flame,
  Copy,
  Check,
  Award,
  Search,
  Bell,
  Settings,
  TrendingUp,
  Tv,
  LayoutDashboard,
  User,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface PlayerDashboardViewProps {
  user?: any;
  nextSession: any;
  vibeAttendeeCount: number;
  copiedCode: boolean;
  onCopyCode: (code: string) => void;
  vibeEnergy: number;
  setVibeEnergy: (lvl: number) => void;
  vibeStyle: 'active' | 'calm' | 'brainy';
  setVibeStyle: (style: 'active' | 'calm' | 'brainy') => void;
  vibeSubmitting: boolean;
  vibeSubmitted: boolean;
  onQuickVibe: () => Promise<void>;
  isCompact?: boolean;
}

export default function PlayerDashboardView({
  user,
  nextSession,
  vibeAttendeeCount,
  copiedCode,
  onCopyCode,
  vibeEnergy,
  setVibeEnergy,
  vibeStyle,
  setVibeStyle,
  vibeSubmitting,
  vibeSubmitted,
  onQuickVibe,
  isCompact = false,
}: PlayerDashboardViewProps) {
  const displayName = user?.name || 'Player';
  const userXp = user?.xp ?? 0;
  const userLevel = user?.level ?? 1;
  const userInitials = displayName.slice(0, 2).toUpperCase();
  const joinCode = nextSession?.joinCode || '';
  const sessionDate = nextSession?.date
    ? new Date(nextSession.date).toLocaleDateString()
    : 'Date to be announced';

  return (
    <div className="min-h-[100dvh] w-full bg-white dark:bg-slate-900 overflow-hidden flex flex-col md:flex-row transition-all">
      {/* Mini Sidebar */}
      <aside
        className={`${
          isCompact ? 'w-full md:w-48 p-3' : 'w-full md:w-56 p-4'
        } shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/70 flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-[11px] tracking-wider shadow-md shadow-blue-500/25">
              FQ
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
              FridayQuest
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold bg-blue-600 text-white shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <Link
              href="/sessions"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>My Sessions</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Library</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Teams</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>My Progress</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Achievements</span>
            </Link>
          </nav>
        </div>

        {/* Mini Sidebar Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs">
          <Link
            href="/roles"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/roles"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search games, sessions, or anything..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1"></span>
            </button>

            <ThemeToggle />

            <Link
              href={joinCode ? `/session/${encodeURIComponent(joinCode)}/screen` : '/sessions'}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 text-[11px] font-semibold"
            >
              <Tv className="w-3 h-3" />
              <span>TV</span>
            </Link>

            {/* Avatar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
                {userInitials}
              </div>
              <div className="text-right leading-none">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[9px] text-slate-400 capitalize">{user?.role || 'Player'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stage */}
        <div className={`${isCompact ? 'p-3.5 space-y-4' : 'p-5 sm:p-6 space-y-5'}`}>
          {/* Hero Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50/60 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/15 dark:to-purple-950/20 border border-blue-200/60 dark:border-blue-900/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden">
            <div className="space-y-1 text-center sm:text-left z-10">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                <span>👋</span>
                <span>Hi, {displayName}!</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Ready for some Fun Friday?
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-sm">
                Let's play together, connect better, and make this Friday amazing!
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-purple-200 dark:border-purple-900/40 text-center shadow-xs shrink-0 z-10 max-w-[200px]">
              <div className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300 italic leading-snug">
                “Good teams. Great people. Happier Fridays!”
              </div>
            </div>
          </div>

          {/* Next Friday Event Highlight Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                {nextSession ? 'Next Friday Event' : 'Upcoming Session'}
              </span>

              <button
                type="button"
                onClick={() => onCopyCode(joinCode)}
                disabled={!joinCode}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <span>{joinCode ? 'Room:' : 'No room code'}</span>
                {joinCode && <span className="text-blue-600 dark:text-blue-400">{joinCode}</span>}
                {copiedCode ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {nextSession?.title || 'No upcoming session'} {nextSession && '🎉'}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {sessionDate}{nextSession?.startTime ? ` • ${nextSession.startTime}` : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {nextSession?.location || 'Location to be announced'}
                  </span>
                </div>
                {nextSession && (
                  <div className="pt-0.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {vibeAttendeeCount} attending
                  </div>
                )}
              </div>

            </div>

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              {joinCode && (
                <Link
                  href={`/session/${encodeURIComponent(joinCode)}/play`}
                  className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter Live Room (Buzzer & Card)</span>
                </Link>
              )}
              <Link
                href="/sessions"
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <span>View Details</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 3 Middle Cards: Vibe Check, Journey XP, Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vibe Check Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  Vibe Check
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">How are you feeling for Friday?</p>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                  Your energy tomorrow?
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setVibeEnergy(lvl)}
                      className={`py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                        vibeEnergy === lvl
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {(['active', 'calm', 'brainy'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setVibeStyle(s)}
                    className={`py-1 rounded-md text-[10px] font-bold capitalize transition-all cursor-pointer ${
                      vibeStyle === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onQuickVibe}
                disabled={vibeSubmitting || vibeSubmitted}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-80"
              >
                {vibeSubmitted ? '✓ Vibe Submitted' : 'Submit Vibe (10s)'}
              </button>
            </div>

            {/* Journey XP Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Your FridayQuest Journey
                </h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Level {userLevel}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
                <div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                    {userXp} XP
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">Next milestone: {(userLevel + 1) * 200} XP</div>
                </div>
                <div className="text-2xl">⭐</div>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[70%] rounded-full"></div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-center text-xs">
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-950">
                  <div className="font-extrabold">5</div>
                  <div className="text-[8px] text-slate-400">Games Played</div>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-950">
                  <div className="font-extrabold text-emerald-600">2</div>
                  <div className="text-[8px] text-slate-400">Wins</div>
                </div>
                <div className="p-1 rounded bg-slate-50 dark:bg-slate-950">
                  <div className="font-extrabold text-purple-600">3</div>
                  <div className="text-[8px] text-slate-400">Badges</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Quick Actions
              </h4>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/games"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-bold text-[11px]">Browse Game Library</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
                <Link
                  href="/teams"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-bold text-[11px]">View My Team</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
                <Link
                  href="/sessions"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-bold text-[11px]">Past Sessions</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
                <Link
                  href="/roles"
                  className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-bold text-[11px]">Achievements</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Games for You Row */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Featured Games for You
              </h4>
              <Link href="/games" className="text-xs font-semibold text-blue-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: 'Two Truths & a Lie', time: '10 min • 4-10 players', tag: 'Popular', icon: '🎭' },
                { title: 'Chor-Police', time: '20 min • 6+ players', tag: 'High Energy', icon: '👑' },
                { title: 'Antakshari', time: '15 min • 4-8 players', tag: 'Team Game', icon: '🎵' },
                { title: 'QR Treasure Hunt', time: '25 min • 6-12 players', tag: 'Outdoor/Indoor', icon: '🔍' },
              ].map((g, idx) => (
                <Link
                  key={idx}
                  href="/games"
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-400 flex flex-col justify-between space-y-1.5 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{g.icon}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      {g.tag}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600">
                      {g.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{g.time}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
