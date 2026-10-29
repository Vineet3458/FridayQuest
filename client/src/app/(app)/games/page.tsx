'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Gamepad2,
  Sparkles,
  Layers,
  Code2,
  Clock,
  Zap,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function GameLibraryPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnergy, setSelectedEnergy] = useState<string>('all');
  const [builderOpen, setBuilderOpen] = useState(false);

  const canBuildGames =
    user?.role === 'superAdmin' || user?.role === 'orgAdmin' || user?.role === 'organizer';

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Game Library Section
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse built-in game templates and create custom company games using phone-as-prop tools.
          </p>
        </div>

        {canBuildGames && (
          <button
            onClick={() => setBuilderOpen(true)}
            className="self-start sm:self-auto py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Game Builder</span>
          </button>
        )}
      </div>

      {/* Responsive Search & Filters Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search game catalog, tools or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 md:pb-0">
          {(['all', 'low', 'medium', 'high'] as const).map((energy) => (
            <button
              key={energy}
              onClick={() => setSelectedEnergy(energy)}
              className={`px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-colors ${
                selectedEnergy === energy
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {energy === 'all'
                ? 'All Energy'
                : energy === 'low'
                ? 'Zen / Calm'
                : energy === 'medium'
                ? 'Medium'
                : 'High Energy'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Status Showcase Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0 shadow-inner">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Game Engine Ready
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Game Library Section Initialized
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              As planned, the Game Library framework, MongoDB schemas, tool registry (Timer, Role Card, Buzzer, Voting), and scoring engine are in place. Games will be decided together in the next step.
            </p>
          </div>
        </div>

        {/* Three Custom Game Levels Showcase (Responsive Grid: 1 col mobile, 3 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Level 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Level 1
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900">
                Rule Card
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm">Rule Card Only</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone can add a physical game in 60 seconds: name, duration, props, and rules. App provides timer and scorekeeper.
            </p>
          </div>

          {/* Level 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Level 2
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900">
                Tool-Based
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm">Tool-Based Game</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Created in wizard: secret roles, buzzer rounds, voting steps, and automated safe scoring rules without code.
            </p>
          </div>

          {/* Level 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4" /> Level 3
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-900">
                Plugin (Later)
              </span>
            </div>
            <h3 className="font-extrabold text-white text-sm">Developer Plugin</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Code modules for custom boards or motion sensors. Reserved for later releases as planned.
            </p>
          </div>
        </div>
      </div>

      {/* Builder Modal Structure */}
      {builderOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Custom Game Builder Template</h2>
              </div>
              <button
                onClick={() => setBuilderOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-purple-300">
                The Game Builder wizard schema and backend validation endpoints are initialized. When we choose the games together in the next step, they will be registered and displayed here!
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-white">Supported Flow Step Types:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'deal_roles',
                    'announce',
                    'timer',
                    'buzz_round',
                    'action (pickPlayer)',
                    'vote',
                    'score',
                    'reveal',
                  ].map((step) => (
                    <span
                      key={step}
                      className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px] font-mono"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setBuilderOpen(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
            >
              Close Template Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
