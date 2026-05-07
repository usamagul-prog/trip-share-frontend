import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trip } from '../types';
import StarRating from '@/features/reviews/components/StarRating';

interface Props {
  trip: Trip;
}

const statusVariant: Record<Trip['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  scheduled: 'default',
  active: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
};

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow p-0"
      onClick={() => navigate(`/trips/${trip._id}`)}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-semibold text-sm">
              {trip.origin} → {trip.destination}
            </span>
          </div>
          <Badge variant={statusVariant[trip.status]}>{trip.status}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              {new Date(trip.departure_time).toLocaleString('en-PK', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 shrink-0" />
            <span>
              {trip.seats_available}/{trip.seats_total} seats
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Banknote className="h-3 w-3 shrink-0" />
            <span>PKR {trip.fare.toLocaleString()}</span>
          </div>
        </div>

        {trip.driver.avg_rating !== undefined && trip.driver.avg_rating > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <StarRating value={trip.driver.avg_rating} size="sm" />
            <span>({trip.driver.review_count ?? 0})</span>
          </span>
        )}
      </CardContent>
    </Card>
  );
}
