'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Tv, Search } from 'lucide-react';
import { connectSocket } from '@/lib/socket';

interface MobileExperienceShowcaseProps {
  nextSession: any;
  liveBuzzerLocked: boolean;
  buzzerWinner: string;
  liveScores: Record<string, number>;
  onLiveBuzz: () => void;
  onResetBuzzer: () => void;
}

export default function MobileExperienceShowcase({
  nextSession,
  liveBuzzerLocked,
  buzzerWinner,
  liveScores,
  onLiveBuzz,
  onResetBuzzer,
}: MobileExperienceShowcaseProps) {
  const joinCode = nextSession?.joinCode || 'KIRXA-DEMO';
  const [secretRoleRevealed, setSecretRoleRevealed] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState<string | null>('Amit (Engineering)');
  const [voteSubmittedLive, setVoteSubmittedLive] = useState(false);

  const handleLiveVote = () => {
    if (!votedCandidate) return;
    const socket = connectSocket();
    socket.emit('player:action', {
      sessionId: nextSession?._id || 'default-session-1',
      type: 'vote',
      payload: { targetId: votedCandidate },
    });
    setVoteSubmittedLive(true);
    setTimeout(() => setVoteSubmittedLive(false), 3000);
  };

  return (
    <section className="mt-8 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>📱</span>
            <span>Mobile Experience & Live Game Screen Previews</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Player phones act as physical controllers; the Cafeteria TV Projector provides real-time audience visuals.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/session/${joinCode}/play`}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Live Player</span>
          </Link>
          <Link
            href={`/session/${joinCode}/screen`}
            className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Open Projector TV</span>
          </Link>
        </div>
      </div>

      {/* Row 1: 4 Phones (Home, Vibe Check, Game Library, Live Game Player) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phone 1: Mobile Experience (Player Home) */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[380px]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
            <span className="font-mono font-bold">9:41</span>
            <span className="font-bold text-[9px] uppercase tracking-wider text-blue-400">Player Home</span>
            <span>📶 100%</span>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-700/40">
              <div className="text-[10px] text-blue-300 font-bold">👋 Hi, Kirxa!</div>
              <div className="text-sm font-black text-white mt-0.5 leading-tight">Ready for Fun Friday?</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold uppercase text-blue-400">Next Friday Event</div>
              <div className="text-xs font-black text-white">Fun Friday Kickoff 🎉</div>
              <div className="text-[10px] text-slate-400">Oct 30 • Cafeteria, Noida</div>
              <Link
                href={`/session/${joinCode}/play`}
                className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
              >
                Join Event
              </Link>
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Mobile Experience (Player)
          </div>
        </div>

        {/* Phone 2: Vibe Check Screen */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[380px]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
            <span className="font-mono font-bold">9:41</span>
            <span className="font-bold text-[9px] uppercase tracking-wider text-orange-400">Vibe Check</span>
            <span>📶 100%</span>
          </div>
          <div className="space-y-3 p-1 text-center">
            <div>
              <div className="text-xs font-black text-white">Vibe Check</div>
              <div className="text-[10px] text-slate-400 mt-0.5">How are you feeling?</div>
            </div>
            <div className="flex items-center justify-center gap-2 py-1 text-xl">
              {['🤩', '😄', '🙂', '😴', '🧠'].map((emoji, idx) => (
                <span
                  key={idx}
                  className="p-1 rounded-xl bg-slate-900 border border-slate-800 hover:scale-110 transition-transform cursor-pointer"
                >
                  {emoji}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[10px]">
              <button type="button" className="py-1 rounded-lg bg-blue-600 text-white font-bold">
                Active
              </button>
              <button type="button" className="py-1 rounded-lg bg-slate-900 text-slate-300 font-bold">
                Calm
              </button>
              <button type="button" className="py-1 rounded-lg bg-slate-900 text-slate-300 font-bold">
                Brainy
              </button>
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Vibe Check
          </div>
        </div>

        {/* Phone 3: Game Library Screen (Matches Image 1) */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[380px]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
            <span className="font-mono font-bold">9:41</span>
            <span className="font-bold text-[9px] uppercase tracking-wider text-purple-400">Game Library</span>
            <span>📶 100%</span>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search games..."
                readOnly
                value=""
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-[10px] text-white placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto text-[9px] font-bold pb-1">
              <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white shrink-0">All</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 shrink-0">Popular</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 shrink-0">Indoor</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 shrink-0">Team</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold flex items-center gap-1">
                  <span>👑</span>
                  <span>Chor-Police</span>
                </span>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-900/40">
                  High Energy
                </span>
              </div>
              <div className="text-[9px] text-slate-400">20 min • 6+ players</div>
              <Link
                href="/games"
                className="w-full py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold block text-center mt-1"
              >
                Select Game
              </Link>
            </div>
          </div>
          <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Game Library
          </div>
        </div>

        {/* Phone 4: Live Game - Player Buzzer */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[380px]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
            <span className="font-mono font-bold">9:41</span>
            <span className="font-bold text-[9px] uppercase tracking-wider text-rose-400">Live Game</span>
            <span>📶 100%</span>
          </div>
          <div className="space-y-2 text-center">
            <div className="text-xs font-black text-white">Two Truths & a Lie</div>
            <div className="text-[10px] text-slate-400">Round 1/5</div>
            <div className="font-mono text-2xl font-black text-amber-400">00:15</div>
            {/* Tactile Live Buzzer Button */}
            <button
              type="button"
              onClick={onLiveBuzz}
              disabled={liveBuzzerLocked}
              className={`w-28 h-28 mx-auto my-1.5 rounded-full font-black text-base transition-transform flex flex-col items-center justify-center border-4 uppercase tracking-wider cursor-pointer ${
                liveBuzzerLocked
                  ? 'bg-gradient-to-tr from-amber-600 to-red-600 text-white shadow-lg shadow-red-500/50 border-amber-300 scale-95 animate-pulse'
                  : 'bg-gradient-to-tr from-rose-600 via-red-500 to-rose-400 text-white shadow-lg shadow-rose-600/50 hover:scale-105 active:scale-95 border-red-300/40'
              }`}
            >
              <span>{liveBuzzerLocked ? 'LOCKED!' : 'BUZZER'}</span>
              {liveBuzzerLocked && (
                <span className="text-[8px] normal-case font-bold">{buzzerWinner || 'Locked'}</span>
              )}
            </button>
            {liveBuzzerLocked && (
              <button
                type="button"
                onClick={onResetBuzzer}
                className="text-[10px] text-amber-400 font-bold hover:underline cursor-pointer"
              >
                ↺ Reset Buzzer
              </button>
            )}
          </div>
          <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Live Game - Player
          </div>
        </div>
      </div>

      {/* Row 2: 4 Screens (Secret Role Card, Voting Screen, Projector TV View, Profile & Achievements) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Phone 5: Secret Role Card */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[360px]">
          <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
            <span className="font-mono font-bold">9:41</span>
            <span className="font-bold text-[9px] uppercase tracking-wider text-amber-400">Secret Role</span>
            <span>📶 100%</span>
          </div>
          <div
            onMouseDown={() => setSecretRoleRevealed(true)}
            onMouseUp={() => setSecretRoleRevealed(false)}
            onTouchStart={() => setSecretRoleRevealed(true)}
            onTouchEnd={() => setSecretRoleRevealed(false)}
            className="p-3 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-900 border border-amber-500/30 text-center space-y-2 select-none cursor-pointer transition-all active:border-amber-400 active:scale-95"
          >
            <div className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">Your Role</div>
            {secretRoleRevealed ? (
              <div className="space-y-1 animate-in zoom-in-95 duration-150">
                <div className="text-3xl animate-bounce">🕵️‍♂️</div>
                <div className="text-sm font-black text-amber-300">Detective</div>
                <p className="text-[10px] text-slate-200 leading-tight">Find the liar in your team before time runs out!</p>
                <div className="py-1 px-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                  ● REVEALED (Release to hide)
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <div className="text-3xl opacity-50">🔒</div>
                <div className="text-xs font-bold text-slate-400">Classified Role</div>
                <div className="py-1 px-2 rounded-lg bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                  Press & hold to reveal
                </div>
              </div>
            )}
          </div>
          <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider">
            Secret Role Card
          </div>
        </div>

        {/* Phone 6: Voting Screen */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
              <span className="font-mono font-bold">9:41</span>
              <span className="font-bold text-[9px] uppercase tracking-wider text-purple-400">Voting Screen</span>
              <span>📶 100%</span>
            </div>
            <div className="mt-2 text-center">
              <div className="text-xs font-black text-white">Who is the Liar? 🤔</div>
              <div className="text-[10px] text-slate-400">Select one candidate</div>
            </div>
            <div className="space-y-1.5 mt-2.5 text-xs">
              {['Amit (Engineering)', 'Neha (Marketing)', 'Rahul (Product)'].map((nom, i) => (
                <label
                  key={i}
                  onClick={() => setVotedCandidate(nom)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border transition-colors cursor-pointer ${
                    votedCandidate === nom ? 'border-purple-500 bg-purple-950/20' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="mock_vote"
                    checked={votedCandidate === nom}
                    onChange={() => setVotedCandidate(nom)}
                    className="text-purple-600 focus:ring-0"
                  />
                  <span className="text-slate-200 font-medium text-xs">{nom}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={handleLiveVote}
              className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {voteSubmittedLive ? '✓ Vote Recorded!' : 'Submit Vote'}
            </button>
            <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-2">
              Voting Screen
            </div>
          </div>
        </div>

        {/* Screen 7: Projector TV View (Large Screen) */}
        <div className="bg-[#060a14] text-white rounded-3xl p-3 border-4 border-blue-900/60 shadow-2xl flex flex-col justify-between space-y-3 min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[10px] text-blue-400 border-b border-blue-950 pb-1.5">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1">
                <Tv className="w-3 h-3" /> Projector TV View
              </span>
              <span className="font-mono text-emerald-400 font-bold">LIVE ON TV</span>
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-black text-white">Two Truths & a Lie</div>
              <div className="text-[10px] text-slate-400">Round 2/5 • Guessing Phase</div>
              <div className="font-mono text-2xl font-black text-amber-400 mt-1">00:15</div>
              {liveBuzzerLocked && (
                <div className="mt-1 p-1 rounded-lg bg-rose-950/80 border border-rose-500 text-rose-300 text-[10px] font-bold animate-pulse">
                  🚨 BUZZER LOCKED: {buzzerWinner || 'Player'}!
                </div>
              )}
            </div>
            {/* Leaderboard Chips */}
            <div className="grid grid-cols-4 gap-1 mt-2.5 text-center">
              {[
                { team: 'Team Alpha', score: liveScores['Team Alpha'] ?? 80, color: 'bg-emerald-950 text-emerald-400 border-emerald-800' },
                { team: 'Team Bravo', score: liveScores['Team Bravo'] ?? 60, color: 'bg-blue-950 text-blue-400 border-blue-800' },
                { team: 'Team Charlie', score: liveScores['Team Charlie'] ?? 40, color: 'bg-purple-950 text-purple-400 border-purple-800' },
                { team: 'Team Delta', score: liveScores['Team Delta'] ?? 20, color: 'bg-amber-950 text-amber-400 border-amber-800' },
              ].map((t, idx) => (
                <div key={idx} className={`p-1 rounded-xl border ${t.color}`}>
                  <div className="text-[8px] font-bold line-clamp-1">{t.team}</div>
                  <div className="text-xs font-black font-mono">{t.score}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Link
              href={`/session/${joinCode}/screen`}
              className="text-center text-[10px] font-bold text-blue-400 hover:underline block"
            >
              Open Fullscreen TV Mode →
            </Link>
            <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-2">
              Projector TV View (Large Screen)
            </div>
          </div>
        </div>

        {/* Phone 8: Profile & Achievements */}
        <div className="bg-slate-950 text-white rounded-3xl p-3 border-4 border-slate-800 shadow-xl flex flex-col justify-between space-y-3 min-h-[360px]">
          <div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 border-b border-slate-800/80 pb-1.5">
              <span className="font-mono font-bold">9:41</span>
              <span className="font-bold text-[9px] uppercase tracking-wider text-emerald-400">Profile & Badges</span>
              <span>📶 100%</span>
            </div>
            <div className="text-center mt-2">
              <div className="w-9 h-9 mx-auto rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs shadow-md">
                KI
              </div>
              <div className="text-xs font-black text-white mt-1">Kirxa</div>
              <div className="text-[10px] text-emerald-400 font-bold">Level 3 • Explorer</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 mt-2 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Total XP</span>
                <span className="font-black text-white font-mono">350 XP</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[70%]"></div>
              </div>
              <div className="text-[8px] text-slate-500 text-right">150 XP to Level 4</div>
            </div>
          </div>
          <div>
            <Link
              href="/roles"
              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-center rounded-xl text-xs font-bold text-slate-300 border border-slate-800 block"
            >
              View All Badges
            </Link>
            <div className="text-center text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-2">
              Profile & Achievements
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

