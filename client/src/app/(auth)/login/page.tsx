'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data?.user) {
        setUser(res.data.user);
        router.push('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Sign In</h1>
            <p className="text-xs text-slate-400">Welcome back to FridayQuest</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-sm"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        {/* Fast Role Trial Option */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider text-center mb-2.5">
            Or Sign In With a Trial Role
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await apiRequest('/auth/trial', { method: 'POST', body: JSON.stringify({ role: 'superAdmin' }) });
                  if (res.success && res.data?.user) { setUser(res.data.user); router.push('/dashboard'); }
                } catch {
                  setUser({ id: 'trial-superAdmin', name: 'Kirxa SuperAdmin', email: 'superadmin@kirxa.demo', role: 'superAdmin', status: 'active' });
                  router.push('/dashboard');
                } finally { setLoading(false); }
              }}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-rose-400 font-semibold text-center transition-colors"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await apiRequest('/auth/trial', { method: 'POST', body: JSON.stringify({ role: 'orgAdmin' }) });
                  if (res.success && res.data?.user) { setUser(res.data.user); router.push('/dashboard'); }
                } catch {
                  setUser({ id: 'trial-orgAdmin', name: 'Riya Sharma (HR)', email: 'riya.hr@kirxa.demo', role: 'orgAdmin', status: 'active' });
                  router.push('/dashboard');
                } finally { setLoading(false); }
              }}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-purple-400 font-semibold text-center transition-colors"
            >
              Org Admin (HR)
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await apiRequest('/auth/trial', { method: 'POST', body: JSON.stringify({ role: 'organizer' }) });
                  if (res.success && res.data?.user) { setUser(res.data.user); router.push('/dashboard'); }
                } catch {
                  setUser({ id: 'trial-organizer', name: 'Kabir Patel (Host)', email: 'kabir.host@kirxa.demo', role: 'organizer', status: 'active' });
                  router.push('/dashboard');
                } finally { setLoading(false); }
              }}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-400 font-semibold text-center transition-colors"
            >
              Organizer (Host)
            </button>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await apiRequest('/auth/trial', { method: 'POST', body: JSON.stringify({ role: 'player' }) });
                  if (res.success && res.data?.user) { setUser(res.data.user); router.push('/dashboard'); }
                } catch {
                  setUser({ id: 'trial-player', name: 'Ananya Sen (Player)', email: 'ananya.player@kirxa.demo', role: 'player', status: 'active' });
                  router.push('/dashboard');
                } finally { setLoading(false); }
              }}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold text-center transition-colors"
            >
              Player (Employee)
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          New company?{' '}
          <Link href="/register" className="text-blue-400 hover:underline font-medium">
            Register workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
