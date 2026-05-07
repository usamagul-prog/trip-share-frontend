import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Banknote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookingWithTrip, BookingStatus } from '@/features/trips/types';

const statusVariant: Record<
  BookingStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  pending:   'secondary',
  confirmed: 'default',
  rejected:  'destructive',
  cancelled: 'destructive',
  completed: 'outline',
};

interface Props {
  booking: BookingWithTrip;
  onCancel?: () => void;
  cancelLoading?: boolean;
}

export default function BookingCard({ booking, onCancel, cancelLoading }: Props) {
  const navigate = useNavigate();
  const { trip } = booking;
  const isUpcoming = ['pending', 'confirmed'].includes(booking.status);
  const isPast = new Date(trip.departure_time) < new Date();
  const canCancel = isUpcoming && !isPast;

  return (
    <Card
      role="button"
      tabIndex={0}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/trips/${trip._id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/trips/${trip._id}`);
      }}
    >
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="font-semibold text-sm">
              {trip.origin} → {trip.destination}
            </span>
          </div>
          <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
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
            <Banknote className="h-3 w-3 shrink-0" />
            <span>PKR {trip.fare.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">Pickup: {booking.pickup_point}</p>

        {canCancel && onCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            disabled={cancelLoading}
          >
            Cancel Booking
          </Button>
        )}

        {booking.status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${booking.trip._id}/review?bookingId=${booking._id}`);
            }}
          >
            Leave Review
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
