
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
}

export function StarRating({ rating, totalStars = 5, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-5 w-5',
            rating > index ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
          )}
        />
      ))}
    </div>
  );
}
