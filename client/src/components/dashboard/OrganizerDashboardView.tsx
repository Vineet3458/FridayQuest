'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Star,
  ChevronRight,
  Plus,
  ArrowRight,
  MapPin,
  Check,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAnalytics } from '@/hooks/useAnalytics';

interface OrganizerDashboardViewProps {
  user?: any;
  nextSession?: any;
  sessions?: any[];
  isCompact?: boolean;
}

export default function OrganizerDashboardView({
  user,
  nextSession,
  sessions = [],
  isCompact = false,
}: OrganizerDashboardViewProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const displayName = user?.name || 'Riya Sharma';
  const userInitials = displayName.slice(0, 2).toUpperCase();

  const { data } = useAnalytics({ scope: 'org' });
  const kpis = data?.kpis || {};
  const avgSatisfaction = kpis.avgSatisfaction ?? 4.8;
  const upcomingCount = data?.upcomingSessions?.length ?? 3;
  const totalParticipants = kpis.totalEmployees ? kpis.totalEmployees * 4 : 128;
  const confirmedJoining = data?.upcomingSessions?.[0]?.joining || '30 / 120';
  const joinCode = nextSession?.joinCode || '';
  const liveRoomUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/play` : '/sessions';
  const screenUrl = joinCode ? `/session/${encodeURIComponent(joinCode)}/screen` : '/sessions';

  const recentCompleted = (sessions || []).filter(
    (s) => s.status === 'done' || s.status === 'completed'
  );

  return (
    <div className="p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* HEADER GREETING BANNER - Warm Sunset Peach / Apricot theme */}
          <div className="bg-gradient-to-r from-[#FED7AA]/60 via-[#FDE68A]/40 to-[#FECDD3]/50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
            <div className="flex items-center gap-4 z-10">
              {/* Illustrated Host avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 shadow-md shrink-0 flex items-center justify-center">
                <span className="text-3xl">👩‍💼</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Good Morning, {displayName}!
                  </h2>
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Plan, Organize, Play. Make Fridays Unforgettable!
                </p>
              </div>
            </div>

            {/* Quote Pill Card */}
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-amber-200 dark:border-amber-900/50 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-xs shrink-0 z-10 italic">
              “Games bring people closer.”
            </div>
          </div>

          {/* 4 TOP STAT CARDS IN A ROW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Upcoming Sessions */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">
                  {upcomingCount}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Upcoming Sessions</div>
              </div>
            </div>

            {/* Card 2: Total Participants */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">
                  {totalParticipants}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Total Participants</div>
              </div>
            </div>

            {/* Card 3: Games Conducted */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">
                  {kpis.sessionsThisQuarter ? kpis.sessionsThisQuarter * 4 : 24}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Games Conducted</div>
              </div>
            </div>

            {/* Card 4: Avg. Rating */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">
                  {avgSatisfaction.toFixed(1)}
                </div>
                <div className="text-xs font-semibold text-slate-500 mt-1">Avg. Rating</div>
              </div>
            </div>
          </div>

          {/* 3 MID CARDS: NEXT SESSION, SESSION PLANNER STEPPER, QUICK TOOLS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Column 1: Next Session (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase text-[#7C3AED] bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 rounded-full">
                  Next Session
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {nextSession?.title || 'Fun Friday Kickoff'} 🎉
                </h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 mt-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {nextSession?.date ? new Date(nextSession.date).toLocaleDateString() : 'Fri, Oct 30, 2026'} • {nextSession?.startTime || '4:00 PM - 5:30 PM'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{nextSession?.location || 'Cafeteria, Noida'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{confirmedJoining} participants confirmed</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/sessions"
                  className="flex-1 py-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit Session
                </Link>
                <Link
                  href={liveRoomUrl}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-center text-xs font-extrabold transition-all shadow-md shadow-purple-500/25 flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Session</span>
                </Link>
              </div>
            </div>

            {/* Column 2: Session Planner Stepper (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Session Planner
              </h4>

              <div className="space-y-3">
                {[
                  { step: 1, title: 'Select Games', desc: 'Choose from library', active: true },
                  { step: 2, title: 'Create Plan', desc: 'Auto-arrange or manual', active: true },
                  { step: 3, title: 'Generate Teams', desc: 'Balanced team allocation', active: false },
                  { step: 4, title: 'Review & Publish', desc: 'Final check and notify', active: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                        s.active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {s.step}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{s.title}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/sessions"
                className="w-full py-2 bg-blue-50/70 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-center rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
              >
                <span>Continue Planning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Column 3: Quick Tools (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-2.5">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider pb-1">
                Quick Tools
              </h4>

              <div className="space-y-1.5">
                {[
                  { title: 'Auto Planner', desc: 'Generate best game plan', icon: '⚡', color: 'text-cyan-600', href: '/sessions' },
                  { title: 'Team Maker', desc: 'Create balanced teams', icon: '👥', color: 'text-emerald-600', href: '/teams' },
                  { title: 'Game Library', desc: 'Browse and select games', icon: '🎮', color: 'text-purple-600', href: '/games' },
                  { title: 'Live Control', desc: 'Manage ongoing session', icon: '🔴', color: 'text-rose-600', href: liveRoomUrl },
                ].map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    className="p-2 rounded-2xl hover:bg-amber-50/70 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors group"
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${tool.color} group-hover:underline`}>
                        {tool.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{tool.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* TODAY'S READY CHECKLIST */}
          <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
              Today's Ready Checklist
            </h4>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { title: 'Games Selected', sub: `${nextSession?.agenda?.length || 3} games in plan` },
                { title: 'Teams Generated', sub: '4 teams (balanced)' },
                { title: 'Props Ready', sub: nextSession?.propsChecklist?.length ? `${nextSession.propsChecklist.length} props checked` : 'Materials ready' },
                { title: 'Location Confirmed', sub: nextSession?.location || 'Cafeteria, Noida' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center gap-2.5"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT SESSIONS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-900 dark:text-white tracking-wider">
                Recent Sessions
              </h4>
              <Link href="/sessions" className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentCompleted.length > 0 ? (
                recentCompleted.map((s, idx) => (
                  <div
                    key={s._id || idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 shadow-xs flex items-center justify-between group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 rounded-xl bg-amber-50 dark:bg-slate-800">
                        {idx === 0 ? '🎉' : idx === 1 ? '🌟' : '🤝'}
                      </span>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                          {s.title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {s.date ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'} • {s.location || 'Cafeteria'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{avgSatisfaction.toFixed(1)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-6 text-xs text-slate-400 italic bg-amber-50/40 dark:bg-slate-800/40 rounded-2xl border border-dashed border-amber-200 dark:border-slate-700">
                  No completed past sessions recorded yet. Completed sessions will show here automatically.
                </div>
              )}
            </div>
          </div>
    </div>
  );
}
