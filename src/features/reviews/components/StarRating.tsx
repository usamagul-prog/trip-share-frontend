import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  size?: 'sm' | 'md';
}

export default function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const starSize = size === 'sm' ? 'text-sm' : 'text-xl';
  const display = interactive ? (hovered || value) : value;

  return (
    <span
      className={cn('inline-flex gap-0.5', starSize)}
      role={interactive ? 'group' : undefined}
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled = display >= starValue;
        const half = !filled && display >= starValue - 0.5;

        return (
          <span
            key={i}
            className={cn(
              interactive ? 'cursor-pointer select-none transition-colors' : '',
              filled || half ? 'text-amber-400' : 'text-muted-foreground'
            )}
            onClick={interactive ? () => onChange?.(starValue) : undefined}
            onMouseEnter={interactive ? () => setHovered(starValue) : undefined}
            onMouseLeave={interactive ? () => setHovered(0) : undefined}
            aria-hidden="true"
          >
            {filled ? '★' : half ? '⭐' : '☆'}
          </span>
        );
      })}
    </span>
  );
}
