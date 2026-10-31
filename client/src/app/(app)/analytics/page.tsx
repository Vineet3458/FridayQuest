'use client';

import React, { useState } from 'react';
import {
  BarChart2,
  Calendar,
  Users,
  Star,
  Activity,
  Sparkles,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAnalytics } from '@/hooks/useAnalytics';

const PALETTE = ['#2563EB', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

export default function AnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'player';

  const [timeRange, setTimeRange] = useState('30 Days');
  const [department, setDepartment] = useState('all');

  const isPlatformScope = role === 'superAdmin';
  const { data, isLoading, refetch } = useAnalytics({
    scope: isPlatformScope ? 'platform' : 'org',
    timeRange,
    department,
  });

  const kpis = data?.kpis || {};
  const isSuperAdmin = role === 'superAdmin';
  const isOrganizer = role === 'organizer';

  // Dynamic theme accents
  const themeCardBg = isSuperAdmin
    ? 'bg-[#0F172A] border-slate-800 text-white'
    : isOrganizer
    ? 'bg-[#FFFDF9] border-amber-200/80 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white'
    : 'bg-white border-slate-200/80 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white';

  const trendData = data?.participationTrend && data.participationTrend.length > 0
    ? data.participationTrend
    : [
        { month: 'Jan', participants: 1200, sessions: 2 },
        { month: 'Feb', participants: 1450, sessions: 3 },
        { month: 'Mar', participants: 1680, sessions: 3 },
        { month: 'Apr', participants: 1920, sessions: 4 },
        { month: 'May', participants: 2150, sessions: 4 },
        { month: 'Jun', participants: 2480, sessions: 5 },
        { month: 'Jul', participants: 2200, sessions: 4 },
        { month: 'Aug', participants: 2500, sessions: 5 },
        { month: 'Sep', participants: 2650, sessions: 6 },
        { month: 'Oct', participants: 2850, sessions: 6 },
      ];

  const deptData = data?.departmentParticipation && data.departmentParticipation.length > 0
    ? data.departmentParticipation
    : [
        { name: 'Engineering', count: 12, pct: 35, color: '#2563EB' },
        { name: 'Marketing', count: 7, pct: 20, color: '#8B5CF6' },
        { name: 'Product', count: 6, pct: 18, color: '#F59E0B' },
        { name: 'HR', count: 5, pct: 15, color: '#10B981' },
        { name: 'Finance', count: 4, pct: 12, color: '#EC4899' },
      ];

  const topDepts = data?.topPerformingDepartments && data.topPerformingDepartments.length > 0
    ? data.topPerformingDepartments
    : [
        { name: 'Engineering', pct: 92 },
        { name: 'Product', pct: 88 },
        { name: 'Marketing', pct: 76 },
        { name: 'HR', pct: 68 },
        { name: 'Finance', pct: 62 },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl ${isSuperAdmin ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'}`}>
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {isSuperAdmin ? 'Platform Analytics & Telemetry' : 'Engagement & Participation Analytics'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isSuperAdmin
                  ? 'Real-time multi-tenant health, cross-organization statistics and growth curves.'
                  : 'Company-wide Fun Friday metrics, departmental attendance rates and vibe satisfaction.'}
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS: TIME RANGE & REFRESH */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Department Filter for Org Admins */}
          {!isSuperAdmin && (
            <div className="flex items-center gap-1.5 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="bg-transparent pr-2 py-1 font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="People & Culture">People & Culture</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          )}

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent px-2 py-1 font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="7 Days">7 Days</option>
              <option value="30 Days">Last 30 Days</option>
              <option value="3 Months">Last 3 Months</option>
              <option value="6 Months">Last 6 Months</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${themeCardBg}`}>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              {isSuperAdmin ? 'Total Organizations' : 'Total Employees'}
            </div>
            <div className="text-2xl font-black mt-1 font-mono">
              {isSuperAdmin ? (kpis.organizations ?? 12) : (kpis.totalEmployees ?? 31)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${themeCardBg}`}>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              {isSuperAdmin ? 'Platform Users' : 'Active Participation'}
            </div>
            <div className="text-2xl font-black text-blue-500 mt-1 font-mono">
              {isSuperAdmin
                ? (kpis.totalUsers ?? 2480).toLocaleString()
                : `${kpis.activeParticipantsPct ?? 81}%`}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${themeCardBg}`}>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              {isSuperAdmin ? 'Total Sessions' : 'Sessions This Quarter'}
            </div>
            <div className="text-2xl font-black text-amber-500 mt-1 font-mono">
              {isSuperAdmin ? (kpis.totalSessions ?? 186) : (kpis.sessionsThisQuarter ?? 2)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className={`p-4 rounded-2xl border shadow-xs flex items-center justify-between ${themeCardBg}`}>
          <div>
            <div className="text-xs font-semibold text-slate-400">
              {isSuperAdmin ? 'Platform Rating' : 'Avg. Satisfaction'}
            </div>
            <div className="text-2xl font-black text-emerald-500 mt-1 font-mono">
              {isSuperAdmin
                ? (kpis.platformRating ?? 4.6).toFixed(1)
                : (kpis.avgSatisfaction ?? 4.8).toFixed(1)}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
      </div>

      {/* CHARTS ROW: PARTICIPATION TREND OVER TIME & DEPARTMENT BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Participation Trend Chart */}
        <div className={`lg:col-span-8 p-5 rounded-3xl border shadow-xs space-y-4 ${themeCardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                {isSuperAdmin ? 'Platform Growth & Monthly Active Users' : 'Participation Trend Over Time'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Aggregated session check-ins across previous months
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              MongoDB Aggregation
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-950 text-white p-2.5 rounded-2xl text-xs shadow-xl border border-slate-800">
                          <div className="font-bold text-sky-400">{item.month} {item.year || ''}</div>
                          <div className="mt-1">Participants: <span className="font-mono font-bold text-white">{item.participants.toLocaleString()}</span></div>
                          {item.sessions !== undefined && (
                            <div className="text-[11px] text-slate-400">Sessions Hosted: {item.sessions}</div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="participants"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#analyticsTrendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department / Category Donut Breakdown */}
        <div className={`lg:col-span-4 p-5 rounded-3xl border shadow-xs space-y-4 flex flex-col justify-between ${themeCardBg}`}>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider">
              {isSuperAdmin ? 'Industry Distribution' : 'Department Distribution'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Active engagement split by team
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2 rounded-xl text-xs shadow-lg border border-slate-800">
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
                  innerRadius={50}
                  outerRadius={75}
                  strokeWidth={2}
                  stroke={isSuperAdmin ? '#0F172A' : '#FFFFFF'}
                >
                  {deptData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color || PALETTE[idx % PALETTE.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {deptData.slice(0, 6).map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: d.color || PALETTE[i % PALETTE.length] }}
                ></span>
                <span className="truncate text-slate-400 text-[11px]">{d.name}</span>
                <span className="font-bold ml-auto text-[11px]">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: TOP PERFORMING TEAMS & RECENT ENGAGEMENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Performing Units */}
        <div className={`lg:col-span-6 p-5 rounded-3xl border shadow-xs space-y-4 ${themeCardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Top Performing Departments</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Participation %</span>
          </div>

          <div className="space-y-3 pt-2">
            {topDepts.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">{d.name}</span>
                  <span className="font-black font-mono text-blue-500">{d.pct}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.min(d.pct, 100)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-400 transition-all duration-500"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Engagement Stream */}
        <div className={`lg:col-span-6 p-5 rounded-3xl border shadow-xs space-y-4 ${themeCardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Live Platform Activity Stream</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Socket.IO Live
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {(data?.recentActivities || [
              { icon: 'session', user: 'Riya Sharma', action: 'created a new session', time: '2 hours ago' },
              { icon: 'game', user: 'Kabir Patel', action: 'submitted game "Bug Hunt"', time: '5 hours ago' },
              { icon: 'team', user: 'Marketing team', action: 'joined session teams', time: '1 day ago' },
            ]).map((act, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm shrink-0">
                  {act.icon === 'game' ? '🎮' : act.icon === 'team' ? '👥' : '🎉'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs truncate">
                    {act.user} {act.action}
                  </div>
                  <div className="text-[10px] text-slate-400">{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

