import { useNavigate } from 'react-router-dom';
import { Clock, Users, Banknote, ArrowRight, Star } from 'lucide-react';
import { Trip } from '../types';

interface Props {
  trip: Trip;
}

const STATUS_STYLES: Record<Trip['status'], string> = {
  scheduled: 'bg-primary/10 text-primary border border-primary/20',
  active:    'bg-green-500/10 text-green-600 border border-green-500/20',
  completed: 'bg-muted text-muted-foreground border border-border',
  cancelled: 'bg-destructive/10 text-destructive border border-destructive/20',
};

export default function TripCard({ trip }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-card border rounded-xl p-4 cursor-pointer group hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-200"
      onClick={() => navigate(`/trips/${trip._id}`)}
    >
      {/* Route row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            <span className="font-semibold text-sm truncate">{trip.origin}</span>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary/40 shrink-0" />
            <span className="font-semibold text-sm truncate">{trip.destination}</span>
          </div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full shrink-0 ml-2 ${STATUS_STYLES[trip.status]}`}>
          {trip.status}
        </span>
      </div>

      {/* Details row */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {new Date(trip.departure_time).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" />
          <span>{trip.seats_available}/{trip.seats_total} seats</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <Banknote className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold text-foreground text-sm">PKR {trip.fare.toLocaleString()}</span>
        </div>
      </div>

      {/* Driver rating if present */}
      {trip.driver.avg_rating !== undefined && trip.driver.avg_rating > 0 && (
        <div className="mt-2.5 pt-2.5 border-t flex items-center gap-1.5">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-amber-600">{trip.driver.avg_rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({trip.driver.review_count ?? 0} reviews)</span>
        </div>
      )}
    </div>
  );
}
