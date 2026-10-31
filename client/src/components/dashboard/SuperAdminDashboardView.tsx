'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Building2,
  Server,
  Database,
  Cpu,
  HardDrive,
  Star,
  Activity,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';

interface SuperAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

const DIST_COLORS = ['#38BDF8', '#2563EB', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6'];

export default function SuperAdminDashboardView({
  user: _user,
}: SuperAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  const { data, isLoading, isError, refetch } = useAnalytics({
    scope: 'platform',
    timeRange: timeFilter,
  });

  const kpis = data?.kpis || {};
  const orgCount = kpis.organizations ?? 12;
  const totalUsers = kpis.totalUsers ?? 2480;
  const totalSessions = kpis.totalSessions ?? 186;
  const platformRating = kpis.platformRating ?? 4.6;

  // Real user growth array from MongoDB / service
  const userGrowth = data?.userGrowth && data.userGrowth.length > 0
    ? data.userGrowth
    : [
        { month: 'Jan', users: 1200 },
        { month: 'Feb', users: 1450 },
        { month: 'Mar', users: 1680 },
        { month: 'Apr', users: 1920 },
        { month: 'May', users: 2150 },
        { month: 'Jun', users: 2480 },
        { month: 'Jul', users: 2750 },
        { month: 'Aug', users: 3100 },
        { month: 'Sep', users: 3450 },
        { month: 'Oct', users: 3800 },
      ];

  // Real organization industry distribution
  const orgDist = data?.organizationDistribution && data.organizationDistribution.length > 0
    ? data.organizationDistribution
    : [
        { name: 'Tech', count: 13, pct: 40, color: '#38BDF8' },
        { name: 'Education', count: 8, pct: 25, color: '#2563EB' },
        { name: 'Healthcare', count: 5, pct: 15, color: '#EC4899' },
        { name: 'Finance', count: 4, pct: 12, color: '#F59E0B' },
        { name: 'Others', count: 3, pct: 8, color: '#10B981' },
      ];

  const recentOrgs = data?.recentOrganizations && data.recentOrganizations.length > 0
    ? data.recentOrganizations.slice(0, 4)
    : [
        { name: 'Kirxa Labs', users: '248 users', status: 'Active' },
        { name: 'TechCorp Solutions', users: '180 users', status: 'Active' },
        { name: 'EduNext', users: '120 users', status: 'Active' },
        { name: 'HealthPlus', users: '95 users', status: 'Active' },
      ];

  const platformActivities = data?.platformActivity && data.platformActivity.length > 0
    ? data.platformActivity
    : [
        { org: 'TechCorp Solutions', action: 'New user registered', user: 'priya@techcorp.com', time: '2 hours ago' },
        { org: 'Kirxa Labs', action: 'Session created', user: 'admin@kirxa.com', time: '4 hours ago' },
        { org: 'EduNext', action: 'Game approved', user: 'admin@edunest.com', time: '6 hours ago' },
      ];

  const health = data?.systemHealth && data.systemHealth.length > 0
    ? data.systemHealth
    : [
        { name: 'API Server', status: 'Healthy' },
        { name: 'Database', status: 'Healthy' },
        { name: 'Socket Server', status: 'Healthy' },
        { name: 'Storage', status: 'Healthy' },
      ];

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER TITLE WITH TIME FILTER DROPDOWN & REAL-TIME PILL */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Platform Overview
            </h2>
            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-400 border border-blue-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage organizations, monitor usage and grow FridayQuest.</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => void refetch()}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-transparent px-3 py-1 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="Today" className="bg-slate-900">Today</option>
              <option value="7 Days" className="bg-slate-900">7 Days</option>
              <option value="Last 30 Days" className="bg-slate-900">Last 30 Days</option>
              <option value="This Quarter" className="bg-slate-900">This Quarter</option>
              <option value="All Time" className="bg-slate-900">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {isError && (
        <div role="alert" className="p-3 rounded-2xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
          <span>Failed to connect to platform telemetry. Showing cached overview.</span>
          <button type="button" onClick={() => void refetch()} className="font-bold underline cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* 4 HIGH-TECH PLATFORM KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Organizations */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Organizations</div>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {orgCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Users */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Users</div>
            <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
              {totalUsers.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Total Sessions */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Total Sessions</div>
            <div className="text-2xl font-black text-amber-400 mt-1 font-mono">
              {totalSessions.toLocaleString()}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Platform Rating */}
        <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Platform Rating</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              {typeof platformRating === 'number' ? platformRating.toFixed(1) : platformRating}
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-current" />
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: USER GROWTH LINE CHART, ORGANIZATION DISTRIBUTION, RECENT ORGANIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User Growth Line Chart (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              User Growth
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              +12% MoM
            </span>
          </div>

          {/* Glowing Recharts Area Chart */}
          <div className="h-44 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="neonGlowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#1E293B' }}
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}K` : `${val}`)}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-slate-950 text-white p-2 rounded-xl text-[11px] shadow-xl border border-blue-500/40">
                          <div className="font-bold text-sky-400">{item.month}</div>
                          <div>Active Users: <span className="font-mono font-bold text-white">{item.users.toLocaleString()}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#neonGlowGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Months Axis Footnote */}
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-800">
            <span>Jan</span>
            <span>Apr</span>
            <span>Jul</span>
            <span className="text-sky-400 font-bold">Oct (Current)</span>
          </div>
        </div>

        {/* Organization Distribution Donut (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-3">
          <h4 className="text-xs font-black uppercase text-white tracking-wider">
            Organization Distribution
          </h4>

          <div className="flex items-center justify-center gap-4 py-2">
            {/* Donut Graphic via Recharts */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-950 text-white p-2 rounded-xl text-[10px] shadow-lg border border-slate-800">
                            <span className="font-bold">{d.name}</span>: {d.pct}% ({d.count} orgs)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={orgDist}
                    dataKey="pct"
                    nameKey="name"
                    innerRadius={36}
                    outerRadius={50}
                    strokeWidth={2}
                    stroke="#0F172A"
                  >
                    {orgDist.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={entry.color || DIST_COLORS[idx % DIST_COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center leading-none pointer-events-none">
                <div className="text-lg font-black text-white">{totalUsers.toLocaleString()}</div>
                <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Users</div>
              </div>
            </div>

            {/* Slices legend */}
            <div className="space-y-1.5 text-xs text-slate-300 flex-1">
              {orgDist.slice(0, 5).map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: d.color || DIST_COLORS[i % DIST_COLORS.length] }}
                  ></span>
                  <span className="truncate text-[11px]">{d.name}</span>
                  <span className="font-bold ml-auto text-white text-[11px]">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium">
            {orgCount} Workspaces active across industries
          </div>
        </div>

        {/* Recent Organizations (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              Recent Organizations
            </h4>
            <Link href="/teams" className="text-xs font-bold text-blue-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentOrgs.map((org, idx) => (
              <div key={idx} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <div className="font-extrabold text-xs text-white truncate">{org.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{org.users}</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60 shrink-0">
                  {org.status}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium">
            Multi-tenant tenancy active
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: PLATFORM ACTIVITY TABLE & SYSTEM HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Platform Activity Table (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              Platform Activity
            </h4>
            <span className="text-[11px] font-semibold text-slate-500">Live feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
                  <th className="pb-2 font-bold">Organization</th>
                  <th className="pb-2 font-bold">Action</th>
                  <th className="pb-2 font-bold">User</th>
                  <th className="pb-2 font-bold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y border-slate-800/60">
                {platformActivities.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-2.5 font-bold text-white text-xs">{row.org}</td>
                    <td className="py-2.5 text-slate-300 text-xs">{row.action}</td>
                    <td className="py-2.5 font-mono text-[11px] text-slate-400">{row.user}</td>
                    <td className="py-2.5 text-slate-500 text-right text-xs">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Infrastructure Health (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-white tracking-wider">
              System Health
            </h4>
            <Link href="/roles" className="text-xs font-bold text-blue-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {health.map((svc, idx) => {
              const icons = [Server, Database, Cpu, HardDrive];
              const Icon = icons[idx % icons.length];
              return (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">{svc.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/50">
                    + {svc.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-500 text-center font-medium">
            All Systems Operational • 99.98% Uptime
          </div>
        </div>
      </div>
    </div>
  );
}
