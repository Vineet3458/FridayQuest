'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogOut,
  Menu,
  X,
  Building2,
  BarChart2,
  CheckSquare,
  FileText,
  TrendingUp,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';

interface RoleAppShellProps {
  children: React.ReactNode;
}

export default function RoleAppShell({ children }: RoleAppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const role: UserRole = user?.role || 'player';
  const displayName =
    user?.name ||
    (role === 'organizer' ? 'Riya Sharma' : role === 'orgAdmin' ? 'Amit Verma' : 'Kirxa');
  const userInitials = displayName.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isLinkActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  // 1. Role-specific sidebar navigation items
  const renderSidebarContent = () => {
    switch (role) {
      case 'organizer': {
        const activeClass = 'bg-[#7C3AED] text-white shadow-xs font-bold';
        const inactiveClass =
          'text-slate-600 dark:text-slate-400 hover:text-amber-900 dark:hover:text-white hover:bg-amber-100/50 dark:hover:bg-slate-800/60 font-semibold';

        return (
          <>
            {/* Organizer Warm Peach/Cream Sidebar */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1 pt-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-orange-500/25">
                  FQ
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  FridayQuest
                </span>
              </div>

              <nav className="space-y-1 text-xs">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/dashboard') ? activeClass : inactiveClass
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isLinkActive('/dashboard') ? 'text-white' : 'text-purple-600'}`} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/sessions') ? activeClass : inactiveClass
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isLinkActive('/sessions') ? 'text-white' : 'text-amber-500'}`} />
                  <span>Create Session</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Layers className="w-4 h-4 text-orange-500" />
                  <span>Auto Planner</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/teams') ? activeClass : inactiveClass
                  }`}
                >
                  <Users className={`w-4 h-4 ${isLinkActive('/teams') ? 'text-white' : 'text-emerald-500'}`} />
                  <span>Team Maker</span>
                </Link>

                <Link
                  href="/games"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/games') ? activeClass : inactiveClass
                  }`}
                >
                  <Gamepad2 className={`w-4 h-4 ${isLinkActive('/games') ? 'text-white' : 'text-purple-500'}`} />
                  <span>Game Library</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Play className="w-4 h-4 text-rose-500" />
                  <span>Live Control</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Session History</span>
                </Link>
              </nav>
            </div>

            <div className="pt-3 border-t border-amber-200/70 dark:border-slate-800/80 space-y-1 text-xs">
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  isLinkActive('/roles') ? activeClass : 'font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-amber-100/40 dark:hover:bg-slate-800/60'
                }`}
              >
                <User className={`w-4 h-4 ${isLinkActive('/roles') ? 'text-white' : 'text-slate-500'}`} />
                <span>Profile</span>
              </Link>
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
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
          </>
        );
      }

      case 'orgAdmin': {
        const activeClass = 'bg-[#2563EB] text-white shadow-xs font-bold';
        const inactiveClass =
          'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 font-semibold';

        return (
          <>
            {/* Org Admin Corporate Blue Sidebar */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1 pt-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-600 to-blue-500 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/25">
                  FQ
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  FridayQuest
                </span>
              </div>

              <nav className="space-y-1 text-xs">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/dashboard') ? activeClass : inactiveClass
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isLinkActive('/dashboard') ? 'text-white' : 'text-blue-600'}`} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/teams') ? activeClass : inactiveClass
                  }`}
                >
                  <Users className={`w-4 h-4 ${isLinkActive('/teams') ? 'text-white' : 'text-blue-600'}`} />
                  <span>Employees</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/sessions') ? activeClass : inactiveClass
                  }`}
                >
                  <Calendar className={`w-4 h-4 ${isLinkActive('/sessions') ? 'text-white' : 'text-indigo-600'}`} />
                  <span>Sessions</span>
                </Link>

                <Link
                  href="/games"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/games') ? activeClass : inactiveClass
                  }`}
                >
                  <Gamepad2 className={`w-4 h-4 ${isLinkActive('/games') ? 'text-white' : 'text-purple-600'}`} />
                  <span>Game Library</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/analytics') ? activeClass : inactiveClass
                  }`}
                >
                  <BarChart2 className={`w-4 h-4 ${isLinkActive('/analytics') ? 'text-white' : 'text-sky-600'}`} />
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/approvals"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/approvals') ? activeClass : inactiveClass
                  }`}
                >
                  <CheckSquare className={`w-4 h-4 ${isLinkActive('/approvals') ? 'text-white' : 'text-emerald-600'}`} />
                  <span>Approvals</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Users className="w-4 h-4 text-amber-600" />
                  <span>Teams</span>
                </Link>
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs">
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
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
          </>
        );
      }

      case 'superAdmin': {
        const activeClass = 'bg-[#2563EB] text-white shadow-xs font-bold';
        const inactiveClass =
          'text-slate-400 hover:text-white hover:bg-slate-800/60 font-semibold';

        return (
          <>
            {/* Super Admin Midnight Navy Sidebar */}
            <div className="space-y-5">
              <div className="flex items-center gap-2.5 px-1 pt-1">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/25">
                  FQ
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  FridayQuest
                </span>
              </div>

              <nav className="space-y-1 text-xs">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/dashboard') ? activeClass : inactiveClass
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isLinkActive('/dashboard') ? 'text-white' : 'text-blue-400'}`} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/teams') ? activeClass : inactiveClass
                  }`}
                >
                  <Building2 className={`w-4 h-4 ${isLinkActive('/teams') ? 'text-white' : 'text-sky-400'}`} />
                  <span>Organizations</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Users</span>
                </Link>

                <Link
                  href="/games"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/games') ? activeClass : inactiveClass
                  }`}
                >
                  <Gamepad2 className={`w-4 h-4 ${isLinkActive('/games') ? 'text-white' : 'text-purple-400'}`} />
                  <span>Games</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/analytics') ? activeClass : inactiveClass
                  }`}
                >
                  <BarChart2 className={`w-4 h-4 ${isLinkActive('/analytics') ? 'text-white' : 'text-indigo-400'}`} />
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Settings className="w-4 h-4 text-teal-400" />
                  <span>System Settings</span>
                </Link>

                <Link
                  href="/roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Audit Logs</span>
                </Link>
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-1 text-xs">
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        );
      }

      case 'player':
      default: {
        const activeClass = 'bg-gradient-to-r from-[#6366F1] to-[#7C3AED] text-white shadow-md shadow-purple-500/20 font-bold';
        const inactiveClass =
          'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50/60 dark:hover:bg-slate-800/60 font-semibold';

        return (
          <>
            {/* Player / Employee Clean White Sidebar matching exact design */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 px-1 pt-1">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/25 shrink-0">
                  <Gamepad2 className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white leading-none block">
                    FridayQuest
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                    Play. Connect. Grow.
                  </span>
                </div>
              </div>

              <nav className="space-y-1 text-xs">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/dashboard') ? activeClass : inactiveClass
                  }`}
                >
                  <LayoutDashboard className={`w-4 h-4 ${isLinkActive('/dashboard') ? 'text-white' : 'text-purple-600'}`} />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/sessions"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/sessions') ? activeClass : inactiveClass
                  }`}
                >
                  <Calendar className={`w-4 h-4 ${isLinkActive('/sessions') ? 'text-white' : 'text-purple-500'}`} />
                  <span>My Sessions</span>
                </Link>

                <Link
                  href="/games"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/games') ? activeClass : inactiveClass
                  }`}
                >
                  <Gamepad2 className={`w-4 h-4 ${isLinkActive('/games') ? 'text-white' : 'text-purple-500'}`} />
                  <span>Game Library</span>
                </Link>

                <Link
                  href="/teams"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/teams') ? activeClass : inactiveClass
                  }`}
                >
                  <Users className={`w-4 h-4 ${isLinkActive('/teams') ? 'text-white' : 'text-amber-500'}`} />
                  <span>My Team</span>
                </Link>

                <Link
                  href="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                    isLinkActive('/analytics') ? activeClass : inactiveClass
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${isLinkActive('/analytics') ? 'text-white' : 'text-emerald-500'}`} />
                  <span>My Progress</span>
                </Link>

                <Link
                  href="/roles"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${inactiveClass}`}
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Achievements</span>
                </Link>
              </nav>

              {/* Astronaut Mascot Card matching exact reference */}
              <div className="pt-2 px-3 py-2.5 rounded-2xl bg-gradient-to-b from-blue-50/60 via-purple-50/50 to-pink-50/40 dark:from-slate-900 dark:to-indigo-950/40 border border-purple-100/60 dark:border-slate-800 text-center flex flex-col items-center select-none">
                <img
                  src="/images/player/astronaut-only.png"
                  alt="FridayQuest Mascot"
                  className="w-16 h-auto drop-shadow-xs"
                />
                <div className="mt-1 text-[10px] font-extrabold text-slate-700 dark:text-slate-300 leading-tight">
                  <div>Good Games</div>
                  <div>Better People</div>
                  <div className="text-purple-600 dark:text-purple-400">Happier Fridays! ✨</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 space-y-1 text-xs">
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/roles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        );
      }
    }
  };

  // 2. Shell background classes
  const shellBgClass = (() => {
    switch (role) {
      case 'organizer':
        return 'bg-[#FAF5EF] dark:bg-slate-900 text-slate-900 dark:text-slate-100';
      case 'orgAdmin':
        return 'bg-[#F0F7FF] dark:bg-slate-900 text-slate-900 dark:text-slate-100';
      case 'superAdmin':
        return 'bg-[#0B101D] text-white';
      case 'player':
      default:
        return 'bg-gradient-to-br from-[#EEF4FF] via-[#F8FAFC] to-[#F5EEFB] dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 text-slate-900 dark:text-slate-100';
    }
  })();

  const sidebarBgClass = (() => {
    switch (role) {
      case 'organizer':
        return 'border-amber-200/70 dark:border-slate-800/80 bg-[#FFFDF9] dark:bg-slate-950';
      case 'orgAdmin':
        return 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950';
      case 'superAdmin':
        return 'border-slate-800/80 bg-[#090D16]';
      case 'player':
      default:
        return 'border-slate-200/70 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md';
    }
  })();

  const headerBgClass = (() => {
    switch (role) {
      case 'organizer':
        return 'border-amber-200/70 dark:border-slate-800/80 bg-[#FFFDF9]/90 dark:bg-slate-950/80';
      case 'orgAdmin':
        return 'border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80';
      case 'superAdmin':
        return 'border-slate-800 bg-[#0B0F19]';
      case 'player':
      default:
        return 'border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md';
    }
  })();

  const searchInputClass = (() => {
    switch (role) {
      case 'organizer':
        return 'bg-white dark:bg-slate-900 border-amber-200/70 dark:border-slate-800 placeholder:text-amber-800/40 focus:ring-amber-500';
      case 'orgAdmin':
        return 'bg-[#F1F5F9] dark:bg-slate-900 border-transparent dark:border-slate-800 placeholder:text-slate-400 focus:ring-blue-500';
      case 'superAdmin':
        return 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus:ring-blue-500';
      case 'player':
      default:
        return 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-blue-500 shadow-xs';
    }
  })();

  const searchPlaceholder = (() => {
    switch (role) {
      case 'organizer':
        return 'Search sessions, games...';
      case 'orgAdmin':
        return 'Search employees, sessions...';
      case 'superAdmin':
        return 'Search organizations, users...';
      case 'player':
      default:
        return 'Search games, sessions, or anything...';
    }
  })();

  const roleBadgeLabel = (() => {
    switch (role) {
      case 'organizer':
        return 'Organizer';
      case 'orgAdmin':
        return 'Org Admin';
      case 'superAdmin':
        return 'Super Admin';
      case 'player':
      default:
        return 'Player';
    }
  })();

  const avatarGradientClass = (() => {
    switch (role) {
      case 'organizer':
        return 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white ring-orange-500/20';
      case 'orgAdmin':
        return 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-blue-500/20';
      case 'superAdmin':
        return 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-blue-500/20';
      case 'player':
      default:
        return 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-blue-500/20';
    }
  })();

  const roleTextClass = (() => {
    switch (role) {
      case 'organizer':
        return 'text-amber-600 dark:text-amber-400';
      case 'orgAdmin':
        return 'text-blue-600 dark:text-blue-400';
      case 'superAdmin':
        return 'text-blue-400';
      case 'player':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  })();

  return (
    <div className={`h-screen w-full flex flex-col md:flex-row overflow-hidden transition-colors ${shellBgClass}`}>
      {/* 1. Desktop Persistent Left Sidebar (FIXED & PINNED: never scrolls away) */}
      <aside
        className={`w-60 shrink-0 border-r p-4 hidden md:flex flex-col justify-between shadow-xs h-screen overflow-y-auto z-30 select-none ${sidebarBgClass}`}
      >
        {renderSidebarContent()}
      </aside>

      {/* 2. Main Area with Top Header and Page Component */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header (FIXED & PINNED: never scrolls away) */}
        <header
          className={`shrink-0 px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 z-20 transition-colors ${headerBgClass}`}
        >
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-[10px]">
              FQ
            </div>
          </div>

          {/* Search Pill with ⌘ K shortcut */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={`w-full rounded-full pl-9 pr-14 py-2 text-xs focus:outline-none focus:ring-2 transition-all ${searchInputClass}`}
            />
            <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 select-none">⌘ K</kbd>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              className="p-2 rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black absolute -top-0.5 -right-0.5 flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs">
                3
              </span>
            </button>

            <ThemeToggle />

            {/* TV View shortcut */}
            <Link
              href="/sessions"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 text-xs font-bold hover:bg-blue-100 transition-colors shadow-2xs"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>TV View</span>
            </Link>

            {/* User Avatar - Clean Role Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div
                className={`w-8 h-8 rounded-full font-black text-xs flex items-center justify-center ring-2 ${avatarGradientClass}`}
              >
                {userInitials}
              </div>
              <div className="text-left hidden sm:block leading-tight">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{displayName}</div>
                <div className={`text-[10px] font-medium capitalize ${roleTextClass}`}>
                  {roleBadgeLabel}
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
          <div className={`md:hidden shrink-0 border-b p-4 space-y-3 animate-in slide-in-from-top duration-200 ${sidebarBgClass}`}>
            {renderSidebarContent()}
          </div>
        )}

        {/* Dedicated Scrollable Content View: ONLY THIS CONTAINER SCROLLS */}
        <main className="flex-1 overflow-y-auto min-w-0 flex flex-col relative focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
