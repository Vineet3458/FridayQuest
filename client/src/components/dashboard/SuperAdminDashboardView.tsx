'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Users,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  User,
  BarChart2,
  Building2,
  FileText,
  Server,
  Database,
  Cpu,
  HardDrive,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface SuperAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function SuperAdminDashboardView({ user, isCompact = false }: SuperAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const displayName = user?.name || 'Kirxa';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[100dvh] w-full bg-[#0c101c] text-white overflow-hidden flex flex-col md:flex-row transition-all">
      {/* Mini Sidebar */}
      <aside
        className={`${
          isCompact ? 'w-full md:w-48 p-3' : 'w-full md:w-56 p-4'
        } shrink-0 border-r border-slate-800/80 bg-[#090d16] flex flex-col justify-between`}
      >
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-[11px] tracking-wider shadow-md shadow-blue-500/25">
              FQ
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">
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
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Organizations</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Users</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Games</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>System Settings</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </Link>
          </nav>
        </div>

        {/* Mini Sidebar Footer */}
        <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
          <Link
            href="/roles"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium text-slate-500 hover:text-white transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
          <Link
            href="/roles"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium text-slate-500 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0b0f19]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search organizations, users..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white relative"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1"></span>
            </button>

            <ThemeToggle />

            {/* Avatar */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-[10px] flex items-center justify-center">
                {userInitials}
              </div>
              <div className="text-right leading-none">
                <div className="text-xs font-bold text-white">{displayName}</div>
                <div className="text-[9px] text-blue-400 capitalize font-medium">{user?.role || 'Super Admin'}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Stage */}
        <div className={`${isCompact ? 'p-3.5 space-y-4' : 'p-5 sm:p-6 space-y-5'}`}>
          {/* Header Title with Time Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Platform Overview ⚡
              </h2>
              <p className="text-[11px] text-slate-400">Manage organizations, monitor usage and grow FridayQuest.</p>
            </div>
            <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold self-start sm:self-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent px-2 py-0.5 focus:outline-none cursor-pointer text-slate-300"
              >
                <option value="Last 30 Days" className="bg-slate-900">Last 30 Days</option>
                <option value="All Time" className="bg-slate-900">All Time</option>
              </select>
            </div>
          </div>

          {/* 4 Global KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-400">Organizations</div>
              <div className="text-xl font-black text-white mt-0.5">12</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-400">Total Users</div>
              <div className="text-xl font-black text-blue-400 mt-0.5">2,480</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-400">Total Sessions</div>
              <div className="text-xl font-black text-white mt-0.5">186</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 shadow-xs">
              <div className="text-[10px] font-semibold text-slate-400">Platform Rating</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">4.6</div>
            </div>
          </div>

          {/* Middle Row: User Growth, Organization Distribution, Recent Organizations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* User Growth Line Chart */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white">User Growth</h4>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  +12%
                </span>
              </div>
              <div className="h-32 w-full pt-1">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="growthGrad3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M 0,85 Q 75,65 150,45 T 300,15 L 300,100 L 0,100 Z" fill="url(#growthGrad3)" />
                  <path d="M 0,85 Q 75,65 150,45 T 300,15" fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                  <circle cx="300" cy="15" r="4" fill="#3b82f6" className="animate-pulse" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-semibold pt-0.5">
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>

            {/* Organization Distribution Donut */}
            <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <h4 className="text-xs font-black uppercase text-white">Organization Distribution</h4>
              <div className="flex items-center justify-center gap-3 py-1">
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="40 60" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-40" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-65" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="12 88" strokeDashoffset="-80" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-92" />
                  </svg>
                  <div className="absolute text-center leading-none">
                    <div className="text-sm font-black text-white">2,480</div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Users</div>
                  </div>
                </div>
                <div className="space-y-1 text-[10px] text-slate-300">
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><span>Tech</span><span className="font-bold ml-auto text-white">40%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span><span>Education</span><span className="font-bold ml-auto text-white">25%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Healthcare</span><span className="font-bold ml-auto text-white">15%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span>Finance</span><span className="font-bold ml-auto text-white">12%</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span><span>Others</span><span className="font-bold ml-auto text-white">8%</span></div>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 text-center">12 Workspaces active across industries</div>
            </div>

            {/* Recent Organizations */}
            <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white">Recent Organizations</h4>
                <Link href="/teams" className="text-xs font-semibold text-blue-400 hover:underline">
                  View All →
                </Link>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Kirxa Labs', users: '248 users', status: 'Active' },
                  { name: 'TechCorp Solutions', users: '180 users', status: 'Active' },
                  { name: 'EduNext', users: '95 users', status: 'Active' },
                  { name: 'HealthPlus', users: '95 users', status: 'Active' },
                ].map((org, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-[11px]">{org.name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{org.users}</div>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900/60">
                      {org.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-[9px] text-slate-500 text-center">
                Multi-tenant tenancy active
              </div>
            </div>
          </div>

          {/* Bottom Row: Platform Activity Table & System Infrastructure Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Platform Activity Table */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white">Platform Activity</h4>
                <span className="text-[11px] font-semibold text-slate-500">Live feed</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[9px] text-slate-400 uppercase tracking-wider">
                      <th className="pb-1.5 font-bold">Organization</th>
                      <th className="pb-1.5 font-bold">Action</th>
                      <th className="pb-1.5 font-bold">User</th>
                      <th className="pb-1.5 font-bold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { org: 'TechCorp Solutions', action: 'New user registered', user: 'priya@techcorp.com', time: '2 hours ago' },
                      { org: 'Kirxa Labs', action: 'Session created', user: 'admin@kirxa.com', time: '4 hours ago' },
                      { org: 'EduNext', action: 'Game approved', user: 'admin@edunext.com', time: '6 hours ago' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2 font-bold text-white text-[11px]">{row.org}</td>
                        <td className="py-2 text-slate-300 text-[11px]">{row.action}</td>
                        <td className="py-2 font-mono text-[10px] text-slate-400">{row.user}</td>
                        <td className="py-2 text-slate-500 text-right text-[11px]">{row.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Infrastructure Health */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-white">System Health</h4>
                <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                  All Systems 100%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {[
                  { name: 'API Server', status: 'Healthy', icon: Server },
                  { name: 'Database', status: 'Healthy', icon: Database },
                  { name: 'Socket Server', status: 'Healthy', icon: Cpu },
                  { name: 'Storage', status: 'Healthy', icon: HardDrive },
                ].map((svc, idx) => {
                  const Icon = svc.icon;
                  return (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-white text-xs">{svc.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                        ● {svc.status}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="text-[9px] text-slate-500 text-center">
                Zero downtime recorded in the last 30 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
