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
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
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
    <div className="relative p-4 sm:p-6 lg:p-7 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
      {/* Ambient background glow elements matching playful light theme */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. HERO BANNER CARD - Light Playful Theme Reference */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#DBEAFE]/80 via-[#EFF6FF]/95 to-[#EDE9FE]/85 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border border-blue-100/90 dark:border-indigo-900/40 p-5 sm:p-7 shadow-xs overflow-hidden">
        {/* Floating Sparkles & Confetti Background Elements */}
        <div className="absolute top-3 left-1/3 text-lg opacity-60 pointer-events-none animate-pulse">✨</div>
        <div className="absolute bottom-4 right-1/3 text-base opacity-50 pointer-events-none">🎉</div>
        <div className="absolute top-8 right-16 text-sm opacity-50 pointer-events-none">⭐</div>

        {/* Top Header Row inside Hero Card: Greeting & Quote Bubble */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>👋</span>
              <span>Hi, {displayName}!</span>
            </h1>
            <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              Ready for some Fun Friday?
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Let&apos;s play together, connect better and make this Friday amazing!
            </p>
          </div>

          {/* Floating Speech Bubble / Quote matching reference */}
          <div className="self-start shrink-0 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 border border-blue-100 dark:border-slate-800 shadow-sm text-center">
            <div className="text-xs font-black text-blue-600 dark:text-blue-400 italic leading-snug">
              &ldquo;Good teams<br />
              Great people<br />
              Happier Fridays!&rdquo;
            </div>
          </div>
        </div>

        {/* Hero Body Grid: Inner Event Card & Celebratory Illustration */}
        <div className="mt-6 pt-5 border-t border-blue-200/60 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Left Column: Floating Inner Event Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/95 rounded-2xl p-5 sm:p-6 shadow-xs border border-blue-100/70 dark:border-slate-800 space-y-4">
            {/* Top row of Event Card: Pill Tag + Live Countdown Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="self-start px-3 py-1 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                Next Friday Event
              </span>

              {/* Countdown Timer with 4 vertical boxes */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                {[
                  { val: countdown.days, label: 'Days' },
                  { val: countdown.hours, label: 'Hours' },
                  { val: countdown.mins, label: 'Mins' },
                  { val: countdown.secs, label: 'Secs' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-11 sm:w-12 py-1.5 px-1 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-center shadow-2xs"
                  >
                    <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono leading-none">
                      {item.val}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-tight mt-0.5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{nextSession?.title || 'Fun Friday Kickoff'}</span>
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
                  <span>{nextSession?.location || 'Cafeteria, Noida'}</span>
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
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Enter Live Room (Buzzer &amp; Card)</span>
              </Link>

              <Link
                href="/sessions"
                className="px-4 sm:px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
              >
                <span>View Details</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Teammates Celebration Vector Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 h-60 flex items-center justify-center">
              <svg viewBox="0 0 280 230" className="w-full h-full drop-shadow-md select-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pTrophyGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FCD34D" />
                    <stop offset="45%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="pBlueShirt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </linearGradient>
                  <linearGradient id="pYellowShirt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                  <linearGradient id="pPinkDress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F43F5E" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                </defs>

                {/* Confetti Ribbons & Sparkles */}
                <path d="M 25,50 Q 40,30 35,70 T 50,85" stroke="#3B82F6" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 230,40 Q 245,20 240,60 T 255,75" stroke="#EC4899" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 190,15 Q 200,28 215,22" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                <circle cx="50" cy="30" r="3" fill="#FBBF24" />
                <circle cx="225" cy="25" r="3.5" fill="#8B5CF6" />
                <rect x="75" y="20" width="5" height="5" rx="1" fill="#10B981" transform="rotate(35 75 20)" />
                <rect x="210" y="80" width="6" height="6" rx="1.5" fill="#3B82F6" transform="rotate(25 210 80)" />

                {/* Left Teammate (Yellow shirt, cheering fist) */}
                <g transform="translate(10, 15)">
                  {/* Head */}
                  <circle cx="70" cy="110" r="18" fill="#FED7AA" />
                  {/* Hair */}
                  <path d="M 52,105 C 55,85 85,85 88,105 C 80,100 65,100 52,105 Z" fill="#451A03" />
                  {/* Glasses */}
                  <circle cx="64" cy="110" r="4.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
                  <circle cx="76" cy="110" r="4.5" stroke="#1F2937" strokeWidth="1.8" fill="none" />
                  <line x1="68.5" y1="110" x2="71.5" y2="110" stroke="#1F2937" strokeWidth="1.8" />
                  {/* Smile */}
                  <path d="M 66,119 Q 70,124 74,119" stroke="#9A3412" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Torso */}
                  <path d="M 50,132 C 60,128 80,128 90,132 L 96,200 L 44,200 Z" fill="url(#pYellowShirt)" />
                  {/* Cheering Arm */}
                  <path d="M 52,135 Q 38,115 42,95" stroke="#FED7AA" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <circle cx="42" cy="93" r="5" fill="#FED7AA" />
                </g>

                {/* Right Teammate (Coral-pink top, clapping cheer) */}
                <g transform="translate(10, 15)">
                  {/* Hair back */}
                  <path d="M 170,105 C 165,85 205,85 200,105 C 205,130 195,145 190,150" stroke="#371B11" strokeWidth="14" fill="none" strokeLinecap="round" />
                  {/* Head */}
                  <circle cx="185" cy="115" r="17" fill="#FED7AA" />
                  {/* Face */}
                  <circle cx="180" cy="113" r="2" fill="#1F2937" />
                  <circle cx="190" cy="113" r="2" fill="#1F2937" />
                  <path d="M 181,121 Q 185,127 189,121" stroke="#9F1239" strokeWidth="2" fill="none" strokeLinecap="round" />
                  {/* Torso */}
                  <path d="M 166,136 C 176,132 194,132 204,136 L 210,200 L 160,200 Z" fill="url(#pPinkDress)" />
                  {/* Cheering arm */}
                  <path d="M 200,138 Q 218,120 220,100" stroke="#FED7AA" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <circle cx="220" cy="98" r="5" fill="#FED7AA" />
                </g>

                {/* Center Teammate (Blue hoodie, holding trophy aloft) */}
                <g transform="translate(10, 15)">
                  {/* Head */}
                  <circle cx="128" cy="100" r="20" fill="#FED7AA" />
                  {/* Hair */}
                  <path d="M 108,95 C 112,75 144,75 148,95 C 140,90 120,90 108,95 Z" fill="#1E293B" />
                  {/* Eyes & Smile */}
                  <circle cx="122" cy="98" r="2.2" fill="#1E293B" />
                  <circle cx="134" cy="98" r="2.2" fill="#1E293B" />
                  <path d="M 122,107 Q 128,115 134,107" stroke="#9A3412" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                  {/* Body in blue */}
                  <path d="M 106,125 C 118,120 138,120 150,125 L 158,205 L 98,205 Z" fill="url(#pBlueShirt)" />
                  {/* Hoodie drawstrings */}
                  <line x1="124" y1="126" x2="124" y2="142" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  <line x1="132" y1="126" x2="132" y2="142" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  {/* Raised Arm to Trophy */}
                  <path d="M 144,126 Q 160,95 152,58" stroke="#FED7AA" strokeWidth="9" strokeLinecap="round" fill="none" />
                </g>

                {/* Gleaming Golden Trophy */}
                <g transform="translate(150, 25)">
                  {/* Trophy Cup */}
                  <path d="M 4,14 L 28,14 L 22,42 Q 16,50 16,50 Q 10,50 4,42 Z" fill="url(#pTrophyGrad)" />
                  {/* Trophy Left Handle */}
                  <path d="M 4,18 Q -8,25 2,36" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Trophy Right Handle */}
                  <path d="M 28,18 Q 40,25 30,36" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Trophy Stem & Base */}
                  <rect x="13" y="50" width="6" height="8" fill="#D97706" />
                  <rect x="8" y="58" width="16" height="6" rx="1.5" fill="#92400E" />
                  {/* Center Star on Trophy */}
                  <polygon points="16,22 17.8,26.5 22.5,26.5 18.5,29.5 20,34 16,31 12,34 13.5,29.5 9.5,26.5 14.2,26.5" fill="#FFFBEB" />
                  {/* Sparkle burst */}
                  <circle cx="28" cy="12" r="2.5" fill="#FEF08A" />
                  <line x1="28" y1="7" x2="28" y2="17" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="23" y1="12" x2="33" y2="12" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THREE MIDDLE CARDS GRID: VIBE CHECK, JOURNEY XP, QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Vibe Check */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Vibe Check
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              How are you feeling for Friday?
            </p>
          </div>

          {/* Energy Scale 1 to 5 */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Your energy tomorrow?
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setVibeEnergy(lvl)}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    vibeEnergy === lvl
                      ? 'bg-[#7C3AED] text-white shadow-xs ring-2 ring-purple-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector Chips (Active, Calm, Brainy) */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['active', 'calm', 'brainy'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setVibeStyle(s)}
                className={`py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  vibeStyle === s
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Wide Submit Button */}
          <button
            type="button"
            onClick={onQuickVibe}
            disabled={vibeSubmitting || vibeSubmitted}
            className="w-full py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-80 flex items-center justify-center gap-1.5"
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
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Your FridayQuest Journey
            </h3>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
              Level 3
            </span>
          </div>

          {/* Big XP Display Block */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤗</span>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  350 XP
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  150 XP to next level
                </div>
              </div>
            </div>
            <span className="text-xl">🌟</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full w-[70%] rounded-full"></div>
          </div>

          {/* 3 Mini Stats Counters */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-center">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
                <Gamepad2 className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-base font-extrabold text-slate-900 dark:text-white">5</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Games Played</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1 text-emerald-600">
                <Trophy className="w-3.5 h-3.5" />
                <span className="text-base font-extrabold">2</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Wins</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Award className="w-3.5 h-3.5" />
                <span className="text-base font-extrabold">3</span>
              </div>
              <div className="text-[9px] font-semibold text-slate-400 mt-0.5">Badges</div>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <Link
              href="/games"
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center shrink-0">
                  <Gamepad2 className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    Browse Game Library
                  </div>
                  <div className="text-[10px] text-slate-400">Discover fun games</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/teams"
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-950 text-orange-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    View My Team
                  </div>
                  <div className="text-[10px] text-slate-400">See your team members</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/sessions"
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Past Sessions
                  </div>
                  <div className="text-[10px] text-slate-400">Check recaps &amp; photos</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/roles"
              className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    Achievements
                  </div>
                  <div className="text-[10px] text-slate-400">Your badges &amp; milestones</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. FEATURED GAMES FOR YOU ROW - Horizontal Cards matching Reference */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Featured Games for You
          </h3>
          <Link
            href="/games"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 hover:underline flex items-center gap-0.5"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Game 1: Two Truths & a Lie */}
          <Link
            href="/games"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 flex items-center gap-3.5 group transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Thumbnail Box */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🎭
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                Two Truths &amp; a Lie
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                10 min • 4-10 players
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                ✦ Popular
              </span>
            </div>
          </Link>

          {/* Game 2: Chor-Police */}
          <Link
            href="/games"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 flex items-center gap-3.5 group transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Thumbnail Box */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-950/50 dark:to-red-950/50 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              👑
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate group-hover:text-rose-600 transition-colors">
                Chor-Police
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                20 min • 6+ players
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                ⚡ High Energy
              </span>
            </div>
          </Link>

          {/* Game 3: Antakshari */}
          <Link
            href="/games"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 flex items-center gap-3.5 group transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Thumbnail Box */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🎵
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                Antakshari
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                15 min • 4-8 players
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                👥 Team Game
              </span>
            </div>
          </Link>

          {/* Game 4: QR Treasure Hunt */}
          <Link
            href="/games"
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 flex items-center gap-3.5 group transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Thumbnail Box */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 border border-purple-200/60 dark:border-purple-800/40 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🔍
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="font-black text-xs text-slate-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                QR Treasure Hunt
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate">
                25 min • 6-18 players
              </div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                🎯 Outdoor/Indoor
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
