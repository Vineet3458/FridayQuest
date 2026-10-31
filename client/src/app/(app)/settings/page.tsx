'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Settings as SettingsIcon,
  Bell,
  MapPin,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Shield,
  KeyRound,
  Building2,
  Check,
  Copy,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Radio,
  Sliders,
  Palette,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useThemeStore } from '@/stores/useThemeStore';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { coordinates, permissionState, requestLocationPermission } = useGeolocation();
  const { theme, toggleTheme, setTheme } = useThemeStore();

  // Settings states
  const [fridayReminder, setFridayReminder] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [autoCheckIn, setAutoCheckIn] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText('KIRXA-7F3Q');
      setCopiedCode(true);
      showToast('Invite code copied to clipboard!');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
      {/* Background Wallpaper */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-10 bg-[url('/images/player/player-bg.jpg')] bg-cover bg-fixed bg-center"
        aria-hidden="true"
      />

      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">Settings &amp; Configuration</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Settings &amp; Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage your campus presence, live notifications, theme preferences, and office workspace.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Theme & Appearance (Light / Dark Direct Toggle) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Palette className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Appearance &amp; Theme
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Toggle between Light and Dark mode. New sessions automatically adopt your browser&apos;s default mode.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                Active Theme:
              </span>
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <Moon className="w-3 h-3" /> Dark Theme
                  </>
                ) : (
                  <>
                    <Sun className="w-3 h-3" /> Light Theme
                  </>
                )}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {theme === 'dark'
                ? 'Midnight dark palette designed for low-light gaming and reduced eye strain.'
                : 'Crisp, radiant light palette matching daytime office vibes.'}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle variant="segmented" />
            <ThemeToggle variant="switch" />
          </div>
        </div>
      </div>

      {/* 2. Geolocation & Physical Campus Verification */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <MapPin className="w-5 h-5 text-rose-500" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Campus Geolocation &amp; Physical Check-In
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              FridayQuest requires campus GPS permission to verify physical presence for prize eligibility.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Browser Geolocation Permission
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Current status:{' '}
                <span className="font-extrabold capitalize text-emerald-600 dark:text-emerald-400">
                  {permissionState}
                </span>
                {coordinates?.campus && ` (${coordinates.campus})`}
              </div>
            </div>
            <button
              type="button"
              onClick={requestLocationPermission}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              {coordinates?.city ? 'Re-verify GPS' : 'Grant Location Access'}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Automatic Friday Attendance Check-In
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Automatically verify physical campus presence when you connect to office Wi-Fi / GPS.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setAutoCheckIn(!autoCheckIn);
                showToast(autoCheckIn ? 'Turned off auto check-in' : 'Turned on auto check-in');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoCheckIn ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  autoCheckIn ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Notifications & Sound Alerts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-5 h-5 text-indigo-500" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Notifications &amp; Sound Alerts
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Control pre-event reminders and sound effects during live games.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Friday 3:30 PM IST Pre-Session Alert
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Receive an alert 30 minutes before Fun Friday starts at 4:00 PM IST.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setFridayReminder(!fridayReminder);
                showToast(fridayReminder ? 'Turned off Friday alert' : 'Turned on Friday alert');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                fridayReminder ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  fridayReminder ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-bold text-slate-900 dark:text-white">
                Live Game Buzzer Sound Effects
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Play sound effects when you hit the buzzer or when a round timer starts.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSoundAlerts(!soundAlerts);
                showToast(soundAlerts ? 'Sound effects muted' : 'Sound effects enabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundAlerts ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  soundAlerts ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Timezone & Localization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Clock className="w-5 h-5 text-indigo-500" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Timezone &amp; Regional Localization
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              FridayQuest operates in Indian Standard Time across all Indian office campuses.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Platform Timezone Standard
            </div>
            <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
              Asia/Kolkata (Indian Standard Time, UTC+05:30)
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            Active IST
          </span>
        </div>
      </div>

      {/* 5. Company Workspace & Invite Code */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building2 className="w-5 h-5 text-purple-500" />
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white">
              Workspace &amp; Company Info
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Your registered team organization details on FridayQuest.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Organization</div>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
              Kirxa Labs
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold">Enterprise Active Tier</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 uppercase">
                Teammate Invite Code
              </div>
              <div className="font-mono font-black text-slate-900 dark:text-white text-base mt-0.5">
                KIRXA-7F3Q
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyInviteCode}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
