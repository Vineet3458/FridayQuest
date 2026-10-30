'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Gamepad2,
  Users,
  ShieldAlert,
  Tv,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {}
    logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Sessions', href: '/sessions', icon: Calendar },
    { label: 'Game Library', href: '/games', icon: Gamepad2 },
    { label: 'Team Maker', href: '/teams', icon: Users },
    { label: 'Roles Matrix', href: '/roles', icon: ShieldAlert },
  ];

  // Don't show navbar on public standalone screen / projector view
  if (pathname.includes('/screen')) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'FQ';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Desktop / Laptop & Tablet Header */}
      <header className="w-full bg-white/95 dark:bg-[#0c1222]/95 border-b border-slate-200/90 dark:border-slate-800/80 sticky top-8 z-30 transition-colors backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center font-black text-white text-xs tracking-wider shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                  FQ
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-none">
                    FridayQuest
                    <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20">
                      MVP
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:inline">
                    Fun Friday Game Master
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all duration-150 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200/70 dark:border-blue-500/30 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Tools & User Info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Projector TV View Shortcut */}
              <Link
                href="/session/DEMO/screen"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                title="Open Projector / Cafeteria TV View"
              >
                <Tv className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Projector TV</span>
              </Link>

              {/* User Profile / Auth */}
              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {/* User Initial Avatar */}
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 select-none ring-2 ring-white dark:ring-slate-900"
                    title={user.name}
                  >
                    {getInitials(user.name)}
                  </div>

                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px] leading-tight">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                      {user.role || 'Member'} • {user.department || 'General'}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-1.5 sm:p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed thumb-friendly for phone screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0c1222]/95 border-t border-slate-200 dark:border-slate-800/80 backdrop-blur-md z-30 pb-safe transition-colors">
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''
                  }`}
                />
                <span className="text-[10px] leading-tight truncate px-1">
                  {item.label.split(' ')[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
