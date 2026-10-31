'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Users,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Building2,
  Mail,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useApprovals } from '@/hooks/useApprovals';

export default function ApprovalsPage() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'player';

  const [activeTab, setActiveTab] = useState<'users' | 'games'>('users');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const {
    data,
    isLoading,
    refetch,
    approveUser,
    isApprovingUser,
    rejectUser,
    isRejectingUser,
    approveGame,
    isApprovingGame,
    rejectGame,
    isRejectingGame,
  } = useApprovals();

  const isSuperAdmin = role === 'superAdmin';
  const isOrgAdmin = role === 'orgAdmin';
  const hasAccess = isSuperAdmin || isOrgAdmin;

  const pendingUsers = data?.pendingUsers || [];
  const pendingGames = data?.pendingGames || [];
  const totalPending = data?.totalPending || 0;

  const handleApproveUser = async (userId: string, userName: string) => {
    try {
      await approveUser(userId);
      setActionSuccessMessage(`Successfully approved ${userName}'s registration.`);
      window.setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch {
      // Error handled by mutation
    }
  };

  const handleRejectUser = async (userId: string, userName: string) => {
    try {
      await rejectUser(userId);
      setActionSuccessMessage(`Declined ${userName}'s registration.`);
      window.setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch {
      // Error handled by mutation
    }
  };

  const handleApproveGame = async (gameId: string, gameName: string) => {
    try {
      await approveGame(gameId);
      setActionSuccessMessage(`Custom game "${gameName}" is now approved and live in Game Library!`);
      window.setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch {
      // Error handled by mutation
    }
  };

  const handleRejectGame = async (gameId: string, gameName: string) => {
    try {
      await rejectGame({ gameId, reason: 'Does not fit company team activities' });
      setActionSuccessMessage(`Declined custom game "${gameName}".`);
      window.setTimeout(() => setActionSuccessMessage(null), 4000);
    } catch {
      // Error handled by mutation
    }
  };

  if (!hasAccess) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 my-auto">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Admin Approvals</h2>
        <p className="text-xs text-slate-500">
          This portal is reserved for organization administrators to approve newly registered teammates and user-submitted custom games.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const themeCardBg = isSuperAdmin
    ? 'bg-[#0F172A] border-slate-800 text-white'
    : 'bg-white border-slate-200/80 text-slate-900 dark:bg-slate-900 dark:border-slate-800 dark:text-white';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">Approvals & Moderation</h1>
                {totalPending > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                    {totalPending} pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review and approve new team member registrations and custom team-submitted games.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => void refetch()}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Refresh pending items"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {actionSuccessMessage && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* TABS: USERS vs CUSTOM GAMES */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Employee Registrations</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {pendingUsers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('games')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'games'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Custom Game Submissions</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {pendingGames.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'users' ? (
        <div className="space-y-4">
          {pendingUsers.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border shadow-xs space-y-3 ${themeCardBg}`}>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">All Caught Up!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                There are currently no new employee accounts awaiting approval. Auto-approval settings can be toggled in Organization Settings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingUsers.map((u) => (
                <div key={u._id} className={`p-4 rounded-3xl border shadow-xs flex flex-col justify-between space-y-3 ${themeCardBg}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        Pending Admin Review
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{u.name}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{u.department || 'General'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isApprovingUser || isRejectingUser}
                      onClick={() => handleApproveUser(u._id, u.name)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isApprovingUser ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Approve</span>
                    </button>
                    <button
                      type="button"
                      disabled={isApprovingUser || isRejectingUser}
                      onClick={() => handleRejectUser(u._id, u.name)}
                      className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {pendingGames.length === 0 ? (
            <div className={`p-12 text-center rounded-3xl border shadow-xs space-y-3 ${themeCardBg}`}>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base">No Custom Games Pending</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                All community and organizer custom games have been reviewed and published.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingGames.map((g) => (
                <div key={g._id} className={`p-4 rounded-3xl border shadow-xs flex flex-col justify-between space-y-3 ${themeCardBg}`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                        Level {g.level || 1} Custom Game
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(g.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm">{g.name}</h4>
                    {g.definition?.rulesShort && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {g.definition.rulesShort}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>⏱ {g.definition?.durationMin || 15} mins</span>
                      <span>👥 {g.definition?.players?.min || 4}-{g.definition?.players?.max || 20} players</span>
                    </div>

                    {g.createdBy && (
                      <div className="text-[11px] text-slate-400">
                        Submitted by: <strong className="text-slate-700 dark:text-slate-300">{g.createdBy.name}</strong>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isApprovingGame || isRejectingGame}
                      onClick={() => handleApproveGame(g._id, g.name)}
                      className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isApprovingGame ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      type="button"
                      disabled={isApprovingGame || isRejectingGame}
                      onClick={() => handleRejectGame(g._id, g.name)}
                      className="py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

