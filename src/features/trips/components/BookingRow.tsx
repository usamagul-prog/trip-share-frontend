import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Booking } from '../types';

interface Props {
  booking: Booking;
  onAccept: () => void;
  onReject: () => void;
  disabled: boolean;
}

const statusVariant: Record<Booking['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  confirmed: 'default',
  rejected: 'destructive',
  cancelled: 'outline',
  completed: 'outline',
};

export default function BookingRow({ booking, onAccept, onReject, disabled }: Props) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{booking.rider.name}</p>
        <p className="text-xs text-muted-foreground">{booking.rider.phone}</p>
        <p className="text-xs text-muted-foreground">Pickup: {booking.pickup_point}</p>
      </div>
      <div className="flex items-center gap-2 ml-3">
        <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
        {booking.status === 'pending' && (
          <>
            <Button size="xs" onClick={onAccept} disabled={disabled}>
              Accept
            </Button>
            <Button size="xs" variant="destructive" onClick={onReject} disabled={disabled}>
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
