'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, Trophy, Flame, Bell } from 'lucide-react';
import { connectSocket } from '@/lib/socket';
import { apiRequest } from '@/lib/api';

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
    status: 'waiting',
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [remainingSec, setRemainingSec] = useState<number>(0);

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
        console.error(err);
      }
    };
    fetchSession();
  }, [idOrCode]);

  const loadScores = async (sessionId: string) => {
    try {
      const res = await apiRequest(`/sessions/${sessionId}/scores`);
      if (res.success && res.data?.teamLeaderboard) {
        setLeaderboard(res.data.teamLeaderboard);
      }
    } catch {}
  };

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

    return () => {
      socket.off('state:update');
      socket.off('score:update');
    };
  }, [session]);

  // Countdown tick
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

  return (
    <div className="min-h-screen bg-[#070a12] text-white p-8 flex flex-col justify-between">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/40">
            FQ
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{session?.title || 'FridayQuest Live'}</h1>
            <p className="text-sm text-slate-400">Join on your phone with code:</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border-2 border-blue-500/50 rounded-2xl px-6 py-2.5 shadow-2xl">
            <span className="font-mono text-3xl font-black tracking-widest text-blue-400">
              {session?.joinCode || idOrCode}
            </span>
          </div>
        </div>
      </div>

      {/* Main TV Center Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 my-auto items-center">
        {/* Game and Timer (2 cols on desktop) */}
        <div className="lg:col-span-2 col-span-1 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest font-bold text-blue-400">
            <Flame className="w-5 h-5 text-orange-400" />
            Round {liveState.round || 1} • Step {liveState.stepIdx + 1}
          </div>

          <h2 className="text-5xl font-black tracking-tight text-white">
            {liveState.currentGame?.gameName || 'Waiting for Game to Start'}
          </h2>

          {/* Huge Synchronized Timer */}
          {liveState.timers?.running && (
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-3xl bg-slate-950 border border-slate-800 shadow-inner">
              <Clock className="w-10 h-10 text-blue-400" />
              <span className="text-7xl font-mono font-black tracking-wider text-white">
                {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:
                {String(remainingSec % 60).padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Buzzer Announcement on TV */}
          {liveState.buzzerState?.locked && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-950/60 border border-amber-800 text-amber-300 text-lg font-bold animate-pulse">
              <Bell className="w-6 h-6 text-amber-400" />
              First to buzz: {liveState.buzzerState?.lockedByUserName || 'Player'}
            </div>
          )}
        </div>

        {/* Live Leaderboard (1 col) */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-sm uppercase tracking-wider font-bold text-slate-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            Live Standings
          </div>

          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <div className="text-slate-500 text-sm py-6 text-center">Scores will update live.</div>
            ) : (
              leaderboard.map((team, idx) => (
                <div
                  key={team.id || idx}
                  className="flex items-center justify-between p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-500 w-4">{idx + 1}</span>
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: team.color || '#3B82F6' }}
                    />
                    <span className="font-semibold text-white text-sm">{team.name}</span>
                  </div>
                  <span className="font-mono font-bold text-base text-amber-400">
                    {team.total} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* TV Screen Footer */}
      <div className="text-center text-xs text-slate-500 border-t border-slate-900 pt-4">
        FridayQuest • Projector Screen Mode • Auto-refreshes in real-time
      </div>
    </div>
  );
}
