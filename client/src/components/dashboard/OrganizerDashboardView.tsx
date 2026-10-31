'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronRight,
  Plus,
  ArrowRight,
  MapPin,
  Check,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';

interface OrganizerDashboardViewProps {
  user?: any;
  nextSession?: any;
  isCompact?: boolean;
}

export default function OrganizerDashboardView({
  user,
  nextSession,
  isCompact = false,
}: OrganizerDashboardViewProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Riya Sharma';
  const userInitials = displayName.slice(0, 2).toUpperCase();
  const joinCode = nextSession?.joinCode || '';
  const liveRoomUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/play` : '/sessions';
  const screenUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/screen` : '/sessions';

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAF5EF] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* 1. Sidebar - Organizer Warm Sunset Peach Tone */}
      <aside
        className={`${
          isCompact ? 'w-52 p-3' : 'w-60 p-4'
        } shrink-0 border-r border-amber-200/70 dark:border-slate-800/80 bg-[#FFFDF9] dark:bg-slate-950 hidden md:flex flex-col justify-between shadow-xs`}
      >
        <div className="space-y-5">
          {/* Logo with Orange/Amber Square Badge */}
          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-orange-500/25">
              FQ
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              FridayQuest
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {/* Active Dashboard item - Solid vibrant purple pill matching Organizer reference */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold bg-[#7C3AED] text-white shadow-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <Link
              href="/sessions"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Create Session</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Layers className="w-4 h-4 text-orange-500" />
              <span>Auto Planner</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Team Maker</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-4 h-4 text-purple-500" />
              <span>Game Library</span>
            </Link>
            <Link
              href={liveRoomUrl}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Play className="w-4 h-4 text-rose-500" />
              <span>Live Control</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Session History</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-amber-200/70 dark:border-slate-800/80 space-y-1 text-xs">
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-amber-100/40 dark:hover:bg-slate-800/60 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-amber-100/40 dark:hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-4 sm:px-6 py-3 border-b border-amber-200/70 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-[#FFFDF9]/90 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-20">
          {/* Mobile hamburger toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-amber-800 dark:text-slate-300 hover:bg-amber-100/50 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-[10px]">
              FQ
            </div>
          </div>

          {/* Warm Tinted Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-amber-700/40 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sessions, games..."
              className="w-full bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-amber-800/40 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-amber-100/50 dark:hover:bg-slate-800 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            <ThemeToggle />

            <Link
              href={screenUrl}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Projector TV</span>
            </Link>

            {/* Avatar - Clean Production Role Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-amber-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-orange-500/20">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium capitalize">
                  {user?.role || 'Organizer'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] dark:bg-slate-950 border-b border-amber-200 dark:border-slate-800 p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1 text-xs">
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold bg-[#7C3AED] text-white shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <Link
                href="/sessions"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Create Session</span>
              </Link>
              <Link
                href="/sessions"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Auto Planner</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Team Maker</span>
              </Link>
              <Link
                href="/games"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Gamepad2 className="w-4 h-4 text-purple-500" />
                <span>Game Library</span>
              </Link>
              <Link
                href={liveRoomUrl}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Play className="w-4 h-4 text-rose-500" />
                <span>Live Control</span>
              </Link>
              <Link
                href="/sessions"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Session History</span>
              </Link>
            </nav>
            <div className="pt-2 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">{displayName} ({user?.role || 'Organizer'})</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-rose-600 font-bold hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
          {/* HEADER GREETING BANNER - Warm Sunset Peach / Apricot theme */}
          <div className="bg-gradient-to-r from-[#FED7AA]/60 via-[#FDE68A]/40 to-[#FECDD3]/50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              {/* Illustrated Host avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <span className="text-3xl">👩‍💼</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Good Morning, {displayName}!
                  </h2>
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Plan, Organize, Play. Make Fridays Unforgettable!
                </p>
              </div>
            </div>

            {/* Quote Pill Card */}
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-xs shrink-0 z-10 italic">
              “Games bring people closer.”
            </div>
          </div>

          {/* 4 TOP STAT CARDS IN A ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Upcoming Sessions */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">3</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Upcoming Sessions</div>
              </div>
            </div>

            {/* Card 2: Total Participants */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">128</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Total Participants</div>
              </div>
            </div>

            {/* Card 3: Games Conducted */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">24</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Games Conducted</div>
              </div>
            </div>

            {/* Card 4: Avg. Rating */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">4.8</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Avg. Rating</div>
              </div>
            </div>
          </div>

          {/* 3 MID CARDS: NEXT SESSION, SESSION PLANNER STEPPER, QUICK TOOLS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Column 1: Next Session (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#7C3AED] bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full">
                  Next Session
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {nextSession?.title || 'Fun Friday Kickoff'} 🎉
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {nextSession?.date ? new Date(nextSession.date).toLocaleDateString() : 'Fri, Oct 30, 2026'} • {nextSession?.startTime || '4:00 PM - 5:30 PM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{nextSession?.location || 'Cafeteria, Noida'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>85 / 120 participants confirmed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/sessions"
                  className="flex-1 py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit Session
                </Link>
                <Link
                  href={liveRoomUrl}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-center text-xs font-extrabold transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Session</span>
                </Link>
              </div>
            </div>

            {/* Column 2: Session Planner Stepper (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Session Planner
              </h4>

              <div className="space-y-3">
                {[
                  { step: 1, title: 'Select Games', desc: 'Choose from library', active: true },
                  { step: 2, title: 'Create Plan', desc: 'Auto-arrange or manual', active: true },
                  { step: 3, title: 'Generate Teams', desc: 'Balanced team allocation', active: false },
                  { step: 4, title: 'Review & Publish', desc: 'Final check and notify', active: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        s.active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {s.step}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/sessions"
                className="w-full py-2 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Continue Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 3: Quick Tools (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider pb-1">
                Quick Tools
              </h4>

              <div className="space-y-1.5">
                {[
                  { title: 'Auto Planner', desc: 'Generate best game plan', icon: '⚡', color: 'text-cyan-600', href: '/sessions' },
                  { title: 'Team Maker', desc: 'Create balanced teams', icon: '👥', color: 'text-emerald-600', href: '/teams' },
                  { title: 'Game Library', desc: 'Browse and select games', icon: '🎮', color: 'text-purple-600', href: '/games' },
                  { title: 'Live Control', desc: 'Manage ongoing session', icon: '🔴', color: 'text-rose-600', href: liveRoomUrl },
                ].map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    className="p-2 rounded-2xl hover:bg-amber-50/70 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors group"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${tool.color} group-hover:underline`}>
                        {tool.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* TODAY'S READY CHECKLIST */}
          <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
              Today's Ready Checklist
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { title: 'Games Selected', sub: '5 games in plan' },
                { title: 'Teams Generated', sub: '4 teams (3-4 members)' },
                { title: 'Props Ready', sub: 'All materials ready' },
                { title: 'Location Confirmed', sub: 'Cafeteria, Noida' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT SESSIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Recent Sessions
              </h4>
              <Link href="/sessions" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'September Fun Friday', date: 'Sep 23, 2026', att: '92 participants', rating: '4.8', thumb: '🎉' },
                { name: 'Independence Special', date: 'Aug 15, 2026', att: '76 participants', rating: '4.6', thumb: '🇮🇳' },
                { name: 'Team Bonding Day', date: 'Jul 28, 2026', att: '68 participants', rating: '4.7', thumb: '🤝' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-amber-50 dark:bg-slate-800">{s.thumb}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.date} • {s.att}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{s.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
