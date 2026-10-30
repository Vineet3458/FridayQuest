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
  Sparkles,
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

  // Don't show navbar on public standalone pages if unauthenticated or on screen view
  if (pathname.includes('/screen')) {
    return null;
  }

  return (
    <>
      {/* Desktop / Laptop & Tablet Header */}
      <header className="w-full bg-white/95 dark:bg-[#0d1322] border-b border-slate-200 dark:border-slate-800/80 sticky top-[41px] z-30 transition-colors backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/25">
                  FQ
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                    FridayQuest
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                      MVP
                    </span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Fun Friday Game Master</span>
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
                      className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Tools & User Info */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Theme Toggle Button (Desktop & Mobile) */}
              <ThemeToggle />

              {/* Projector TV View Shortcut */}
              <Link
                href="/session/DEMO/screen"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                title="Open Projector / Cafeteria TV View"
              >
                <Tv className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                <span>Projector TV</span>
              </Link>

              {user ? (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user.department || 'General'}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl shadow-md shadow-blue-500/20"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly for phone screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800/80 backdrop-blur z-30 pb-safe transition-colors">
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : ''}`} />
                <span className="text-[10px] leading-tight">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
