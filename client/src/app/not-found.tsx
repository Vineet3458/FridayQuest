import Link from 'next/link';
import { LayoutDashboard, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-5 border border-blue-200 dark:border-blue-500/20">
          <HelpCircle className="w-8 h-8" />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          404 Error
        </span>
        
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1 mb-2">
          Page Not Found
        </h1>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          The page you are looking for might have been moved, mistyped, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

