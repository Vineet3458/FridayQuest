'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Gamepad2,
  Users,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  User,
  BarChart2,
  CheckSquare,
  ShieldCheck,
  Star,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';

interface OrgAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function OrgAdminDashboardView({
  user,
  isCompact = false,
}: OrgAdminDashboardViewProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [chartFilter] = useState('Last 6 Months');

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Amit Verma';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[100dvh] w-full bg-[#F0F7FF] dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* 1. Sidebar - Clean Enterprise Corporate White */}
      <aside
        className={`${
          isCompact ? 'w-52 p-3' : 'w-60 p-4'
        } shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 hidden md:flex flex-col justify-between shadow-xs`}
      >
        <div className="space-y-5">
          {/* Corporate FQ Logo */}
          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-600 to-blue-500 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/25">
              FQ
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              FridayQuest
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {/* Active Dashboard item - Solid vibrant blue pill */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold bg-[#2563EB] text-white shadow-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <Link
              href="/teams"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Employees</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Sessions</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-4 h-4 text-purple-600" />
              <span>Game Library</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-sky-600" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>Approvals</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-amber-600" />
              <span>Teams</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs">
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
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
        <header className="px-4 sm:px-6 py-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur sticky top-0 z-20">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-sky-600 to-blue-500 flex items-center justify-center font-black text-white text-[10px]">
              FQ
            </div>
          </div>

          {/* Light-blue tinted search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search employees, sessions..."
              className="w-full bg-[#F1F5F9] dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900"></span>
            </button>

            <ThemeToggle />

            {/* Avatar - Clean Production Role Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-blue-500/20">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</div>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium capitalize">
                  {user?.role || 'Org Admin'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-in slide-in-from-top duration-200">
            <nav className="space-y-1 text-xs">
              <button
                type="button"
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold bg-[#2563EB] text-white shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <Link
                href="/teams"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Users className="w-4 h-4 text-blue-600" />
                <span>Employees</span>
              </Link>
              <Link
                href="/sessions"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Sessions</span>
              </Link>
              <Link
                href="/games"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Gamepad2 className="w-4 h-4 text-purple-600" />
                <span>Game Library</span>
              </Link>
              <Link
                href="/roles"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <BarChart2 className="w-4 h-4 text-sky-600" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/roles"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Approvals</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-400"
              >
                <Users className="w-4 h-4 text-amber-600" />
                <span>Teams</span>
              </Link>
            </nav>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">{displayName} ({user?.role || 'Org Admin'})</span>
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
          {/* HEADER TITLE WITH TIME FILTER DROPDOWN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back, {displayName}!
              </h2>
              <p className="text-xs text-slate-500 mt-1">Here's what's happening in your organization.</p>
            </div>

            <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Quarter">This Quarter</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>

          {/* 4 CORPORATE KPI METRIC CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Employees */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">Total Employees</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">248</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Active Participants */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">Active Participants</div>
                <div className="text-2xl font-black text-[#2563EB] mt-1 font-mono">92%</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Sessions This Quarter */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">Sessions This Quarter</div>
                <div className="text-2xl font-black text-purple-600 mt-1 font-mono">12</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Avg. Satisfaction */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500">Avg. Satisfaction</div>
                <div className="text-2xl font-black text-amber-500 mt-1 font-mono">4.7</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>

          {/* MIDDLE ROW: PARTICIPATION TREND BAR CHART, DEPARTMENT DONUT, UPCOMING SESSIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Participation Trend Bar Chart (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                  Participation Trend
                </h4>
                <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 cursor-pointer">
                  <span>{chartFilter}</span>
                  <span>▾</span>
                </div>
              </div>

              {/* Vertical Bar Chart with 10 bars: Jan to Oct */}
              <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 dark:border-slate-800">
                {[
                  { m: 'Jan', h: '45%' },
                  { m: 'Feb', h: '55%' },
                  { m: 'Mar', h: '62%' },
                  { m: 'Apr', h: '70%' },
                  { m: 'May', h: '78%' },
                  { m: 'Jun', h: '85%' },
                  { m: 'Jul', h: '82%' },
                  { m: 'Aug', h: '90%' },
                  { m: 'Sep', h: '94%' },
                  { m: 'Oct', h: '98%' },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div
                      style={{ height: b.h }}
                      className="w-full max-w-[18px] bg-gradient-to-t from-blue-600 to-sky-400 rounded-t-md group-hover:brightness-110 transition-all shadow-xs"
                    ></div>
                    <span className="text-[9px] font-bold text-slate-400">{b.m}</span>
                  </div>
                ))}
              </div>

              {/* Y-axis indicators */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1">
                <span>0</span>
                <span>1K</span>
                <span>2K</span>
                <span>3K Target</span>
              </div>
            </div>

            {/* Department Participation Donut Chart (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Department Participation
              </h4>

              <div className="flex items-center justify-center gap-4 py-2">
                {/* Donut graphic */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" className="dark:stroke-slate-800" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="4.5" strokeDasharray="35 65" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeDasharray="20 80" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="18 82" strokeDashoffset="-55" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-73" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EC4899" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-88" />
                  </svg>
                  <div className="absolute text-center leading-none">
                    <div className="text-lg font-black text-slate-900 dark:text-white">92%</div>
                    <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Active</div>
                  </div>
                </div>

                {/* Color Legend */}
                <div className="space-y-1.5 text-xs font-medium flex-1">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#2563EB]"></span><span className="text-slate-600 dark:text-slate-300">Engineering</span><span className="font-bold ml-auto">35%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span><span className="text-slate-600 dark:text-slate-300">Marketing</span><span className="font-bold ml-auto">20%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span><span className="text-slate-600 dark:text-slate-300">Product</span><span className="font-bold ml-auto">18%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span><span className="text-slate-600 dark:text-slate-300">HR</span><span className="font-bold ml-auto">15%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EC4899]"></span><span className="text-slate-600 dark:text-slate-300">Finance</span><span className="font-bold ml-auto">12%</span></div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center font-medium">
                High company-wide engagement across all units
              </div>
            </div>

            {/* Upcoming Sessions (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Upcoming Sessions
              </h4>

              <div className="space-y-2.5">
                {[
                  { name: 'Fun Friday Kickoff', date: 'Oct 30, 2026', att: '85/120', action: 'Manage', actionStyle: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300' },
                  { name: 'Diwali Special', date: 'Nov 06, 2026', att: '0/100', action: 'Plan', actionStyle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
                  { name: 'Team Innovation', date: 'Nov 20, 2026', att: '0/100', action: 'Plan', actionStyle: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.date} • {s.att}</div>
                    </div>
                    <Link
                      href="/sessions"
                      className={`px-3 py-1 rounded-xl font-bold text-xs border transition-colors ${s.actionStyle}`}
                    >
                      {s.action}
                    </Link>
                  </div>
                ))}
              </div>

              <Link href="/sessions" className="text-center text-xs font-bold text-blue-600 hover:underline">
                View All Calendar →
              </Link>
            </div>
          </div>

          {/* BOTTOM ROW: RECENT ACTIVITY & TOP PERFORMING DEPARTMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Recent Activity (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Recent Activity
              </h4>

              <div className="space-y-2.5">
                {[
                  { icon: '🎉', title: 'Riya created a new session', time: '2 hours ago', bg: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300' },
                  { icon: '🎮', title: 'New game "Bug Hunt" added', time: '5 hours ago', bg: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300' },
                  { icon: '👥', title: 'Marketing team joined', time: '1 day ago', bg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300' },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${act.bg}`}>
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{act.title}</div>
                      <div className="text-[10px] text-slate-400">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Departments (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                  Top Performing Departments
                </h4>
                <Link href="/teams" className="text-xs font-bold text-blue-600 hover:underline">
                  View Details →
                </Link>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { name: 'Engineering', pct: 92, color: 'from-blue-600 to-indigo-600' },
                  { name: 'Product', pct: 88, color: 'from-blue-600 to-sky-500' },
                  { name: 'Marketing', pct: 76, color: 'from-purple-600 to-indigo-500' },
                  { name: 'HR', pct: 68, color: 'from-amber-500 to-orange-500' },
                  { name: 'Finance', pct: 62, color: 'from-emerald-500 to-teal-500' },
                ].map((dept, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{dept.name}</span>
                      <span className="font-black text-slate-900 dark:text-white">{dept.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${dept.pct}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${dept.color}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
