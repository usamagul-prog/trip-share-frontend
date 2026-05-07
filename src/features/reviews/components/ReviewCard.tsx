import { Review } from '@/features/trips/types';
import StarRating from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
  perspective: 'received' | 'given';
}

export default function ReviewCard({ review, perspective }: ReviewCardProps) {
  const person = perspective === 'received' ? review.reviewer : review.reviewee;
  const label = perspective === 'received' ? 'From' : 'For';
  const date = new Date(review.createdAt).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex gap-3 py-3 border-b last:border-b-0">
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarImage src={person.avatar_url} />
        <AvatarFallback>{person.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">
            <span className="text-muted-foreground text-xs mr-1">{label}:</span>
            {person.name}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">{date}</span>
        </div>
        <StarRating value={review.rating} size="sm" />
        {review.comment && (
          <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
        )}
      </div>
    </div>
  );
}
