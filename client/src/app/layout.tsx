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
  themeColor: '#090d16',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased flex flex-col">
        <RoleTrialBar />
        <Navbar />
        <div className="flex-1 flex flex-col pb-16 md:pb-8">
          {children}
        </div>
      </body>
    </html>
  );
}
