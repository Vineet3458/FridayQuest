'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Gamepad2,
  Users,
  Trophy,
  Play,
  ChevronRight,
  CheckCircle2,
  Award,
} from 'lucide-react';

interface PlayerDashboardViewProps {
  user?: any;
  nextSession?: any;
  vibeAttendeeCount: number;
  copiedCode: boolean;
  onCopyCode: (code: string) => void;
  vibeEnergy: number;
  setVibeEnergy: (lvl: number) => void;
  vibeStyle: 'active' | 'calm' | 'brainy';
  setVibeStyle: (style: 'active' | 'calm' | 'brainy') => void;
  vibeSubmitting: boolean;
  vibeSubmitted: boolean;
  onQuickVibe: () => Promise<void>;
  isCompact?: boolean;
}

export default function PlayerDashboardView({
  user,
  nextSession,
  vibeAttendeeCount,
  vibeEnergy,
  setVibeEnergy,
  vibeStyle,
  setVibeStyle,
  vibeSubmitting,
  vibeSubmitted,
  onQuickVibe,
}: PlayerDashboardViewProps) {
  const displayName = user?.name || 'Kirxa';
  const joinCode = nextSession?.joinCode || '';

  // Live countdown state starting at 2 days, 4 hours, 12 mins, 30 secs
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 4,
    mins: 12,
    secs: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full">
      {/* Dreamy soft gradient wallpaper overlay matching uploaded background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-35 dark:opacity-15 bg-[url('/images/player/player-bg.jpg')] bg-cover bg-fixed bg-center"
        aria-hidden="true"
      />

      {/* 1. HERO BANNER CARD - Matching reference design exactly */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#DBEAFE]/80 via-[#EFF6FF]/95 to-[#EDE9FE]/85 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border border-blue-100/90 dark:border-indigo-900/40 p-5 sm:p-6 shadow-xs overflow-hidden">
        {/* Floating Sparkles & Confetti Background Elements */}
        <div className="absolute top-3 left-1/3 text-lg opacity-60 pointer-events-none animate-pulse">✨</div>
        <div className="absolute bottom-4 right-1/3 text-base opacity-50 pointer-events-none">🎉</div>
        <div className="absolute top-8 right-16 text-sm opacity-50 pointer-events-none">⭐</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Greeting & Next Friday Event Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Hi, {displayName}!</span>
                  <span>👋</span>
                </h1>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#4F46E5] dark:text-[#818CF8] tracking-tight">
                Ready for some Fun Friday?
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-lg">
                Let&apos;s play together, connect with your team, and make this Friday amazing!
              </p>
            </div>

            {/* Inner Event Card */}
            <div className="bg-white dark:bg-slate-900/95 rounded-2xl p-4 sm:p-5 shadow-xs border border-blue-100/80 dark:border-slate-800 space-y-3.5">
              {/* Pill Tag + Live Countdown Timer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="self-start px-2.5 py-1 rounded-full bg-[#6366F1] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                  NEXT FRIDAY EVENT
                </span>

                {/* Countdown Timer with 4 vertical boxes */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {[
                    { val: countdown.days, label: 'DAYS' },
                    { val: countdown.hours, label: 'HOURS' },
                    { val: countdown.mins, label: 'MINS' },
                    { val: countdown.secs, label: 'SECS' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="w-10 sm:w-11 py-1 px-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center"
                    >
                      <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-mono leading-none">
                        {item.val}
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-tight mt-0.5">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Title */}
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>{nextSession?.title || 'Team Innovation Challenge'}</span>
                  <span>🎉</span>
                </h2>

                {/* Meta information row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{nextSession?.date ? new Date(nextSession.date).toLocaleDateString() : 'Fri, Oct 30, 2026'}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{nextSession?.startTime || '4:00 PM - 5:30 PM'}</span>
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{nextSession?.location || 'Innovation Lab'}</span>
                  </span>

                  {/* Overlapping Avatar Stack */}
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-blue-500 text-white text-[9px] font-bold text-center leading-5">K</span>
                      <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-purple-500 text-white text-[9px] font-bold text-center leading-5">R</span>
                      <span className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-amber-500 text-white text-[9px] font-bold text-center leading-5">A</span>
                    </div>
                    <span>{85 + vibeAttendeeCount} joining</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href={joinCode ? `/session/${encodeURIComponent(joinCode)}/play` : '/sessions'}
                  className="px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter Live Room (Buzzer &amp; Card)</span>
                </Link>

                <Link
                  href="/sessions"
                  className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
                >
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Illustration from Reference Design */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-center">
            <img
              src="/images/player/hero-illustration-exact.png"
              alt="FridayQuest Fun Team Celebration"
              className="w-full max-w-lg h-auto object-contain select-none drop-shadow-sm rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* 2. THREE MIDDLE CARDS GRID: VIBE CHECK, JOURNEY XP, QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Vibe Check */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-2xl shrink-0 shadow-2xs select-none">
              😊
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Vibe Check</span>
                <span className="text-purple-500 text-xs">✨</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                How are you feeling for Friday?
              </p>
            </div>
          </div>

          {/* Energy Scale 1 to 5 */}
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setVibeEnergy(lvl)}
                className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  vibeEnergy === lvl
                    ? 'bg-[#7C3AED] text-white shadow-xs ring-2 ring-purple-400/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Style Selector Chips (Active, Calm, Brainy) */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'active', label: 'Active', icon: '⚡' },
              { id: 'calm', label: 'Calm', icon: '😊' },
              { id: 'brainy', label: 'Brainy', icon: '🧠' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setVibeStyle(s.id as any)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  vibeStyle === s.id
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 hover:bg-purple-100'
                }`}
              >
                <span>{s.icon}</span>
                <span className="capitalize">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Wide Submit Button */}
          <button
            type="button"
            onClick={onQuickVibe}
            disabled={vibeSubmitting || vibeSubmitted}
            className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer disabled:opacity-80 flex items-center justify-center gap-1.5"
          >
            {vibeSubmitted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>✓ Vibe Submitted</span>
              </>
            ) : (
              <span>Submit Vibe</span>
            )}
          </button>
        </div>

        {/* Card 2: Your FridayQuest Journey */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-purple-600 text-sm">⚛️</span>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Your FridayQuest Journey
              </h3>
            </div>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Level 3
            </span>
          </div>

          {/* Big XP Display Block */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl select-none">⭐</span>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  350 XP
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  150 XP to next level
                </div>
              </div>
            </div>
            <span className="text-xl select-none">☀️</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full w-[70%] rounded-full"></div>
          </div>

          {/* 3 Mini Stats Counters */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Gamepad2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-base font-extrabold text-slate-900 dark:text-white">5</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Games Played</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-base font-extrabold">2</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Wins</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1.5 text-amber-500">
                <Award className="w-3.5 h-3.5" />
                <span className="text-base font-extrabold">3</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Badges</div>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-base">⚡</span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Quick Actions
            </h3>
          </div>

          <div className="space-y-2">
            {[
              {
                title: 'Browse Game Library',
                desc: 'Discover fun games',
                icon: <Gamepad2 className="w-4 h-4 text-blue-600" />,
                bg: 'bg-blue-50 dark:bg-blue-950',
                href: '/games',
              },
              {
                title: 'View My Team',
                desc: 'See your team members',
                icon: <Users className="w-4 h-4 text-orange-600" />,
                bg: 'bg-orange-50 dark:bg-orange-950',
                href: '/teams',
              },
              {
                title: 'Past Sessions',
                desc: 'Check recaps & photos',
                icon: <Calendar className="w-4 h-4 text-purple-600" />,
                bg: 'bg-purple-50 dark:bg-purple-950',
                href: '/sessions',
              },
              {
                title: 'Achievements',
                desc: 'Your badges & milestones',
                icon: <Award className="w-4 h-4 text-amber-600" />,
                bg: 'bg-amber-50 dark:bg-amber-950',
                href: '/roles',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FEATURED GAMES FOR YOU ROW - Exact Cards matching Reference */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center text-xs">
              <Gamepad2 className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              Featured Games for You
            </h3>
          </div>
          <Link
            href="/games"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Two Truths & A Lie',
              subtitle: 'Discover fun facts about your team',
              thumb: '/images/player/thumb-two-truths.jpg',
              badge: '🔥 Popular',
              badgeClass: 'bg-orange-500/95 text-white',
            },
            {
              title: 'Chor-Police',
              subtitle: 'Catch, escape and have fun!',
              thumb: '/images/player/thumb-chor-police.jpg',
              badge: '🛡️ Team Game',
              badgeClass: 'bg-blue-600/95 text-white',
            },
            {
              title: 'Antakshari',
              subtitle: 'Sing, connect and relive classics',
              thumb: '/images/player/thumb-antakshari.jpg',
              badge: '🎵 Music',
              badgeClass: 'bg-purple-600/95 text-white',
            },
            {
              title: 'QR Treasure Hunt',
              subtitle: 'Solve clues around the office',
              thumb: '/images/player/thumb-qr-hunt.jpg',
              badge: '⭐ Adventure',
              badgeClass: 'bg-amber-500/95 text-white',
            },
          ].map((g, idx) => (
            <Link
              key={idx}
              href="/games"
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
            >
              {/* Artwork Banner with Badge */}
              <div className="relative h-24 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={g.thumb}
                  alt={g.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                />
                <span
                  className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs ${g.badgeClass}`}
                >
                  {g.badge}
                </span>
              </div>

              {/* Title, Subtitle and Action Button */}
              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                    {g.title}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {g.subtitle}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center shrink-0 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
