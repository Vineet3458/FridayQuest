'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Shuffle,
  Loader2,
  Sparkles,
  Building2,
  ShieldCheck,
  UserCheck,
  Mic,
  User,
  Search,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserRole } from '@/types';

interface MemberItem {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  xp?: number;
  level?: number;
}

export default function TeamsPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [teams, setTeams] = useState<any[]>([]);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [numTeams, setNumTeams] = useState<number>(3);
  const [mode, setMode] = useState<'mixed' | 'random' | 'by_department'>('mixed');
  const [activeTab, setActiveTab] = useState<'teams' | 'members'>('teams');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const canGenerate =
    user?.role === 'superAdmin' || user?.role === 'orgAdmin' || user?.role === 'organizer';
  const canViewMembers = canGenerate;

  useEffect(() => {
    // 1. Load Sessions
    apiRequest('/sessions')
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setSessions(res.data);
          setSelectedSessionId(res.data[0]._id);
          loadTeams(res.data[0]._id);
        }
      })
      .catch(() => {});

    if (canViewMembers) loadMembers();
  }, []);

  const loadMembers = () => {
    apiRequest('/users')
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setMembers(res.data);
        }
      })
      .catch(() => {});
  };

  const loadTeams = (sessionId: string) => {
    if (!sessionId) return;
    apiRequest(`/sessions/${sessionId}/teams`)
      .then((res) => {
        if (res.success) setTeams(res.data || []);
      })
      .catch(() => {});
  };

  const handleGenerate = async () => {
    if (!selectedSessionId) return;
    setLoading(true);
    try {
      const res = await apiRequest(`/sessions/${selectedSessionId}/teams/generate`, {
        method: 'POST',
        body: JSON.stringify({ numTeams, mode }),
      });
      if (res.success) {
        setTeams(res.data || []);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to generate teams');
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Team Maker &amp; Members
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Review organization members and create balanced teams for a Friday session.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl self-start sm:self-auto transition-colors">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'teams'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Team Generator
          </button>
          {canViewMembers && (
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'members'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Organization Members</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {members.length}
              </span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'teams' ? (
        /* Team Generator View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Generator Controls (5 cols on Desktop) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-5 transition-colors">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Users className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Algorithm Configuration</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Friday Session
                </label>
                <select
                  value={selectedSessionId}
                  onChange={(e) => {
                    setSelectedSessionId(e.target.value);
                    loadTeams(e.target.value);
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  {sessions.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title} ({new Date(s.date).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Number of Teams
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={8}
                    value={numTeams}
                    onChange={(e) => setNumTeams(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mix Strategy
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="mixed">Mixed (Fair Mix)</option>
                    <option value="random">Pure Random</option>
                    <option value="by_department">By Department</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-2xl text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Fair-Mix Cost Function
                </div>
                <p className="text-[11px] leading-relaxed">
                  Greedy randomized algorithm evaluating 200 attempts. Balances 20 members across teams to avoid department silos.
                </p>
              </div>

              {canGenerate ? (
                <button
                  onClick={handleGenerate}
                  disabled={loading || !selectedSessionId}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
                  Run Fair-Mix Generator (200 Attempts)
                </button>
              ) : (
                <div className="text-center text-xs text-slate-500 py-2">
                  (Switch to Organizer or Admin role in top bar to generate teams)
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Teams Grid (7 cols on Desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                Generated Teams ({teams.length})
              </h2>
              <span className="text-xs text-slate-500">Live Team Rosters</span>
            </div>

            {teams.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <Users className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2" />
                <div className="font-bold text-slate-900 dark:text-white text-sm">No teams formed yet</div>
                <p>Choose your settings on the left and tap &apos;Run Fair-Mix Generator&apos;.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((t, idx) => (
                  <div
                    key={t._id || idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm dark:shadow-lg flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full ring-2 ring-slate-300 dark:ring-white/10"
                          style={{ backgroundColor: t.color || '#3B82F6' }}
                        />
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{t.name}</span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                        {t.memberIds?.length || 0} players
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {t.memberIds?.map((m: any, mIdx: number) => (
                        <span
                          key={mIdx}
                          className="text-xs px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shadow-xs"
                        >
                          <span className="font-medium">{m.name || m}</span>
                          {m.department && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                              <Building2 className="w-2.5 h-2.5" />
                              {m.department}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Organization Members View */
        <div className="space-y-6">
          {/* Summary Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-500 dark:text-rose-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {members.filter((member) => member.role === 'superAdmin').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Super Admin</div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-500 dark:text-purple-400 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {members.filter((member) => member.role === 'orgAdmin').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Org Admins</div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-500 dark:text-blue-400 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {members.filter((member) => member.role === 'organizer').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Organizers (Hosts)</div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {members.filter((member) => member.role === 'player').length}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Active Players</div>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-colors">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Roles ({members.length})</option>
                <option value="superAdmin">Super Admin ({members.filter((member) => member.role === 'superAdmin').length})</option>
                <option value="orgAdmin">Org Admin ({members.filter((member) => member.role === 'orgAdmin').length})</option>
                <option value="organizer">Organizer ({members.filter((member) => member.role === 'organizer').length})</option>
                <option value="player">Player ({members.filter((member) => member.role === 'player').length})</option>
              </select>

              <button
                onClick={loadMembers}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-transparent"
                title="Refresh organization members"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Organization member cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMembers.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                No organization members match this filter.
              </p>
            ) : filteredMembers.map((m, idx) => {
              const roleColors: Record<UserRole, { badge: string; text: string; bg: string }> = {
                superAdmin: { badge: 'Super Admin', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' },
                orgAdmin: { badge: 'Org Admin', text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30' },
                organizer: { badge: 'Organizer', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30' },
                player: { badge: 'Player', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' },
              };
              const rStyle = roleColors[m.role] || roleColors.player;

              return (
                <div
                  key={m.id || m._id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${rStyle.bg} ${rStyle.text}`}>
                        {rStyle.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">#{idx + 1}</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">{m.name}</h3>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{m.email}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span className="truncate max-w-[110px]">{m.department}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold font-mono text-[11px]">
                      <Trophy className="w-3 h-3" />
                      <span>{m.xp ?? 0} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
