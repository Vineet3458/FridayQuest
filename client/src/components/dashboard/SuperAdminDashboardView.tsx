'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Star,
  Activity,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';

interface SuperAdminDashboardViewProps {
  user?: any;
  isCompact?: boolean;
}

export default function SuperAdminDashboardView({
  user,
  isCompact = false,
}: SuperAdminDashboardViewProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Kirxa';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[100dvh] w-full bg-[#0B101D] text-white flex flex-col md:flex-row transition-colors">
      {/* 1. Sidebar - Super Admin Deep Midnight Navy */}
      <aside
        className={`${
          isCompact ? 'w-52 p-3' : 'w-60 p-4'
        } shrink-0 border-r border-slate-800/80 bg-[#090D16] hidden md:flex flex-col justify-between shadow-lg`}
      >
        <div className="space-y-5">
          {/* Platform Console FQ Logo */}
          <div className="flex items-center gap-2.5 px-1 pt-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/25">
              FQ
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
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
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Organizations</span>
            </Link>
            <Link
              href="/teams"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Users</span>
            </Link>
            <Link
              href="/games"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Games</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <BarChart2 className="w-4 h-4 text-indigo-400" />
              <span>Analytics</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Settings className="w-4 h-4 text-teal-400" />
              <span>System Settings</span>
            </Link>
            <Link
              href="/roles"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Audit Logs</span>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <Link
            href="/roles"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#0B0F19] sticky top-0 z-20">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-[10px]">
              FQ
            </div>
          </div>

          {/* Dark high-tech search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search organizations, users..."
              className="w-full bg-slate-950 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-[#0B0F19]"></span>
            </button>

            <ThemeToggle />

            {/* Avatar - Clean Production Role Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center ring-2 ring-blue-500/20">
                {userInitials}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-white">{displayName}</div>
                <div className="text-[10px] text-blue-400 font-medium capitalize">
                  {user?.role || 'Super Admin'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#090D16] border-b border-slate-800 p-4 space-y-3 animate-in slide-in-from-top duration-200">
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
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Organizations</span>
              </Link>
              <Link
                href="/teams"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Users</span>
              </Link>
              <Link
                href="/games"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <Gamepad2 className="w-4 h-4 text-purple-400" />
                <span>Games</span>
              </Link>
              <Link
                href="/roles"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <BarChart2 className="w-4 h-4 text-indigo-400" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/roles"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <Settings className="w-4 h-4 text-teal-400" />
                <span>System Settings</span>
              </Link>
              <Link
                href="/roles"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Audit Logs</span>
              </Link>
            </nav>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{displayName} ({user?.role || 'Super Admin'})</span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-rose-400 font-bold hover:underline flex items-center gap-1"
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
      </div>
    </div>
  );
}
