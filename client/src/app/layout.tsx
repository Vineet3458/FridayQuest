import type { Metadata, Viewport } from 'next';
import './globals.css';
import NetworkStatusBanner from '@/components/pwa/NetworkStatusBanner';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'FridayQuest - Fun Friday Game Master',
  description: 'An offline-first Fun Friday arranger, game master and scorekeeper',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icon-192.png', sizes: '192x192' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FridayQuest',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
                    // Default behavior: automatically set according to the default theme of the user browser
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
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased flex flex-col transition-colors duration-200 overflow-x-hidden selection:bg-blue-500 selection:text-white">
        <QueryProvider>
          <NetworkStatusBanner />
          <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
