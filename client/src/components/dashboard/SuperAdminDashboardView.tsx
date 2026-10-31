'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Users,
  BarChart2,
  Building2,
  FileText,
  Server,
  Database,
  Cpu,
  HardDrive,
  Star,
  Activity,
} from 'lucide-react';

interface SuperAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function SuperAdminDashboardView({
  user,
}: SuperAdminDashboardViewProps) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER TITLE WITH TIME FILTER DROPDOWN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Platform Overview
              </h2>
              <p className="text-xs text-slate-400 mt-1">Manage organizations, monitor usage and grow FridayQuest.</p>
            </div>

            <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 shadow-xs self-start sm:self-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="bg-transparent px-3 py-1 text-xs font-bold text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="Last 30 Days" className="bg-slate-900">Last 30 Days</option>
                <option value="This Quarter" className="bg-slate-900">This Quarter</option>
                <option value="All Time" className="bg-slate-900">All Time</option>
              </select>
            </div>
          </div>

          {/* 4 HIGH-TECH PLATFORM KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Organizations */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">Organizations</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">12</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Total Sessions / Users */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">Total Users</div>
                <div className="text-2xl font-black text-blue-400 mt-1 font-mono">2,480</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Total Sessions */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">Total Sessions</div>
                <div className="text-2xl font-black text-amber-400 mt-1 font-mono">186</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-5 h-5" />
              </div>
            </div>

            {/* Card 4: Platform Rating */}
            <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800/80 shadow-md flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-400">Platform Rating</div>
                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">4.6</div>
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
                  +12%
                </span>
              </div>

              {/* Glowing High-Tech Area Chart */}
              <div className="h-40 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="glowAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Shaded Area */}
                  <path
                    d="M 0,100 Q 80,80 160,50 T 320,15 L 320,120 L 0,120 Z"
                    fill="url(#glowAreaGradient)"
                  />
                  {/* Line Curve */}
                  <path
                    d="M 0,100 Q 80,80 160,50 T 320,15"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="3"
                  />
                  {/* Interactive glowing dots */}
                  <circle cx="0" cy="100" r="3.5" fill="#38BDF8" />
                  <circle cx="80" cy="85" r="3.5" fill="#38BDF8" />
                  <circle cx="160" cy="50" r="4" fill="#60A5FA" />
                  <circle cx="240" cy="30" r="4" fill="#60A5FA" />
                  <circle cx="320" cy="15" r="5" fill="#38BDF8" className="animate-pulse" />
                </svg>
              </div>

              {/* Months Axis */}
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-800">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
              </div>
            </div>

            {/* Organization Distribution Donut (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-[#0F172A] border border-slate-800/80 rounded-3xl p-5 shadow-md flex flex-col justify-between space-y-3">
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Organization Distribution
              </h4>

              <div className="flex items-center justify-center gap-4 py-2">
                {/* Donut Graphic */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1E293B" strokeWidth="4.5" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="40 60" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8B5CF6" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-40" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="15 85" strokeDashoffset="-65" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-80" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#64748B" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="-92" />
                  </svg>
                  <div className="absolute text-center leading-none">
                    <div className="text-lg font-black text-white">2,480</div>
                    <div className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Users</div>
                  </div>
                </div>

                {/* Slices legend */}
                <div className="space-y-1.5 text-xs text-slate-300 flex-1">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#3B82F6]"></span><span>Tech</span><span className="font-bold ml-auto text-white">40%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span><span>Education</span><span className="font-bold ml-auto text-white">25%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span><span>Healthcare</span><span className="font-bold ml-auto text-white">15%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span><span>Finance</span><span className="font-bold ml-auto text-white">12%</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#64748B]"></span><span>Others</span><span className="font-bold ml-auto text-white">8%</span></div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center font-medium">
                12 Workspaces active across industries
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
                {[
                  { name: 'Kirxa Labs', users: '248 users', status: 'Active' },
                  { name: 'TechCorp Solutions', users: '180 users', status: 'Active' },
                  { name: 'EduNext', users: '120 users', status: 'Active' },
                  { name: 'HealthPlus', users: '95 users', status: 'Active' },
                ].map((org, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-white">{org.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{org.users}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
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
                    {[
                      { org: 'TechCorp Solutions', action: 'New user registered', user: 'priya@techcorp.com', time: '2 hours ago' },
                      { org: 'Kirxa Labs', action: 'Session created', user: 'admin@kirxa.com', time: '4 hours ago' },
                      { org: 'EduNext', action: 'Game approved', user: 'admin@edunest.com', time: '6 hours ago' },
                    ].map((row, idx) => (
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
                {[
                  { name: 'API Server', status: 'Healthy', icon: Server },
                  { name: 'Database', status: 'Healthy', icon: Database },
                  { name: 'Socket Server', status: 'Healthy', icon: Cpu },
                  { name: 'Storage', status: 'Healthy', icon: HardDrive },
                ].map((svc, idx) => {
                  const Icon = svc.icon;
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
