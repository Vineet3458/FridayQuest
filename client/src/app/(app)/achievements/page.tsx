'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Award,
  Star,
  Zap,
  Flame,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  Gamepad2,
  Users,
  Compass,
  Music,
  Search,
  Check,
  ChevronRight,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { usePlayerAnalytics } from '@/hooks/useAnalytics';
import { useAuthStore } from '@/stores/useAuthStore';

interface BadgeItem {
  id: string;
  title: string;
  category: 'milestone' | 'game' | 'culture';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  rarityColor: string;
  icon: string;
  description: string;
  howToEarn: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; total: number; label: string };
}

const BADGES_CATALOG: BadgeItem[] = [
  // 1. Milestones
  {
    id: 'pioneer',
    title: 'First Friday Pioneer',
    category: 'milestone',
    rarity: 'Common',
    rarityColor: 'from-blue-500 to-indigo-600',
    icon: '🚩',
    description: 'Attended your first Fun Friday session and took part in company rituals.',
    howToEarn: 'Check in and participate in your first Friday session.',
    xpReward: 50,
    unlocked: true,
    unlockedAt: 'Oct 30, 2026',
  },
  {
    id: 'lvl-3',
    title: 'Explorer Rank (Lvl 3)',
    category: 'milestone',
    rarity: 'Rare',
    rarityColor: 'from-emerald-500 to-teal-600',
    icon: '🧭',
    description: 'Accumulated over 350 XP through games, vibe checks, and attendance.',
    howToEarn: 'Reach Level 3 by earning 350 Total XP.',
    xpReward: 100,
    unlocked: true,
    unlockedAt: 'Oct 30, 2026',
  },
  {
    id: 'lvl-4',
    title: 'Strategist Rank (Lvl 4)',
    category: 'milestone',
    rarity: 'Epic',
    rarityColor: 'from-purple-600 to-indigo-600',
    icon: '👑',
    description: 'Reach high-tier standing in your organization through outstanding participation.',
    howToEarn: 'Reach Level 4 by earning 600 Total XP.',
    xpReward: 200,
    unlocked: false,
    progress: { current: 450, total: 600, label: '450 / 600 XP (75%)' },
  },
  {
    id: 'streak-4',
    title: 'Friday Streak Champion',
    category: 'milestone',
    rarity: 'Rare',
    rarityColor: 'from-amber-500 to-orange-600',
    icon: '🔥',
    description: 'Attended 4 consecutive Fun Friday sessions without missing a week.',
    howToEarn: 'Check in for 4 Fridays in a row.',
    xpReward: 150,
    unlocked: true,
    unlockedAt: 'Oct 30, 2026',
  },

  // 2. Games & Buzzer
  {
    id: 'buzzer-blitz',
    title: 'Lightning Buzzer Reflex',
    category: 'game',
    rarity: 'Rare',
    rarityColor: 'from-amber-400 to-yellow-600',
    icon: '⚡',
    description: 'Locked the buzzer within 1.2 seconds of the question being displayed.',
    howToEarn: 'Be the first player to buzz in during any live game round.',
    xpReward: 100,
    unlocked: true,
    unlockedAt: 'Oct 30, 2026',
  },
  {
    id: 'detective',
    title: 'Master Liar Detective',
    category: 'game',
    rarity: 'Epic',
    rarityColor: 'from-indigo-600 to-blue-700',
    icon: '🕵️',
    description: 'Correctly identified the secret bluffer across 3 different game rounds.',
    howToEarn: 'Vote correctly for the liar in Two Truths & a Lie or Chor-Police.',
    xpReward: 150,
    unlocked: true,
    unlockedAt: 'Oct 30, 2026',
  },
  {
    id: 'melody-star',
    title: 'Antakshari Melody Star',
    category: 'game',
    rarity: 'Common',
    rarityColor: 'from-pink-500 to-rose-600',
    icon: '🎵',
    description: 'Connected 3 consecutive song words with your teammates without hesitation.',
    howToEarn: 'Lead your team in singing valid tracks in Antakshari.',
    xpReward: 75,
    unlocked: false,
    progress: { current: 2, total: 3, label: '2 / 3 Tracks Connected' },
  },
  {
    id: 'qr-hunter',
    title: 'Office QR Pathfinder',
    category: 'game',
    rarity: 'Legendary',
    rarityColor: 'from-amber-500 via-pink-500 to-purple-600',
    icon: '🗺️',
    description: 'Scanned all 5 hidden campus QR codes in the Cafeteria & Innovation Lab in under 10 minutes.',
    howToEarn: 'Complete the QR Treasure Hunt game in top 3 leaderboard position.',
    xpReward: 300,
    unlocked: false,
    progress: { current: 3, total: 5, label: '3 / 5 Hidden Codes Scanned' },
  },

  // 3. Culture & Teamwork
  {
    id: 'vibe-calibrator',
    title: 'Early Vibe Pioneer',
    category: 'culture',
    rarity: 'Common',
    rarityColor: 'from-purple-500 to-pink-500',
    icon: '✨',
    description: 'Submitted your mood check-in before the Friday session began.',
    howToEarn: 'Submit Vibe Check for any upcoming Friday session.',
    xpReward: 50,
    unlocked: true,
    unlockedAt: 'Oct 31, 2026',
  },
  {
    id: 'cross-department',
    title: 'Cross-Department Mixer',
    category: 'culture',
    rarity: 'Rare',
    rarityColor: 'from-teal-500 to-cyan-600',
    icon: '🤝',
    description: 'Played on mixed teams with colleagues from Design, Sales, and Operations.',
    howToEarn: 'Play games with team members from 3 different departments.',
    xpReward: 120,
    unlocked: false,
    progress: { current: 2, total: 3, label: '2 / 3 Departments Collaborated' },
  },
  {
    id: 'campus-verified',
    title: 'Noida HQ Campus Regular',
    category: 'culture',
    rarity: 'Common',
    rarityColor: 'from-emerald-500 to-green-600',
    icon: '📍',
    description: 'Verified your in-person presence at the office cafeteria using campus geolocation.',
    howToEarn: 'Grant browser location access and check in at office campus.',
    xpReward: 50,
    unlocked: true,
    unlockedAt: 'Oct 31, 2026',
  },
  {
    id: 'team-mvp',
    title: 'FridayQuest Grand MVP',
    category: 'culture',
    rarity: 'Legendary',
    rarityColor: 'from-rose-500 via-purple-600 to-indigo-600',
    icon: '🏆',
    description: 'Awarded highest individual contribution bonus points by the session organizer.',
    howToEarn: 'Receive Organizer Bonus points for exemplary team spirit.',
    xpReward: 250,
    unlocked: false,
    progress: { current: 1, total: 3, label: '1 / 3 MVP Nominations' },
  },
];

