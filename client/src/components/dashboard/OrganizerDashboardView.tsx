'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Gamepad2,
  Users,
  Trophy,
  Play,
  Sparkles,
  Layers,
  Search,
  Bell,
  Settings,
  Tv,
  LayoutDashboard,
  User,
  Star,
  CheckCircle,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface OrganizerDashboardViewProps {
  user?: any;
  nextSession: any;
  isCompact?: boolean;
}

export default function OrganizerDashboardView({
  user,
  nextSession,
  isCompact = false,
}: OrganizerDashboardViewProps) {
  const displayName = user?.name || 'Organizer';
  const userInitials = displayName.slice(0, 2).toUpperCase();
  const joinCode = nextSession?.joinCode || '';
  const liveRoomUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/play` : '/sessions';
  const screenUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/screen` : '/sessions';

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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center font-black text-white text-[11px] tracking-wider shadow-md shadow-purple-500/25">
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
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-bold bg-purple-600 text-white shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <Link
              href="/sessions"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Session</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Auto Planner</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Maker</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Library</span>
            </Link>
            <Link
              href={liveRoomUrl}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Live Control</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Session History</span>
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
              placeholder="Search sessions, games..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 absolute top-1 right-1"></span>
            </button>

            <ThemeToggle />

            <Link
              href={screenUrl}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-semibold"
            >
              <Tv className="w-3 h-3" />
              <span>TV</span>
            </Link>

            {/* Avatar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-black text-[10px] flex items-center justify-center">
                {userInitials}
              </div>
              <div className="text-right leading-none">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[9px] text-purple-500 capitalize font-medium">{user?.role || 'Organizer'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stage */}
        <div className={`${isCompact ? 'p-3.5 space-y-4' : 'p-5 sm:p-6 space-y-5'}`}>
          {/* Header Greeting Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50/50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-orange-950/20 border border-purple-200/60 dark:border-purple-900/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Good Morning, {displayName}! 👋
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Ready to create an amazing Fun Friday session? Plan, organize and make it unforgettable!
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-purple-200 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-xs shrink-0">
              “Games bring people closer.”
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white leading-none">3</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Upcoming Sessions</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white leading-none">128</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Total Participants</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white leading-none">24</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Games Conducted</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white leading-none">4.8</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Avg. Rating</div>
              </div>
            </div>
          </div>

          {/* 3 Middle Cards: Next Session, Stepper, Quick Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Next Session */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase text-purple-600 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                  Next Session
                </span>
                <span className="text-[9px] font-bold text-slate-400">Upcoming</span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {nextSession?.title || 'No upcoming session'}
                </h3>
                <div className="text-xs text-slate-500 space-y-0.5 mt-1.5">
                  <div>Fri, Oct 30, 2026 • 4:00 PM - 5:30 PM</div>
                  <div>Cafeteria, Noida</div>
                  <div className="font-semibold text-emerald-600">85 / 120 participants confirmed</div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Link
                  href="/sessions"
                  className="flex-1 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit Session
                </Link>
                <Link
                  href={liveRoomUrl}
                  className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-center text-xs font-bold transition-colors shadow-xs"
                >
                  ▶ Start Session
                </Link>
              </div>
            </div>

            {/* Session Planner Stepper */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Session Planner
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { step: '1', name: 'Select Games', sub: 'Choose from library', done: true },
                  { step: '2', name: 'Create Plan', sub: 'Auto-arrange or manual', done: true },
                  { step: '3', name: 'Generate Teams', sub: 'Balanced team allocation', done: true },
                  { step: '4', name: 'Review & Publish', sub: 'Final check and notify', done: false },
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                        s.done ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {s.done ? '✓' : s.step}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-[11px]">{s.name}</div>
                      <div className="text-[9px] text-slate-400">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/sessions"
                className="w-full py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-purple-600 text-center rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Continue Planning →
              </Link>
            </div>

            {/* Quick Tools */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1.5">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white pb-0.5">
                Quick Tools
              </h4>
              {[
                { title: 'Auto Planner', desc: 'Generate best plan', href: '/sessions' },
                { title: 'Team Maker', desc: 'Create balanced teams', href: '/teams' },
                { title: 'Game Library', desc: 'Browse & select games', href: '/games' },
                { title: 'Live Control', desc: 'Manage ongoing session', href: liveRoomUrl },
              ].map((tool, idx) => (
                <Link
                  key={idx}
                  href={tool.href}
                  className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col transition-colors"
                >
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-400">
                    {tool.title}
                  </span>
                  <span className="text-[9px] text-slate-500">{tool.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Today's Ready Checklist */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
              Today's Ready Checklist
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              {[
                { title: 'Games Selected', sub: '3 games in plan' },
                { title: 'Teams Generated', sub: '4 teams (3-4 members)' },
                { title: 'Props Ready', sub: 'All materials ready' },
                { title: 'Location Confirmed', sub: 'Cafeteria, Noida' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-[11px]">{item.title}</div>
                    <div className="text-[9px] text-emerald-700 dark:text-emerald-300">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Recent Sessions
              </h4>
              <Link href="/sessions" className="text-xs font-semibold text-purple-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'September Fun Friday', date: 'Sep 23, 2026', att: '92 participants', rating: '★ 4.8' },
                { name: 'Independence Special', date: 'Aug 15, 2026', att: '76 participants', rating: '★ 4.6' },
                { name: 'Team Bonding Day', date: 'Jul 28, 2026', att: '68 participants', rating: '★ 4.7' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-500">{s.date} • {s.att}</div>
                  </div>
                  <span className="text-xs font-bold text-amber-500">{s.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
