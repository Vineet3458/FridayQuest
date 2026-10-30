'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Play,
  Loader2,
  Tv,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SessionsPage() {
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [title, setTitle] = useState('Fun Friday Kickoff');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + ((5 + 7 - d.getDay()) % 7 || 7));
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('16:00');
  const [durationMin, setDurationMin] = useState(90);
  const [location, setLocation] = useState('Cafeteria / Lounge');
  const [creating, setCreating] = useState(false);
  const [planningId, setPlanningId] = useState<string | null>(null);

  const canManageSessions =
    user?.role === 'superAdmin' || user?.role === 'orgAdmin' || user?.role === 'organizer';

  const loadSessions = () => {
    apiRequest('/sessions')
      .then((res) => {
        if (res.success) setSessions(res.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await apiRequest('/sessions', {
        method: 'POST',
        body: JSON.stringify({
          title,
          date,
          startTime,
          durationMin,
          location,
        }),
      });
      if (res.success) {
        setShowModal(false);
        loadSessions();
      }
    } catch (err: any) {
      alert(err.message || 'Error creating session');
    } finally {
      setCreating(false);
    }
  };

  const handleAutoPlan = async (sessionId: string) => {
    setPlanningId(sessionId);
    try {
      const res = await apiRequest(`/sessions/${sessionId}/plan`, {
        method: 'POST',
        body: JSON.stringify({ targetDurationMin: 90 }),
      });
      if (res.success) {
        alert('Auto-planner generated the agenda successfully!');
        loadSessions();
      }
    } catch (err: any) {
      alert(err.message || 'Auto-planner could not run yet');
    } finally {
      setPlanningId(null);
    }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Friday Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage your company&apos;s Fun Friday calendar, collect Vibe Checks, and auto-plan agendas.
          </p>
        </div>

        {canManageSessions && (
          <button
            onClick={() => setShowModal(true)}
            className="self-start sm:self-auto py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Friday Session</span>
          </button>
        )}
      </div>

      {/* Sessions Grid (1 col on mobile, 2 col on tablet, 3 col on desktop) */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-500 text-xs">
          Loading sessions...
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">No Friday Sessions Scheduled</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Create your first Fun Friday session to start gathering Vibe Checks and generating the game agenda.
          </p>
          {canManageSessions ? (
            <button
              onClick={() => setShowModal(true)}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Create Friday Session
            </button>
          ) : (
            <span className="text-xs text-slate-500 italic">
              (Switch to Organizer or Admin role to schedule sessions)
            </span>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div
              key={s._id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      s.status === 'live'
                        ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 animate-pulse'
                        : s.status === 'planned'
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : s.status === 'voting'
                        ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {s.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      Code: <strong className="text-slate-900 dark:text-white">{s.joinCode}</strong>
                    </span>
                    <Link
                      href={`/session/${s.joinCode}/screen`}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Projector Screen View"
                    >
                      <Tv className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">{s.title}</h3>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                    <span className="truncate">{s.startTime} ({s.durationMin}m)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-500 dark:text-purple-400 shrink-0" />
                    <span className="truncate">{s.location}</span>
                  </div>
                </div>

                {/* Agenda list or Auto-Planner CTA */}
                {s.agenda && s.agenda.length > 0 ? (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Planned Agenda ({s.agenda.length} items):
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {s.agenda.map((item: any, i: number) => (
                        <div
                          key={i}
                          className="text-xs text-slate-600 dark:text-slate-400 flex justify-between bg-slate-50 dark:bg-slate-950/70 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800/50"
                        >
                          <span className="truncate">{i + 1}. {item.gameName}</span>
                          <span className="text-slate-500 font-mono shrink-0 ml-2">{item.durationMin}m</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-xs text-slate-500 italic mb-2">No games assigned yet.</div>
                    {canManageSessions && (
                      <button
                        onClick={() => handleAutoPlan(s._id)}
                        disabled={planningId === s._id}
                        className="w-full py-2 px-3 bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {planningId === s._id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        Run Auto-Planner Algorithm
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Link
                  href={`/session/${s.joinCode}/play`}
                  className="flex-1 py-2.5 px-3 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-green-600/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Live Player View
                </Link>
                <Link
                  href={`/session/${s.joinCode}/screen`}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-slate-200 dark:border-transparent"
                >
                  <Tv className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> TV
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 shadow-2xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Fun Friday Session</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Set the time and place for this week&apos;s event.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Session Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Duration (Minutes)</label>
                <input
                  type="number"
                  min={15}
                  max={300}
                  value={durationMin}
                  onChange={(e) => setDurationMin(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200 dark:border-transparent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
