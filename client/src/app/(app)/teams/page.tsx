'use client';

import { useState, useEffect } from 'react';
import { Users, Shuffle, Loader2, Sparkles, Building2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

export default function TeamsPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [teams, setTeams] = useState<any[]>([]);
  const [numTeams, setNumTeams] = useState<number>(2);
  const [mode, setMode] = useState<'mixed' | 'random' | 'by_department'>('mixed');
  const [loading, setLoading] = useState(false);

  const canGenerate =
    user?.role === 'superAdmin' || user?.role === 'orgAdmin' || user?.role === 'organizer';

  useEffect(() => {
    apiRequest('/sessions')
      .then((res) => {
        if (res.success && res.data?.length > 0) {
          setSessions(res.data);
          setSelectedSessionId(res.data[0]._id);
          loadTeams(res.data[0]._id);
        }
      })
      .catch(() => {});
  }, []);

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

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Team Maker</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Fair-mix team generation running 200 greedy attempts with a cost function to balance teams and avoid repeat pairings.
        </p>
      </div>

      {/* Main Responsive Layout: 2 Columns on Desktop, 1 Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Generator Controls (5 cols on Desktop) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Algorithm Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Friday Session</label>
              <select
                value={selectedSessionId}
                onChange={(e) => {
                  setSelectedSessionId(e.target.value);
                  loadTeams(e.target.value);
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Teams</label>
                <input
                  type="number"
                  min={2}
                  max={12}
                  value={numTeams}
                  onChange={(e) => setNumTeams(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mix Strategy</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="mixed">Mixed (Fair Mix)</option>
                  <option value="random">Pure Random</option>
                  <option value="by_department">By Department</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl text-xs text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Fair-Mix Cost Function
              </div>
              <p className="text-[11px] leading-relaxed">
                Penalizes same-department clustering (+10 cost) and pairs who played together last Friday (+5 cost).
              </p>
            </div>

            {canGenerate ? (
              <button
                onClick={handleGenerate}
                disabled={loading || !selectedSessionId}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25"
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
            <h2 className="text-sm uppercase font-bold text-slate-400 tracking-wider">
              Generated Teams ({teams.length})
            </h2>
            <span className="text-xs text-slate-500">Live Team Rosters</span>
          </div>

          {teams.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-xs text-slate-400 space-y-2">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <div className="font-bold text-white text-sm">No teams formed yet</div>
              <p>Choose your settings on the left and tap &apos;Run Fair-Mix Generator&apos;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.map((t, idx) => (
                <div
                  key={t._id || idx}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-lg flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white/10"
                        style={{ backgroundColor: t.color || '#3B82F6' }}
                      />
                      <span className="font-extrabold text-white text-sm">{t.name}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono font-semibold">
                      {t.memberIds?.length || 0} players
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {t.memberIds?.map((m: any, mIdx: number) => (
                      <span
                        key={mIdx}
                        className="text-xs px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 flex items-center gap-1.5 shadow-sm"
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
    </div>
  );
}
