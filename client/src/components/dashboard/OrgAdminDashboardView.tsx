'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Gamepad2,
  Users,
  Search,
  Bell,
  Settings,
  Tv,
  LayoutDashboard,
  User,
  BarChart2,
  CheckSquare,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface OrgAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function OrgAdminDashboardView({ user, isCompact = false }: OrgAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const displayName = user?.name || 'Amit Verma';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden flex flex-col md:flex-row transition-all">
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
              href="/teams"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Employees</span>
            </Link>
            <Link
              href="/sessions"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Sessions</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Game Library</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Approvals</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teams</span>
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
              placeholder="Search employees, sessions..."
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
              href="/session/KIRXA-DEMO/screen"
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
                <div className="text-[9px] text-blue-500 capitalize font-medium">{user?.role || 'Org Admin'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stage */}
        <div className={`${isCompact ? 'p-3.5 space-y-4' : 'p-5 sm:p-6 space-y-5'}`}>
          {/* Header Title with Time Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Welcome back, {displayName}! 👋
              </h2>
              <p className="text-[11px] text-slate-500">Here's what's happening in your organization.</p>
            </div>
            <div className="p-1 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold self-start sm:self-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent px-2 py-0.5 focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="This Quarter">This Quarter</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-500">Total Employees</div>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">248</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-500">Active Participants</div>
              <div className="text-xl font-black text-blue-600 mt-0.5">92%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-500">Sessions This Quarter</div>
              <div className="text-xl font-black text-purple-600 mt-0.5">12</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-500">Avg. Satisfaction</div>
              <div className="text-xl font-black text-amber-500 mt-0.5">4.7</div>
            </div>
          </div>

          {/* Middle Row: Participation Trend, Department Donut, Upcoming Sessions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Participation Trend Bar Chart */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Participation Trend
                </h4>
                <span className="text-[9px] text-slate-400">Last 6 Months ▾</span>
              </div>
              <div className="h-36 flex items-end justify-between gap-1.5 pt-3 px-1 border-b border-slate-100 dark:border-slate-800">
                {[
                  { m: 'Jan', h: '45%' },
                  { m: 'Feb', h: '55%' },
                  { m: 'Mar', h: '62%' },
                  { m: 'Apr', h: '72%' },
                  { m: 'May', h: '80%' },
                  { m: 'Jun', h: '88%' },
                  { m: 'Jul', h: '84%' },
                  { m: 'Aug', h: '90%' },
                  { m: 'Sep', h: '94%' },
                  { m: 'Oct', h: '98%' },
                ].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div
                      style={{ height: b.h }}
                      className="w-full max-w-[16px] bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm group-hover:brightness-110 transition-all"
                    ></div>
                    <span className="text-[8px] font-bold text-slate-400">{b.m}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                <span>1K participants</span>
                <span>2K</span>
                <span>3K target</span>
              </div>
            </div>

            {/* Department Participation Donut */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Department Participation
              </h4>
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-35" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-55" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-73" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-88" />
                  </svg>
                  <div className="absolute text-center leading-none">
                    <div className="text-sm font-black text-slate-900 dark:text-white">92%</div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Active</div>
                  </div>
                </div>
                <div className="space-y-1 text-[10px] font-medium">
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span><span className="text-slate-600 dark:text-slate-300">Engineering</span><span className="font-bold ml-auto">35%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span><span className="text-slate-600 dark:text-slate-300">Marketing</span><span className="font-bold ml-auto">20%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="text-slate-600 dark:text-slate-300">Product</span><span className="font-bold ml-auto">18%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span className="text-slate-600 dark:text-slate-300">HR</span><span className="font-bold ml-auto">15%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span><span className="text-slate-600 dark:text-slate-300">Finance</span><span className="font-bold ml-auto">12%</span></div>
                </div>
              </div>
              <div className="text-[9px] text-slate-400 text-center">Balanced cross-department engagement</div>
            </div>

            {/* Upcoming Sessions */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Upcoming Sessions
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Fun Friday Kickoff', date: 'Oct 30, 2026', att: '85/120', act: 'Manage', actColor: 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-400' },
                  { name: 'Diwali Special', date: 'Nov 06, 2026', att: '0/100', act: 'Plan', actColor: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300' },
                  { name: 'Team Innovation', date: 'Nov 20, 2026', att: '0/100', act: 'Plan', actColor: 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300' },
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-between border border-slate-100 dark:border-slate-800/60">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-[11px]">{s.name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{s.date} • {s.att}</div>
                    </div>
                    <Link href="/sessions" className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] transition-colors ${s.actColor}`}>
                      {s.act}
                    </Link>
                  </div>
                ))}
              </div>
              <Link href="/sessions" className="text-center text-[11px] font-semibold text-blue-600 hover:underline">
                View All Calendar →
              </Link>
            </div>
          </div>

          {/* Bottom Row: Recent Activity & Top Performing Departments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Recent Activity */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                Recent Activity
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { icon: '🎉', title: 'Riya created a new session', time: '2 hours ago', color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300' },
                  { icon: '🎮', title: 'New game "Bug Hunt" added', time: '5 hours ago', color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300' },
                  { icon: '👥', title: 'Marketing team joined', time: '1 day ago', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300' },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${act.color}`}>
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white text-[11px]">{act.title}</div>
                      <div className="text-[9px] text-slate-400">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Departments Progress Bars */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white">
                  Top Performing Departments
                </h4>
                <Link href="/teams" className="text-xs font-semibold text-blue-600 hover:underline">
                  View Details →
                </Link>
              </div>
              <div className="space-y-2 pt-0.5">
                {[
                  { name: 'Engineering', pct: 92, color: 'from-blue-600 to-indigo-600' },
                  { name: 'Product', pct: 88, color: 'from-indigo-600 to-purple-600' },
                  { name: 'Marketing', pct: 76, color: 'from-purple-600 to-pink-600' },
                  { name: 'HR', pct: 68, color: 'from-amber-500 to-orange-500' },
                  { name: 'Finance', pct: 62, color: 'from-emerald-500 to-teal-500' },
                ].map((dept, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{dept.name}</span>
                      <span className="font-bold text-slate-900 dark:text-white text-[11px]">{dept.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
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

