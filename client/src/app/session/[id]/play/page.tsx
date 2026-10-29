'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, Eye, EyeOff, Bell, Trophy, ArrowLeft, Play, Pause, FastForward, Award } from 'lucide-react';
import { connectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiRequest } from '@/lib/api';

export default function LivePlayPage() {
  const params = useParams();
  const router = useRouter();
  const idOrCode = params.id as string;
  const user = useAuthStore((s) => s.user);

  const [session, setSession] = useState<any>(null);
  const [liveState, setLiveState] = useState<any>({
    currentGame: null,
    stepIdx: 0,
    round: 1,
    timers: { running: false, durationSec: 0 },
    scores: {},
    buzzerState: { locked: false },
    paused: false,
    status: 'waiting',
  });

  const [assignedRole, setAssignedRole] = useState<{ roleKey: string; roleLabel: string } | null>(null);
  const [revealingRole, setRevealingRole] = useState(false);
  const [buzzedFirst, setBuzzedFirst] = useState<string | null>(null);
  const [remainingSec, setRemainingSec] = useState<number>(0);

  // 1. Fetch Session by id or joinCode
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
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSession();
  }, [idOrCode]);

  // 2. Connect Socket.io
  useEffect(() => {
    if (!session?._id) return;

    const socket = connectSocket();

    socket.emit('session:join', { sessionId: session._id });

    socket.on('state:update', (data: any) => {
      setLiveState((prev: any) => ({ ...prev, ...data }));
    });

    socket.on('role:assigned', (data: any) => {
      setAssignedRole(data);
    });

    socket.on('buzzer:locked', (data: any) => {
      setBuzzedFirst(data.userName || data.userId);
    });

    socket.on('session:ended', () => {
      alert('Session has ended! Redirecting to dashboard...');
      router.push('/dashboard');
    });

    return () => {
      socket.off('state:update');
      socket.off('role:assigned');
      socket.off('buzzer:locked');
      socket.off('session:ended');
    };
  }, [session, router]);

  // 3. Countdown timer tick
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

  // Socket actions
  const handleBuzz = () => {
    const socket = getSocket();
    socket.emit('player:action', {
      sessionId: session._id,
      type: 'buzz',
    });
  };

  const handleHostNext = () => {
    const socket = getSocket();
    socket.emit('host:next', { sessionId: session._id });
  };

  const handleHostPause = () => {
    const socket = getSocket();
    socket.emit('host:pause', { sessionId: session._id });
  };

  const isOrganizer = user?.role === 'orgAdmin' || user?.role === 'organizer' || user?.role === 'superAdmin';

  return (
    <div className="flex-1 max-w-xl mx-auto w-full p-4 sm:p-6 flex flex-col justify-between select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <Link href="/dashboard" className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Live Fun Friday
            </div>
            <div className="text-sm font-bold text-white truncate max-w-[200px]">
              {session?.title || 'Game Room'}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
              {session?.joinCode || idOrCode}
            </span>
          </div>
        </div>

        {/* Current Game & Round */}
        <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Round {liveState.round || 1}</span>
            <span className="font-semibold text-blue-400">Step {liveState.stepIdx + 1}</span>
          </div>

          <h2 className="text-xl font-extrabold text-white">
            {liveState.currentGame?.gameName || 'Game Starting Soon'}
          </h2>

          {/* Synchronized Server Timer */}
          {liveState.timers?.running && (
            <div className="mt-4 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-3xl font-mono font-black tracking-wider text-white">
                {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:
                {String(remainingSec % 60).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center Tool Arena (Adapts dynamically to the active tool) */}
      <div className="my-6 space-y-4">
        {/* Secret Role Card Tool */}
        {assignedRole && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-3 shadow-xl">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Secret Role Card
            </div>

            <div
              onMouseDown={() => setRevealingRole(true)}
              onMouseUp={() => setRevealingRole(false)}
              onTouchStart={() => setRevealingRole(true)}
              onTouchEnd={() => setRevealingRole(false)}
              className="cursor-pointer py-8 px-4 rounded-xl border-2 border-dashed border-purple-500/50 bg-purple-950/20 active:bg-purple-900/40 transition-all flex flex-col items-center justify-center gap-2"
            >
              {revealingRole ? (
                <>
                  <Eye className="w-6 h-6 text-purple-300" />
                  <div className="text-2xl font-black text-white">{assignedRole.roleLabel}</div>
                  <div className="text-[11px] text-purple-300">Keep it secret from others!</div>
                </>
              ) : (
                <>
                  <EyeOff className="w-6 h-6 text-purple-400" />
                  <div className="text-sm font-bold text-purple-200">Press & Hold to Reveal Role</div>
                  <div className="text-[10px] text-slate-400">Hides when released</div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Buzzer Tool */}
        <div className="text-center">
          <button
            onClick={handleBuzz}
            disabled={liveState.buzzerState?.locked || liveState.paused}
            className={`w-40 h-40 mx-auto rounded-full font-black text-xl uppercase tracking-wider shadow-2xl flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 ${
              liveState.buzzerState?.locked
                ? 'bg-slate-800 text-slate-500 border-4 border-slate-700 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white border-4 border-red-400 shadow-red-600/50 animate-bounce'
            }`}
          >
            <Bell className="w-10 h-10" />
            <span>{liveState.buzzerState?.locked ? 'Locked' : 'BUZZ!'}</span>
          </button>

          {liveState.buzzerState?.locked && (
            <div className="mt-3 text-xs text-amber-400 font-semibold">
              First to buzz: {buzzedFirst || liveState.buzzerState?.lockedByUserName || 'Player'}
            </div>
          )}
        </div>
      </div>

      {/* Organizer Host Control Bar */}
      {isOrganizer && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 text-center">
            Organizer Host Panel
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleHostPause}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {liveState.paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {liveState.paused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleHostNext}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
            >
              <FastForward className="w-3.5 h-3.5" /> Next Step
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
