'use client';

import { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  UserCheck,
  Building2,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { UserRole } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {}
    logout();
    router.push('/login');
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setProfileOpen(false);
    try {
      const res = await apiRequest('/auth/trial', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else if (user) {
        setUser({ ...user, role });
      }
    } catch {
      if (user) setUser({ ...user, role });
    }
  };

  const navItems = [
    { label: 'Dashboard', shortLabel: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Sessions', shortLabel: 'Sessions', href: '/sessions', icon: Calendar },
    { label: 'Game Library', shortLabel: 'Games', href: '/games', icon: Gamepad2 },
    { label: 'Team Maker', shortLabel: 'Teams', href: '/teams', icon: Users },
    { label: 'Roles Matrix', shortLabel: 'Roles', href: '/roles', icon: ShieldAlert },
  ];

  // Don't show navbar on public standalone screen / projector view
  if (pathname.includes('/screen')) {
    return null;
  }

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return 'KI';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const roleLabel =
    user?.role === 'superAdmin'
      ? 'Super Admin'
      : user?.role === 'orgAdmin'
      ? 'Org Admin'
      : user?.role === 'organizer'
      ? 'Organizer'
      : 'Player';

  return (
    <>
      {/* Desktop / Laptop & Tablet Header */}
      <header className="w-full bg-white/95 dark:bg-[#0c1222]/95 border-b border-slate-200/90 dark:border-slate-800/80 sticky top-0 z-30 transition-colors backdrop-blur-md">
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
                      LIVE
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
                href="/session/KIRXA-DEMO/screen"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                title="Open Cafeteria TV View"
              >
                <Tv className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Projector TV</span>
              </Link>

              {/* User Profile / Popover */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
                >
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0 select-none ring-2 ring-white dark:ring-slate-900"
                    title={user?.name || 'Kirxa'}
                  >
                    {getInitials(user?.name)}
                  </div>

                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px] leading-tight">
                      {user?.name || 'Kirxa'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 capitalize flex items-center justify-end gap-1">
                      <span>{roleLabel}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </button>

                {/* Profile & Role Switcher Popover */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {user?.name || 'Kirxa'}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {user?.email || 'player@kirxa.demo'}
                      </div>
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                        <span>● {roleLabel}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 py-1">
                      Switch Role (Production Preview)
                    </div>

                    <div className="space-y-1">
                      {[
                        { role: 'player' as UserRole, name: 'Kirxa', desc: 'Participant & Gamified View', icon: Users },
                        { role: 'organizer' as UserRole, name: 'Riya Sharma', desc: 'Session Planner & Host', icon: Sparkles },
                        { role: 'orgAdmin' as UserRole, name: 'Amit Verma', desc: 'Company Analytics & HR', icon: Building2 },
                        { role: 'superAdmin' as UserRole, name: 'Platform Owner', desc: 'Platform Management', icon: Shield },
                      ].map((r) => {
                        const isCurrent = (user?.role || 'player') === r.role;
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.role}
                            type="button"
                            onClick={() => handleRoleSwitch(r.role)}
                            className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 transition-colors cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <div className="text-xs leading-none font-bold">{r.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Fixed thumb-friendly for phone screens with safe-area padding) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0c1222]/95 border-t border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md z-30 pb-safe transition-colors shadow-lg">
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 transition-all select-none relative ${
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
                <span className="text-[10px] leading-tight font-medium truncate px-0.5">
                  {item.shortLabel}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600 dark:blue-400"></span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
