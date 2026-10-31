'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthenticatedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;
    checkAuth().then((authenticated) => {
      if (!active) return;
      if (!authenticated) {
        router.replace('/login');
        return;
      }
      setIsChecking(false);
    });

    return () => {
      active = false;
    };
  }, [checkAuth, router]);

  if (isChecking) {
    return (
      <main className="flex flex-1 items-center justify-center min-h-[60vh]" aria-live="polite">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" aria-label="Checking your session" />
      </main>
    );
  }

  return children;
}
