'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, ArrowRight, Gamepad2, Trophy, Users } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function LandingPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    apiRequest<any>('/health')
      .then((response) => {
        setBackendStatus(response.success ? 'connected' : 'disconnected');
      })
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  const handleJoin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code) router.push(`/session/${encodeURIComponent(code)}/play`);
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-10 flex items-center justify-between border-b border-slate-200 pb-5 dark:border-slate-800">
        <div className="text-sm font-bold text-slate-600 dark:text-slate-300">FridayQuest</div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900">
          <Activity
            className={`h-3.5 w-3.5 ${
              backendStatus === 'connected'
                ? 'text-emerald-500'
                : backendStatus === 'checking'
                  ? 'text-amber-500'
                  : 'text-red-500'
            }`}
          />
          <span>
            {backendStatus === 'connected'
              ? 'Service available'
              : backendStatus === 'checking'
                ? 'Checking service'
                : 'Service unavailable'}
          </span>
        </div>
      </header>

      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <section className="space-y-6 text-center lg:col-span-7 lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300">
            <Gamepad2 className="h-4 w-4" />
            Fun Friday, organized
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Turn office Fridays into <span className="text-blue-600 dark:text-blue-400">team moments.</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base lg:mx-0">
            Plan sessions, run live games, and keep everyone connected with one secure workspace.
          </p>

          <form
            onSubmit={handleJoin}
            className="mx-auto flex max-w-lg gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 lg:mx-0"
          >
            <label htmlFor="join-code" className="sr-only">Session code</label>
            <input
              id="join-code"
              type="text"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
              maxLength={32}
              autoComplete="off"
              placeholder="Enter your session code"
              className="min-w-0 flex-1 rounded-xl bg-slate-50 px-4 py-3 font-mono text-sm font-bold uppercase text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="submit"
              disabled={!joinCode.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Join <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <Gamepad2 className="mx-auto mb-2 h-5 w-5 text-blue-600" />
              <span className="text-xs font-bold">Live games</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <Users className="mx-auto mb-2 h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold">Fair teams</span>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
              <Trophy className="mx-auto mb-2 h-5 w-5 text-amber-500" />
              <span className="text-xs font-bold">Live scores</span>
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 lg:col-span-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your workspace</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign in to continue or set up an organization account.
            </p>
          </div>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-500"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Create organization
          </Link>
          <div className="border-t border-slate-200 pt-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Joining an existing organization?{' '}
            <Link href="/join" className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Use an invite code
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
