'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Gamepad2,
  Users,
  BarChart2,
  CheckSquare,
  ShieldCheck,
  Star,
} from 'lucide-react';

interface OrgAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function OrgAdminDashboardView({
  user,
}: OrgAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [chartFilter] = useState('Last 6 Months');

  const displayName = user?.name || 'Amit Verma';

  return (
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
  );
}