export default function AchievementsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: analyticsData } = usePlayerAnalytics();

  const [activeTab, setActiveTab] = useState<'all' | 'milestone' | 'game' | 'culture' | 'unlocked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const player = analyticsData?.user || user;
  const journey = analyticsData?.journeyStats || {
    xp: player?.xp || 450,
    level: player?.level || 3,
    xpToNextLevel: 150,
    progressPercent: 70,
    gamesPlayed: 5,
    wins: 2,
    badges: 6,
  };

  const unlockedCount = BADGES_CATALOG.filter((b) => b.unlocked).length;
  const totalBadges = BADGES_CATALOG.length;
  const totalEarnedXP = BADGES_CATALOG.filter((b) => b.unlocked).reduce((acc, b) => acc + b.xpReward, 0);

  const filteredBadges = BADGES_CATALOG.filter((badge) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return badge.unlocked;
    return badge.category === activeTab;
  });

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Background Wallpaper */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-10 bg-[url('/images/player/player-bg.jpg')] bg-cover bg-fixed bg-center"
        aria-hidden="true"
      />

      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
          Rank: Level {journey.level} Explorer
        </span>
      </div>

      {/* 1. HERO TROPHY BANNER CARD */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-purple-200/80 dark:border-purple-900/40 p-6 sm:p-8 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Achievements &amp; Badges Showcase
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-xl">
              Celebrate your Fun Friday milestones, unlock rare team game accolades, and earn XP to level up your FridayQuest standing.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Badges Unlocked</div>
                <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {unlockedCount} <span className="text-xs font-normal text-slate-400">/ {totalBadges}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Total XP Earned</div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {journey.xp} XP
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Badge Bonus XP</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  +{totalEarnedXP} XP
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-100 dark:border-slate-800 shadow-2xs">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Completion Rate</div>
                <div className="text-xl font-black text-amber-500 mt-0.5">
                  {Math.round((unlockedCount / totalBadges) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Level Progress Dial */}
          <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-slate-900/90 border border-purple-100 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 dark:text-white">Current Standing</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Level {journey.level}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl select-none">⭐</span>
                <div>
                  <div className="text-lg font-black text-slate-900 dark:text-white leading-none">
                    {journey.xp} XP
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {journey.xpToNextLevel} XP needed for Level {journey.level + 1}
                  </div>
                </div>
              </div>
              <span className="text-lg select-none">🚀</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${journey.progressPercent}%` }}
              />
            </div>
            <div className="text-[10px] text-right font-bold text-slate-400">
              {journey.progressPercent}% to next rank
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TABS */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Badges', count: totalBadges },
          { id: 'unlocked', label: '✓ Unlocked', count: unlockedCount },
          { id: 'milestone', label: '🏆 Milestones', count: 4 },
          { id: 'game', label: '⚡ Game & Buzzer', count: 4 },
          { id: 'culture', label: '🤝 Team & Culture', count: 4 },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. BADGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group relative rounded-3xl p-5 border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-1'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border-dashed border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Header row: Icon & Rarity Tag */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-md transition-transform duration-300 group-hover:scale-105 ${
                    badge.unlocked
                      ? `bg-gradient-to-tr ${badge.rarityColor} text-white`
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                  }`}
                >
                  <span className="select-none">{badge.icon}</span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      badge.rarity === 'Legendary'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60'
                        : badge.rarity === 'Epic'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300/60'
                        : badge.rarity === 'Rare'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300/60'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                  <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400">
                    +{badge.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {badge.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {badge.description}
                </p>
              </div>

              {/* Footer status / Progress bar */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Unlocked</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {badge.unlockedAt || 'Oct 2026'}
                    </span>
                  </div>
                ) : badge.progress ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>In Progress</span>
                      </span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {badge.progress.label}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full"
                        style={{
                          width: `${Math.round((badge.progress.current / badge.progress.total) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked • Complete challenge</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. BADGE DETAIL MODAL */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase text-slate-400">Badge Details</span>
              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3">
              <div
                className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-xl ${
                  selectedBadge.unlocked
                    ? `bg-gradient-to-tr ${selectedBadge.rarityColor} text-white`
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                }`}
              >
                {selectedBadge.icon}
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedBadge.title}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                    +{selectedBadge.xpReward} XP Reward
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {selectedBadge.rarity} Rarity
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                {selectedBadge.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1 text-xs">
              <div className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase">
                How to unlock:
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                {selectedBadge.howToEarn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-black transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

