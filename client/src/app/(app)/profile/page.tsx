'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Trophy,
  Award,
  Zap,
  Star,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Camera,
  Sparkles,
  Save,
  RotateCcw,
  Flame,
  Gamepad2,
  Coffee,
  Briefcase,
  Hash,
  MessageSquare,
  Trash2,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { usePlayerAnalytics } from '@/hooks/useAnalytics';
import { useGeolocation } from '@/hooks/useGeolocation';
import { apiRequest } from '@/lib/api';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { data: analyticsData } = usePlayerAnalytics();
  const { coordinates, permissionState, requestLocationPermission, loading: geoLoading } = useGeolocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const player = analyticsData?.user || user;
  const journey = analyticsData?.journeyStats || {
    xp: player?.xp || 450,
    level: player?.level || 3,
    xpToNextLevel: 150,
    progressPercent: 70,
    gamesPlayed: 5,
    wins: 2,
    badges: 6,
  };

  // Profile Form States
  const [name, setName] = useState(player?.name || '');
  const [email, setEmail] = useState(player?.email || '');
  const [phone, setPhone] = useState(player?.phone || '+91 98765 43210');
  const [department, setDepartment] = useState(player?.department || 'Engineering');
  const [designation, setDesignation] = useState(player?.designation || 'Senior Experience Engineer');
  const [employeeId, setEmployeeId] = useState(player?.employeeId || 'KX-8821');
  const [campus, setCampus] = useState(player?.location?.campus || coordinates?.campus || 'Noida HQ Campus');
  const [bio, setBio] = useState(
    player?.bio || 'Fun Friday enthusiast, buzzer reflex champion & team player! ⚡'
  );
  const [avatar, setAvatar] = useState(player?.avatar || '');
  const [favoritePlayStyle, setFavoritePlayStyle] = useState(player?.favoritePlayStyle || '⚡ Active');
  const [snackPreference, setSnackPreference] = useState(player?.snackPreference || '☕ Masala Chai & Samosa');
  const [slackHandle, setSlackHandle] = useState(player?.slackHandle || '@kirxa.player');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync state when player / user loads
  useEffect(() => {
    if (player) {
      if (player.name) setName(player.name);
      if (player.email) setEmail(player.email);
      if (player.phone) setPhone(player.phone);
      if (player.department) setDepartment(player.department);
      if (player.designation) setDesignation(player.designation);
      if (player.employeeId) setEmployeeId(player.employeeId);
      if (player.bio) setBio(player.bio);
      if (player.avatar) setAvatar(player.avatar);
      if (player.favoritePlayStyle) setFavoritePlayStyle(player.favoritePlayStyle);
      if (player.snackPreference) setSnackPreference(player.snackPreference);
      if (player.slackHandle) setSlackHandle(player.slackHandle);
      if (player.location?.campus) setCampus(player.location.campus);
    }
  }, [player]);

  // Sync coordinates when location permission granted
  useEffect(() => {
    if (coordinates?.campus && !player?.location?.campus) {
      setCampus(coordinates.campus);
    }
  }, [coordinates, player]);

  // Handle Image File Upload & Compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setSaveError('Image file size must be under 8MB.');
      return;
    }

    setSaveError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to max 400x400 to keep base64 payload ultra lightweight (~45kb)
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatar(dataUrl);
          setSaveSuccess(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        department,
        designation: designation.trim(),
        employeeId: employeeId.trim(),
        bio: bio.trim(),
        avatar,
        favoritePlayStyle,
        snackPreference,
        slackHandle: slackHandle.trim(),
        location: {
          campus,
          city: coordinates?.city || player?.location?.city || 'Noida, India',
          latitude: coordinates?.latitude || player?.location?.latitude || 28.5355,
          longitude: coordinates?.longitude || player?.location?.longitude || 77.391,
        },
      };

      const res = await apiRequest('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      if (res.success && res.data) {
        setUser(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        setSaveError(res.message || 'Unable to update profile');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const userInitials = (name || player?.name || 'Kirxa Player')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const playStyles = [
    { id: '⚡ Active', label: 'Active & Competitive', desc: 'Buzzer reflexes, high energy & rapid fire rounds' },
    { id: '🧘 Calm', label: 'Calm & Social', desc: 'Puzzles, storytelling, music & relaxed camaraderie' },
    { id: '🧠 Brainy', label: 'Brainy & Strategy', desc: 'Trivia master, word deductions & clever tactics' },
    { id: '🤝 Team First', label: 'Team First', desc: 'Cooperative tasks, moral support & cheerleading' },
  ];

  const snacks = [
    { id: '☕ Masala Chai & Samosa', label: 'Chai & Samosa', icon: '☕' },
    { id: '🥤 Cold Coffee & Brownie', label: 'Cold Coffee & Brownie', icon: '🥤' },
    { id: '🍕 Pizza & Cold Drinks', label: 'Pizza & Drinks', icon: '🍕' },
    { id: '🥟 Dimsums & Green Tea', label: 'Dimsums & Green Tea', icon: '🥟' },
    { id: '🥗 Healthy Fruit Bowl', label: 'Healthy & Fresh', icon: '🥗' },
  ];

  return (
    <div className="relative p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
      {/* Background Wallpaper */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-30 dark:opacity-10 bg-[url('/images/player/player-bg.jpg')] bg-cover bg-fixed bg-center"
        aria-hidden="true"
      />

      {/* Hidden File Input for Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleImageUpload}
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
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
            ID: {employeeId || 'KX-8821'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            ● Active Employee
          </span>
        </div>
      </div>

      {/* 1. HERO PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-xl ring-4 ring-indigo-50 dark:ring-indigo-950/60 select-none overflow-hidden relative">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name || 'Player Avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{userInitials}</span>
              )}

              {/* Hover overlay to trigger file upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                title="Click to upload profile photo"
              >
                <Camera className="w-5 h-5 text-white" />
                <span className="text-[10px] font-bold">Change</span>
              </button>
            </div>

            {/* Verified Campus Badge */}
            <div
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md border-2 border-white dark:border-slate-900"
              title="Verified Campus Presence"
            >
              ✓
            </div>
          </div>

          {/* Name & Quick Info */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {name || 'Kirxa Player'}
                </h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {designation} • {department}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize">
                  {user?.role || 'Player'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Level {journey.level} Explorer
                </span>
              </div>
            </div>

            {/* Quick Contact & Location Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Campus: {campus}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>{email || 'player@kirxa.demo'}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>{phone}</span>
              </span>
            </div>

            {/* Fun Bio Quote */}
            {bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 line-clamp-2">
                &ldquo;{bio}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* 4 Stat Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Total XP</div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {journey.xp} XP
            </div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              Level {journey.level}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Games Played</div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5">
              {journey.gamesPlayed}
            </div>
            <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Live Sessions</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Games Won</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {journey.wins}
            </div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">40% Win Rate</div>
          </div>

          <Link
            href="/achievements"
            className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 text-center hover:bg-purple-100 transition-colors group cursor-pointer"
          >
            <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">
              Badges
            </div>
            <div className="text-xl font-black text-purple-700 dark:text-purple-300 mt-0.5 flex items-center justify-center gap-1">
              <span>{journey.badges}</span>
              <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
              View Showcase
            </div>
          </Link>
        </div>
      </div>

      {/* 2. EDIT PROFILE FORM */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Banner Alert on Success / Error */}
        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Profile updated successfully! All FridayQuest views and cards are live.</span>
            </div>
            <span className="text-[10px] font-mono opacity-70">Saved to Cloud</span>
          </div>
        )}

        {saveError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-semibold shadow-xs">
            {saveError}
          </div>
        )}

        {/* SECTION A: Image Upload & Personal Identity */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <User className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Personal Identity &amp; Profile Picture
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload your photo and update your name, email ID, and direct contact details.
              </p>
            </div>
          </div>

          {/* Photo Upload Area */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-md overflow-hidden">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="text-xs font-black text-slate-900 dark:text-white">
                Profile Photo / Avatar
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                PNG, JPG or WEBP. Max 8MB. Your photo is automatically optimized for fast live gaming.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{avatar ? 'Change Photo' : 'Upload Image'}</span>
                </button>

                {avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name, Email, Phone, Employee ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kirxa Player"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Address (Editable) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Work Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Phone Number (Editable) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Phone Number (WhatsApp / Calling) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* Employee ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Employee / Staff ID
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. KX-8821"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION B: Work & Campus Localization */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-purple-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Work Designation &amp; Office Campus
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Configures your team badge and physical campus verification for Fun Friday sessions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Job Designation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Job Title / Designation
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Experience Engineer"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design &amp; Creative</option>
                <option value="Product">Product Management</option>
                <option value="Marketing">Marketing &amp; Growth</option>
                <option value="Sales">Sales &amp; Business Dev</option>
                <option value="People & Culture">People &amp; Culture (HR)</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance &amp; Accounts</option>
                <option value="QA & Testing">Quality Assurance</option>
                <option value="Legal">Legal &amp; Compliance</option>
              </select>
            </div>

            {/* Office Campus with GPS Detect */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Assigned Office Campus
                </label>
                <button
                  type="button"
                  onClick={requestLocationPermission}
                  disabled={geoLoading}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {geoLoading ? 'Detecting GPS...' : 'Detect via GPS'}
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Noida HQ Campus">Noida HQ Campus (Sector 62)</option>
                  <option value="Bengaluru Innovation Center">Bengaluru Innovation Center (Outer Ring Rd)</option>
                  <option value="Gurugram Tech Park">Gurugram Tech Park (Cyber Hub)</option>
                  <option value="Mumbai Financial Hub">Mumbai Financial Hub (BKC)</option>
                  <option value="Pune Cybercity">Pune Cybercity (Magarpatta)</option>
                  <option value="Remote / Hybrid">Remote / Hybrid Employee</option>
                </select>
              </div>
            </div>

            {/* Slack / Teams Handle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Slack / Teams Username
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={slackHandle}
                  onChange={(e) => setSlackHandle(e.target.value)}
                  placeholder="@kirxa.player"
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: Fun Friday Persona & Snack Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white">
                Fun Friday Superpower &amp; Match Preferences
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Helps the AI team balancer arrange well-rounded teams and Friday snacks for you.
              </p>
            </div>
          </div>

          {/* Superpower / Bio */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Fun Friday Superpower / Bio Tagline
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Buzzer reflex champion ⚡, 90s Bollywood trivia encyclopedia & antakshari vocalist!"
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
            <p className="text-[10px] text-slate-400">
              Shown to opponents and teammates on your live player card during sessions.
            </p>
          </div>

          {/* Play Style Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Preferred Game &amp; Play Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {playStyles.map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => setFavoritePlayStyle(style.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    favoritePlayStyle === style.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-xs">{style.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {style.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Snack Preference Chips */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Friday Snack &amp; Beverage Preference (Office Arranger)
            </label>
            <div className="flex flex-wrap gap-2">
              {snacks.map((snack) => (
                <button
                  type="button"
                  key={snack.id}
                  onClick={() => setSnackPreference(snack.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    snackPreference === snack.id
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>{snack.icon}</span>
                  <span>{snack.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FORM ACTION BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Changes are saved to your company profile and updated instantly across FridayQuest.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
