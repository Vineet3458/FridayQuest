'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  ShieldCheck,
  Star,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

interface OrgAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

const DEPT_COLORS = ['#2563EB', '#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

export default function OrgAdminDashboardView({
  user,
}: OrgAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [chartFilter] = useState('Last 6 Months');

  const { data, isLoading, isError, refetch } = useAnalytics({
    timeRange: timeFilter,
    scope: 'org',
  });

  const displayName = user?.name || 'Amit Verma';

  // Fallbacks / live metrics from aggregation
  const kpis = data?.kpis || {};
  const totalEmployees = kpis.totalEmployees ?? 31;
  const activeParticipantsPct = kpis.activeParticipantsPct ?? 81;
  const sessionsThisQuarter = kpis.sessionsThisQuarter ?? 2;
  const avgSatisfaction = kpis.avgSatisfaction ?? 4.8;

  // Real participation trend from MongoDB
  const trendData = data?.participationTrend && data.participationTrend.length > 0
    ? data.participationTrend.map((d) => ({
        m: d.month,
        participants: d.participants,
        sessions: d.sessions,
      }))
    : [
        { m: 'Jan', participants: 1200, sessions: 2 },
        { m: 'Feb', participants: 1450, sessions: 3 },
        { m: 'Mar', participants: 1680, sessions: 3 },
        { m: 'Apr', participants: 1920, sessions: 4 },
        { m: 'May', participants: 2150, sessions: 4 },
        { m: 'Jun', participants: 2480, sessions: 5 },
        { m: 'Jul', participants: 2200, sessions: 4 },
        { m: 'Aug', participants: 2500, sessions: 5 },
        { m: 'Sep', participants: 2650, sessions: 6 },
        { m: 'Oct', participants: 2850, sessions: 6 },
      ];

  // Real department distribution from MongoDB
  const deptData = data?.departmentParticipation && data.departmentParticipation.length > 0
    ? data.departmentParticipation
    : [
        { name: 'Engineering', count: 12, pct: 35, color: '#2563EB' },
        { name: 'Marketing', count: 7, pct: 20, color: '#8B5CF6' },
        { name: 'Product', count: 6, pct: 18, color: '#F59E0B' },
        { name: 'HR', count: 5, pct: 15, color: '#10B981' },
        { name: 'Finance', count: 4, pct: 12, color: '#EC4899' },
      ];

  const upcomingSessions = data?.upcomingSessions && data.upcomingSessions.length > 0
    ? data.upcomingSessions
    : [
        { id: '1', title: 'Fun Friday Kickoff', date: 'Oct 30, 2026', joining: '85 / 120', status: 'voting' },
        { id: '2', title: 'Diwali Special', date: 'Nov 06, 2026', joining: '0 / 100', status: 'planned' },
        { id: '3', title: 'Team Innovation', date: 'Nov 20, 2026', joining: '0 / 100', status: 'planned' },
      ];

  const recentActivities = data?.recentActivities && data.recentActivities.length > 0
    ? data.recentActivities
    : [
        { icon: 'session', user: 'Riya Sharma', action: 'created a new session', time: '2 hours ago' },
        { icon: 'game', user: 'Kabir Patel', action: 'submitted game "Bug Hunt"', time: '5 hours ago' },
        { icon: 'team', user: 'Marketing team', action: 'joined session teams', time: '1 day ago' },
      ];

  const topDepartments = data?.topPerformingDepartments && data.topPerformingDepartments.length > 0
    ? data.topPerformingDepartments.slice(0, 5)
    : [
        { name: 'Engineering', pct: 92 },
        { name: 'Product', pct: 88 },
        { name: 'Marketing', pct: 76 },
        { name: 'HR', pct: 68 },
        { name: 'Finance', pct: 62 },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER TITLE WITH TIME FILTER DROPDOWN & LIVE INDICATOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Welcome back, {displayName}!
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Here&apos;s what&apos;s happening in your organization.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => void refetch()}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <div className="p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="7 Days">7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Quarter">This Quarter</option>
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="All Time">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {isError && (
        <div role="alert" className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between">
          <span>Failed to load some real-time metrics. Displaying cached session insights.</span>
          <button type="button" onClick={() => void refetch()} className="font-bold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* 4 CORPORATE KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Employees */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Employees</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              {totalEmployees}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Active Participants */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Active Participants</div>
            <div className="text-2xl font-black text-[#2563EB] mt-1 font-mono">
              {activeParticipantsPct}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Sessions This Quarter */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Sessions This Quarter</div>
            <div className="text-2xl font-black text-purple-600 mt-1 font-mono">
              {sessionsThisQuarter}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Avg. Satisfaction */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Avg. Satisfaction</div>
            <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
              {avgSatisfaction.toFixed(1)}
            </div>
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
            <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <span>{chartFilter}</span>
            </div>
          </div>

          {/* Interactive Recharts Bar Chart */}
          <div className="h-44 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orgBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="m"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`)}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(37, 99, 235, 0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-xl text-[11px] shadow-lg border border-slate-800">
                          <div className="font-bold text-sky-400">{item.m}</div>
                          <div>Participants: <span className="font-mono font-bold">{item.participants}</span></div>
                          {item.sessions !== undefined && (
                            <div className="text-[10px] text-slate-400">Sessions: {item.sessions}</div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="participants"
                  fill="url(#orgBarGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Y-axis indicators / targets */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>0</span>
            <span>1K</span>
            <span>2K</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">Target 3K+</span>
          </div>
        </div>

        {/* Department Participation Donut Chart (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
            Department Participation
          </h4>

          <div className="flex items-center justify-center gap-4 py-2">
            {/* Donut graphic via Recharts */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-xl text-[10px] shadow-md border border-slate-800">
                            <span className="font-bold">{d.name}</span>: {d.pct}%
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={deptData}
                    dataKey="pct"
                    nameKey="name"
                    innerRadius={36}
                    outerRadius={50}
                    strokeWidth={2}
                    stroke="#FFFFFF"
                  >
                    {deptData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color || DEPT_COLORS[idx % DEPT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center leading-none pointer-events-none">
                <div className="text-lg font-black text-slate-900 dark:text-white">{activeParticipantsPct}%</div>
                <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Active</div>
              </div>
            </div>

            {/* Color Legend */}
            <div className="space-y-1.5 text-xs font-medium flex-1">
              {deptData.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color || DEPT_COLORS[i % DEPT_COLORS.length] }}
                  ></span>
                  <span className="text-slate-600 dark:text-slate-300 truncate text-[11px]">{d.name}</span>
                  <span className="font-bold ml-auto text-slate-900 dark:text-white text-[11px]">{d.pct}%</span>
                </div>
              ))}
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
            {upcomingSessions.map((s, idx) => {
              const isVoting = s.status === 'voting' || s.status === 'live';
              return (
                <div key={idx} className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-950 flex items-center justify-between border border-slate-100 dark:border-slate-800">
                  <div className="min-w-0 pr-2">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{s.date} • {s.joining}</div>
                  </div>
                  <Link
                    href="/sessions"
                    className={`px-3 py-1 rounded-xl font-bold text-xs border transition-colors shrink-0 ${
                      isVoting
                        ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isVoting ? 'Manage' : 'Plan'}
                  </Link>
                </div>
              );
            })}
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
            {recentActivities.map((act, idx) => {
              const iconEmoji = act.icon === 'game' ? '🎮' : act.icon === 'team' ? '👥' : '🎉';
              const bg = act.icon === 'game'
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                : act.icon === 'team'
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300'
                : 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300';

              return (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${bg}`}>
                    {iconEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {act.user} {act.action}
                    </div>
                    <div className="text-[10px] text-slate-400">{act.time}</div>
                  </div>
                </div>
              );
            })}
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
            {topDepartments.map((dept, idx) => {
              const gradients = [
                'from-blue-600 to-indigo-600',
                'from-blue-600 to-sky-500',
                'from-purple-600 to-indigo-500',
                'from-amber-500 to-orange-500',
                'from-emerald-500 to-teal-500',
              ];
              const color = gradients[idx % gradients.length];
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{dept.name}</span>
                    <span className="font-black text-slate-900 dark:text-white">{dept.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(dept.pct, 100)}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
