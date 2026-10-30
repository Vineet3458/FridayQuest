'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Clock,
  Eye,
  EyeOff,
  Bell,
  Trophy,
  ArrowLeft,
  Play,
  Pause,
  FastForward,
  Award,
  Lock,
  CheckCircle,
  HelpCircle,
  Radio,
  SkipForward,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Users,
  Shield,
  Volume2,
} from 'lucide-react';
import { connectSocket, getSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLiveSessionStore } from '@/stores/useLiveSessionStore';
import { apiRequest } from '@/lib/api';

export default function LivePlayPage() {
  const params = useParams();
  const router = useRouter();
  const idOrCode = params.id as string;
  const user = useAuthStore((s) => s.user);

  // Zustand Live Session Store
  const {
    sessionData,
    currentGame,
    stepIdx,
    round,
    timers,
    remainingSec,
    buzzerState,
    assignedRole,
    paused,
    status,
    connectionStatus,
    setSessionData,
    setPublicState,
    setAssignedRole,
    setRemainingSec,
    setConnectionStatus,
  } = useLiveSessionStore();

  // Local interaction states
  const [revealingRole, setRevealingRole] = useState(false);
  const [selectedVoteTarget, setSelectedVoteTarget] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [secretWord, setSecretWord] = useState<string | null>(null);

  // Host modal dialogs
  const [hostPanelOpen, setHostPanelOpen] = useState(false);
  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [awardPoints, setAwardPoints] = useState(50);
  const [awardReason, setAwardReason] = useState('Great Teamwork');
  const [awardTargetId, setAwardTargetId] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Debounce ref to avoid duplicate buzzer clicks
  const lastActionTime = useRef<number>(0);

  const isOrganizer =
    user?.role === 'orgAdmin' || user?.role === 'organizer' || user?.role === 'superAdmin';

  // 1. Fetch Session details (by MongoDB id or join code)
  useEffect(() => {
    let isMounted = true;
    const fetchSession = async () => {
      try {
        let res;
        if (idOrCode.length <= 8) {
          res = await apiRequest(`/sessions/join/${idOrCode}`);
        } else {
          res = await apiRequest(`/sessions/${idOrCode}`);
        }
        if (isMounted && res.success && res.data) {
          setSessionData(res.data);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      }
    };
    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [idOrCode, setSessionData]);

  // 2. Connect Socket.IO & listen for authoritative events
  useEffect(() => {
    if (!sessionData?._id) return;

    setConnectionStatus('connecting');
    const socket = connectSocket();

    const joinPayload = { sessionId: sessionData._id };
    socket.emit('session:join', joinPayload);

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('session:join', joinPayload);
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('state:update', (data: any) => {
      setPublicState(data);
    });

    socket.on('timer:tick', (data: { remainingSec: number }) => {
      setRemainingSec(data.remainingSec);
    });

    socket.on('role:assigned', (data: { roleKey: string; roleLabel: string; secretValue?: string }) => {
      setAssignedRole(data);
      if (data.secretValue) {
        setSecretWord(data.secretValue);
      }
    });

    socket.on('buzzer:locked', (data: { userId?: string; userName?: string; winnerName?: string }) => {
      setPublicState({
        buzzerState: {
          locked: true,
          lockedByUserId: data.userId,
          lockedByUserName: data.winnerName || data.userName || 'A Player',
        },
      });
    });

    socket.on('buzzer:reset', () => {
      setPublicState({
        buzzerState: { locked: false },
      });
    });

    socket.on('game:ended', () => {
      setAssignedRole(null);
      setSecretWord(null);
      setHasVoted(false);
      setSelectedVoteTarget(null);
    });

    socket.on('session:ended', () => {
      router.push('/dashboard');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('state:update');
      socket.off('timer:tick');
      socket.off('role:assigned');
      socket.off('buzzer:locked');
      socket.off('buzzer:reset');
      socket.off('game:ended');
      socket.off('session:ended');
    };
  }, [sessionData?._id, setPublicState, setAssignedRole, setRemainingSec, setConnectionStatus, router]);

  // 3. Local countdown timer fallback
  useEffect(() => {
    if (!timers?.running || paused || !timers?.endsAt) {
      return;
    }

    const interval = setInterval(() => {
      const endsAtTime = new Date(timers.endsAt!).getTime();
      const diff = Math.max(0, Math.ceil((endsAtTime - Date.now()) / 1000));
      setRemainingSec(diff);
    }, 500);

    return () => clearInterval(interval);
  }, [timers, paused, setRemainingSec]);

  // 4. Socket Player Actions
  const handleBuzz = () => {
    const now = Date.now();
    if (now - lastActionTime.current < 400) return; // Prevent duplicate rapid taps
    lastActionTime.current = now;

    if (buzzerState.locked || paused || !sessionData?._id) return;

    // Haptic vibration on devices supporting navigator.vibrate
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([60, 40, 60]);
    }

    const socket = getSocket();
    socket.emit('player:action', {
      sessionId: sessionData._id,
      type: 'buzz',
    });
  };

  const handleVote = (targetId: string) => {
    if (hasVoted || !sessionData?._id) return;
    setSelectedVoteTarget(targetId);
    setHasVoted(true);

    const socket = getSocket();
    socket.emit('player:action', {
      sessionId: sessionData._id,
      type: 'vote',
      payload: { targetId },
    });
  };

  // 5. Host Organizer Actions
  const handleHostNext = () => {
    if (!sessionData?._id) return;
    const socket = getSocket();
    socket.emit('host:next', { sessionId: sessionData._id });
  };

  const handleHostPause = () => {
    if (!sessionData?._id) return;
    const socket = getSocket();
    socket.emit('host:pause', { sessionId: sessionData._id });
  };

  const handleHostResetBuzzer = () => {
    if (!sessionData?._id) return;
    const socket = getSocket();
    socket.emit('host:reset_buzzer', { sessionId: sessionData._id });
  };

  const handleHostSkipGame = () => {
    setConfirmDialog({
      open: true,
      title: 'Skip to Next Game?',
      description: 'This will instantly conclude the current activity and advance to the next agenda item.',
      onConfirm: () => {
        const socket = getSocket();
        socket.emit('host:skip', { sessionId: sessionData?._id });
        setConfirmDialog(null);
      },
    });
  };

  const handleHostEndSession = () => {
    setConfirmDialog({
      open: true,
      title: 'End Fun Friday Session?',
      description: 'This will finalize all scores and conclude the entire event for all connected participants.',
      onConfirm: () => {
        const socket = getSocket();
        socket.emit('host:end', { sessionId: sessionData?._id });
        setConfirmDialog(null);
      },
    });
  };

  const handleHostAwardPoints = () => {
    if (!sessionData?._id) return;
    const socket = getSocket();
    socket.emit('host:award', {
      sessionId: sessionData._id,
      targetId: awardTargetId || 'winner',
      points: awardPoints,
      reason: awardReason,
    });
    setAwardModalOpen(false);
  };

  // Determine current active tool & visual state
  const isBuzzerLocked = buzzerState.locked;
  const isLockedByMe = isBuzzerLocked && buzzerState.lockedByUserId === user?.id;

  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 py-4 sm:py-6 flex flex-col justify-between select-none">
      {/* 1. Header Bar: Room Info & Connection Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <Link
            href="/dashboard"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Leave Game Room"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : connectionStatus === 'connecting'
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              ></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {connectionStatus === 'connected' ? 'Live Session Room' : 'Reconnecting...'}
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate max-w-[220px]">
              {sessionData?.title || 'Fun Friday Room'}
            </h1>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {sessionData?.joinCode || idOrCode}
            </span>
          </div>
        </div>

        {/* 2. Current Game Banner & Round Indicator */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Round {round || 1}
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-800/40">
              Step {stepIdx + 1}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentGame?.gameName || 'Activity in Progress'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Play together in the room. Your phone is your game prop!
              </p>
            </div>

            {paused && (
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800 shrink-0">
                Paused
              </span>
            )}
          </div>

          {/* Synchronized Large Countdown Timer */}
          {timers?.running && (
            <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-wider text-slate-900 dark:text-white">
                {String(Math.floor(remainingSec / 60)).padStart(2, '0')}:
                {String(remainingSec % 60).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Center Game Tool Arena (Adapts to Active Tool) */}
      <div className="my-5 space-y-4">
        {/* Tool A: Face-Down Secret Role Card (Press & Hold) */}
        {assignedRole && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Secret Role Card
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Private to you</span>
            </div>

            {/* Tactile Press-and-Hold Card with Subtle Reveal Animation */}
            <div
              onPointerDown={() => setRevealingRole(true)}
              onPointerUp={() => setRevealingRole(false)}
              onPointerLeave={() => setRevealingRole(false)}
              className={`w-full py-8 px-5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer select-none active:scale-[0.98] ${
                revealingRole
                  ? 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white border-transparent shadow-xl ring-4 ring-purple-500/30'
                  : 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-dashed border-purple-400 dark:border-purple-600 shadow-inner'
              }`}
            >
              {revealingRole ? (
                <div className="space-y-1.5 animate-in zoom-in-95 duration-150">
                  <Eye className="w-8 h-8 text-amber-300 mx-auto" />
                  <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white drop-shadow">
                    {assignedRole.roleLabel}
                  </div>
                  <p className="text-xs text-purple-100 max-w-xs mx-auto">
                    Keep this strictly confidential from your colleagues!
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center mx-auto mb-1">
                    <EyeOff className="w-6 h-6" />
                  </div>
                  <div className="text-base font-extrabold text-slate-900 dark:text-white">
                    Press & Hold to Reveal Role
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Card automatically conceals when you lift your finger
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tool B: Secret Word / Prompt Card (For Charades, Blind Pictionary) */}
        {secretWord && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Your Secret Prompt / Word
            </span>
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-2xl font-black text-blue-900 dark:text-blue-100">
              {secretWord}
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Act or sketch this prompt for your team without speaking!
            </p>
          </div>
        )}

        {/* Tool C: Oversized Phone Buzzer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md text-center space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-rose-500" /> Phone Buzzer
            </span>
            {isBuzzerLocked ? (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Lockout Active
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                Live & Ready
              </span>
            )}
          </div>

          {/* Huge Tactile Button */}
          <div className="py-2 flex justify-center">
            <button
              type="button"
              onClick={handleBuzz}
              disabled={isBuzzerLocked || paused}
              className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full font-black text-2xl uppercase tracking-wider shadow-2xl flex flex-col items-center justify-center gap-2 transition-all transform active:scale-90 cursor-pointer select-none ${
                isBuzzerLocked
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-8 border-slate-300 dark:border-slate-700 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white border-8 border-rose-400/80 shadow-rose-600/40 hover:brightness-110 active:brightness-95 animate-pulse'
              }`}
            >
              {isBuzzerLocked ? (
                <>
                  <Lock className="w-10 h-10" />
                  <span className="text-lg">LOCKED</span>
                </>
              ) : (
                <>
                  <Bell className="w-12 h-12" />
                  <span>BUZZ!</span>
                  <span className="text-[11px] font-semibold tracking-normal lowercase opacity-90">
                    tap first to answer
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Buzzer Lockout Status Feedback */}
          {isBuzzerLocked && (
            <div
              className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                isLockedByMe
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}
            >
              {isLockedByMe ? (
                <div className="flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>🎉 You buzzed first! Answer out loud to the room!</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span>
                    Buzzed first: {buzzerState.lockedByUserName || 'Another Player'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tool D: Live Room Voting Controls */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-500" /> Live Voting
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              {hasVoted ? 'Vote Submitted' : 'Cast your choice'}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Select your verdict or choose who you believe is the suspect:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Option A', 'Option B', 'Option C', 'Option D'].map((opt) => {
              const isSelected = selectedVoteTarget === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={hasVoted || paused}
                  onClick={() => handleVote(opt)}
                  className={`p-3 rounded-xl border font-semibold text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {hasVoted && (
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 text-center flex items-center justify-center gap-1 mt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Your vote was submitted anonymously.</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Organizer Host Controls Panel (For Host / Admin personas) */}
      {isOrganizer && (
        <div className="mt-4 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Organizer Controls
            </span>
            <button
              onClick={() => setHostPanelOpen(!hostPanelOpen)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              {hostPanelOpen ? 'Collapse ▲' : 'Expand ▼'}
            </button>
          </div>

          {/* Quick Primary Actions Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleHostPause}
              className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              onClick={handleHostResetBuzzer}
              className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              title="Unlock buzzer for next question"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Buzzer</span>
            </button>

            <button
              onClick={handleHostNext}
              className="py-2.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-blue-500/20 cursor-pointer transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Next</span>
            </button>
          </div>

          {/* Collapsible Secondary Host Controls */}
          {hostPanelOpen && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2">
              <button
                onClick={() => setAwardModalOpen(true)}
                className="py-2 px-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-amber-200 dark:border-amber-800 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>+ Points</span>
              </button>

              <button
                onClick={handleHostSkipGame}
                className="py-2 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <SkipForward className="w-3.5 h-3.5" />
                <span>Skip</span>
              </button>

              <button
                onClick={handleHostEndSession}
                className="py-2 px-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border border-red-200 dark:border-red-900 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>End</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Award Points Dialog */}
      {awardModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4 text-amber-500" />
                Award Bonus Points
              </h3>
              <button
                onClick={() => setAwardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Target Team / Player
                </label>
                <input
                  type="text"
                  placeholder="e.g. Team Alpha or Player Name"
                  value={awardTargetId}
                  onChange={(e) => setAwardTargetId(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Points Amount
                </label>
                <div className="flex gap-2 mt-1">
                  {[25, 50, 100].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setAwardPoints(pts)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                        awardPoints === pts
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      +{pts}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Reason / Award Note
                </label>
                <input
                  type="text"
                  value={awardReason}
                  onChange={(e) => setAwardReason(e.target.value)}
                  placeholder="e.g. Fastest Buzzer or Hilarious Sketch"
                  className="w-full mt-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setAwardModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleHostAwardPoints}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Confirm Award
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Important Action Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {confirmDialog.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {confirmDialog.description}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
