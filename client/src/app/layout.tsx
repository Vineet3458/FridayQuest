import type { Metadata, Viewport } from 'next';
import './globals.css';
import RoleTrialBar from '@/components/trial/RoleTrialBar';
import Navbar from '@/components/navigation/Navbar';

export const metadata: Metadata = {
  title: 'FridayQuest - Fun Friday Game Master',
  description: 'An offline-first Fun Friday arranger, game master and scorekeeper',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#090d16' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('fq_theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark;
                  if (stored === 'light') {
                    isDark = false;
                  } else if (stored === 'dark') {
                    isDark = true;
                  } else {
                    // Default behavior: strictly respect the user's OS system theme
                    isDark = systemDark;
                  }
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-200">
        <RoleTrialBar />
        <Navbar />
        <div className="flex-1 flex flex-col pb-16 md:pb-8">
          {children}
        </div>
      </body>
    </html>
  );
}
