
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function AppRedirector() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      router.replace('/login');
      return;
    }

    const checkUserRole = async () => {
      try {
        const idTokenResult = await user.getIdTokenResult();
        // In a real app, you would set a custom claim like `role: 'hr'`
        // during user signup or via a backend process.
        // For this demo, we'll simulate it by checking the display name.
        if (idTokenResult.claims.role === 'hr' || user.displayName?.toLowerCase().includes('hr')) {
          router.replace('/app/hr');
        } else {
          router.replace('/app/candidate');
        }
      } catch (error) {
        console.error("Error getting user token:", error);
        // Default to candidate page on error
        router.replace('/app/candidate');
      }
    };

    checkUserRole();

  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
