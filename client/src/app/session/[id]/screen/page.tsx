'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Clock,
  Trophy,
  Flame,
  Bell,
  Users,
  Radio,
  Tv,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { connectSocket } from '@/lib/socket';
import { apiRequest } from '@/lib/api';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function ProjectorScreenPage() {
  const params = useParams();
  const idOrCode = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [liveState, setLiveState] = useState<any>({
    currentGame: null,
    stepIdx: 0,
    round: 1,
    timers: { running: false, durationSec: 0 },
    scores: {},
    buzzerState: { locked: false },
    status: 'in_progress',
    paused: false,
  });

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [remainingSec, setRemainingSec] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Fetch Session by joinCode or ID
  useEffect(() => {
    const fetchSession = async () => {
      try {
        let res;
        if (idOrCode.length <= 8) {
          res = await apiRequest(`/sessions/join/${idOrCode}`);
        } else {
          res = await apiRequest(`/sessions/${idOrCode}`);
        }
        if (res.success && res.data) {
          setSession(res.data);
          loadScores(res.data._id);
        }
      } catch (err) {
        console.error('Error fetching session:', err);
      }
    };
    fetchSession();
  }, [idOrCode]);

  // 2. Load authoritative leaderboard scores
  const loadScores = async (sessionId: string) => {
    try {
      const res = await apiRequest(`/sessions/${sessionId}/scores`);
      if (res.success && res.data?.teamLeaderboard) {
        setLeaderboard(res.data.teamLeaderboard);
      }
    } catch {
      // Fallback sample teams if no scores yet
      setLeaderboard([
        { rank: 1, teamName: 'Team Alpha (Vikram & Riya)', totalPoints: 350 },
        { rank: 2, teamName: 'Team Beta (Kabir & Ananya)', totalPoints: 280 },
        { rank: 3, teamName: 'Team Gamma (Dev & Sneha)', totalPoints: 190 },
      ]);
    }
  };

  // 3. Connect Socket.IO in read-only projector mode
  useEffect(() => {
    if (!session?._id) return;

    const socket = connectSocket();
    socket.emit('session:join', { sessionId: session._id });

    socket.on('state:update', (data: any) => {
      setLiveState((prev: any) => ({ ...prev, ...data }));
    });

    socket.on('score:update', () => {
      loadScores(session._id);
    });

    socket.on('buzzer:locked', (data: { userName?: string; winnerName?: string }) => {
      setLiveState((prev: any) => ({
        ...prev,
        buzzerState: {
          locked: true,
          lockedByUserName: data.winnerName || data.userName || 'A Player',
        },
      }));
    });

    socket.on('buzzer:reset', () => {
      setLiveState((prev: any) => ({
        ...prev,
        buzzerState: { locked: false },
      }));
    });

    return () => {
      socket.off('state:update');
      socket.off('score:update');
      socket.off('buzzer:locked');
      socket.off('buzzer:reset');
    };
  }, [session]);

  // 4. Synchronized countdown timer
  useEffect(() => {
    if (!liveState.timers?.endsAt || !liveState.timers?.running || liveState.paused) {
      return;
    }

    const interval = setInterval(() => {
      const endsAtTime = new Date(liveState.timers.endsAt).getTime();
      const diff = Math.max(0, Math.ceil((endsAtTime - Date.now()) / 1000));
      setRemainingSec(diff);
    }, 500);

    return () => clearInterval(interval);
  }, [liveState.timers, liveState.paused]);

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isBuzzerLocked = liveState.buzzerState?.locked;
  const isTimerRunning = liveState.timers?.running;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between select-none font-sans overflow-hidden">
      {/* 1. Projector Top Bar: Brand, Session Name, and Huge Join Code */}
      <header className="flex items-center justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-2xl text-white shadow-xl shadow-blue-500/30">
            FQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                Projector TV View
              </span>
              <span className="text-xs text-slate-400">
                • {liveState.paused ? 'Session Paused' : 'Live Game'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              {session?.title || 'FridayQuest Live Fun Friday'}
            </h1>
          </div>
        </div>

        {/* Room Code Display for Audience / Room Viewers */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Join with room code
            </div>
            <div className="text-xs text-slate-300">Open on your phone browser</div>
          </div>

          <div className="bg-slate-900 border-2 border-blue-500/60 rounded-2xl px-6 py-2.5 shadow-2xl flex items-center gap-3">
            <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-blue-400">
              {session?.joinCode || idOrCode}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Stage: Split Layout for Projector / TV Screen */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-auto items-stretch py-8">
        {/* Left Arena: Game Details, Huge Countdown, and Live Event Alerts (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col justify-between space-y-8 backdrop-blur-md">
          {/* Round & Step Badges */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                Round {liveState.round || 1} • Step {liveState.stepIdx + 1}
              </span>

              {liveState.paused && (
                <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
                  Paused by Host
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Synchronized Room Experience
            </div>
          </div>

          {/* Current Game Title */}
          <div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              {liveState.currentGame?.gameName || 'Activity in Progress'}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2">
              All players use their phones as interactive buzzers, role cards, and voting remotes!
            </p>
          </div>

          {/* Huge Synchronized Countdown Display */}
          <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-inner">
            <div className="flex items-center gap-4">
              <Clock className="w-12 h-12 text-blue-400 shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Room Timer
                </div>
                <div className="text-sm text-slate-300">
                  {isTimerRunning ? 'Time remaining for current step' : 'Timer on standby'}
                </div>
              </div>
            </div>

            <div className="font-mono text-6xl sm:text-8xl font-black tracking-widest text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:
              {String(remainingSec % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Dynamic Live Announcements (Buzzer, Voting, Discussion) */}
          {isBuzzerLocked ? (
            <div className="p-6 rounded-2xl bg-amber-500/20 border-2 border-amber-500 text-amber-300 flex items-center gap-4 shadow-xl animate-pulse">
              <Bell className="w-10 h-10 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Buzzer Winner
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  🚨 {liveState.buzzerState?.lockedByUserName || 'A Player'} BUZZED FIRST! 🚨
                </div>
                <div className="text-xs text-amber-200 mt-0.5">
                  Listen to their verbal answer now!
                </div>
              </div>
            </div>
          ) : liveState.votesCount && liveState.votesCount > 0 ? (
            <div className="p-5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center gap-3">
              <Radio className="w-6 h-6 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-base">
                  🗳️ {liveState.votesCount} Votes Recorded
                </span>
                <span className="text-xs text-indigo-200 ml-2">
                  Cast votes on your phone now!
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-slate-400 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Phones active & synchronized with host device.
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                100% Offline-First Architecture
              </span>
            </div>
          )}
        </div>

        {/* Right Arena: Live Team Leaderboard (1 col) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-black uppercase tracking-wider text-white">
                Team Standings
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Live Scores</span>
          </div>

          {/* Leaderboard Ranks */}
          <div className="space-y-3 flex-1">
            {leaderboard.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                Scores will appear as rounds are completed.
              </div>
            ) : (
              leaderboard.map((team, idx) => {
                const rank = team.rank || idx + 1;
                const isGold = rank === 1;
                const isSilver = rank === 2;
                const isBronze = rank === 3;

                return (
                  <div
                    key={team.teamName || idx}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isGold
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-1 ring-amber-500/20'
                        : isSilver
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                        : isBronze
                        ? 'bg-amber-900/20 border-amber-900/40 text-amber-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
                          isGold
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                            : isSilver
                            ? 'bg-slate-300 text-slate-900'
                            : isBronze
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                      </div>

                      <div>
                        <div className="font-extrabold text-sm sm:text-base text-white truncate max-w-[160px]">
                          {team.teamName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {isGold ? 'Leading the room!' : `Rank #${rank}`}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono text-xl sm:text-2xl font-black text-white">
                      {team.totalPoints}
                      <span className="text-[10px] uppercase font-sans text-slate-400 ml-1">
                        pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Tip for Room Audience */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 text-center">
            Scores update live after each round or host bonus award!
          </div>
        </div>
      </main>

      {/* 3. Projector Footer: Room Stats & Read-only Indicator */}
      <footer className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-300">Live Game Engine</span>
          <span>• Projector Read-Only View</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono">FridayQuest v1.0 MVP</span>
        </div>
      </footer>
    </div>
  );
}
