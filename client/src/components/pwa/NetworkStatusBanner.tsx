'use client';

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, Download, X } from 'lucide-react';

export default function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Initial online status
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    // 2. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('FridayQuest ServiceWorker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('ServiceWorker registration deferred:', err);
          });
      });
    }

    // 3. Online & Offline Event Listeners
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnectedToast(true);
      const timer = setTimeout(() => {
        setShowReconnectedToast(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnectedToast(false);
    };

    // 4. Capture PWA Install Prompt (beforeinstallprompt)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      // Check if user has previously dismissed install banner
      const dismissed = localStorage.getItem('fq_pwa_dismissed');
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('fq_pwa_dismissed', 'true');
  };

  return (
    <>
      {/* Offline Alert Ribbon (Sticky top or floating alert) */}
      {!isOnline && (
        <div className="w-full bg-rose-600 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0 animate-bounce" />
              <span>
                <strong className="font-bold">You are currently offline.</strong> Cached screens
                and game instructions are available. Live multiplayer rooms require an active
                connection.
              </span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Back Online Toast */}
      {showReconnectedToast && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200">
          <Wifi className="w-4 h-4" />
          <span>Back online! Reconnected to FridayQuest services.</span>
        </div>
      )}

      {/* Optional Install PWA Pill / Banner for Mobile users */}
      {showInstallBanner && installPrompt && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              FQ
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                Install FridayQuest App
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Fast home-screen access & offline rules
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>Install</span>
            </button>
            <button
              onClick={handleDismissInstall}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

