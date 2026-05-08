import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Banknote, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingWithTrip, BookingStatus } from '@/features/trips/types';

const STATUS_STYLES: Record<BookingStatus, string> = {
  pending:   'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  confirmed: 'bg-primary/10 text-primary border border-primary/20',
  rejected:  'bg-destructive/10 text-destructive border border-destructive/20',
  cancelled: 'bg-destructive/10 text-destructive border border-destructive/20',
  completed: 'bg-muted text-muted-foreground border border-border',
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
    <div
      role="button"
      tabIndex={0}
      className="bg-card border rounded-xl p-4 cursor-pointer group hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-200"
      onClick={() => navigate(`/trips/${trip._id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/trips/${trip._id}`);
      }}
    >
      {/* Route row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
          <span className="font-semibold text-sm text-foreground truncate">{trip.origin}</span>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="h-2 w-2 rounded-full bg-primary/40 shrink-0" />
          <span className="font-semibold text-sm text-foreground truncate">{trip.destination}</span>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ml-2 capitalize ${STATUS_STYLES[booking.status]}`}>
          {booking.status}
        </span>
      </div>

      {/* Details row */}
      <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>
            {new Date(trip.departure_time).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Banknote className="h-3.5 w-3.5 shrink-0" />
          <span className="text-foreground font-semibold">PKR {trip.fare.toLocaleString()}</span>
        </div>
      </div>

      {/* Pickup */}
      <div className="mt-2.5 pt-2.5 border-t flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Pickup: {booking.pickup_point}</span>
      </div>

      {(canCancel || ['confirmed', 'completed'].includes(booking.status)) && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {['confirmed', 'completed'].includes(booking.status) && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); navigate(`/chat/${booking._id}`); }}
            >
              <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
              Chat
            </Button>
          )}
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
        </div>
      )}
    </div>
  );
}
