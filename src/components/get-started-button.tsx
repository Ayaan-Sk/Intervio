
'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';

export function GetStartedButton() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Skeleton className="h-12 w-48" />;
  }

  const href = user ? '/app' : '/signup';

  return (
    <Button size="lg" className="font-semibold" asChild>
      <Link href={href}>Get Started for Free</Link>
    </Button>
  );
}
