import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Clock, Users, Banknote, Car, ArrowRight, ChevronLeft } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useAuthStore } from '@/store/authStore';
import { useTrip } from './hooks/useTrip';
import BookingRow from './components/BookingRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { Trip } from './types';
import StarRating from '@/features/reviews/components/StarRating';
import RouteMap from '@/components/map/RouteMap';
import { CITY_COORDS } from '@/constants/cityCoords';

const statusVariant: Record<Trip['status'], 'default' | 'secondary' | 'outline' | 'destructive'> = {
  scheduled: 'default',
  active: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
};

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trip, loading, error, refetch } = useTrip(id!);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const isDriver = !!user && !!trip && user._id === trip.driver._id;

  const handleAccept = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/accept`);
      toast.success('Booking accepted');
      refetch();
    } catch {
      toast.error('Failed to accept booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await api.put(`/bookings/${bookingId}/reject`);
      toast.success('Booking rejected');
      refetch();
    } catch {
      toast.error('Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await api.patch(`/trips/${trip._id}/cancel`);
      toast.success('Trip cancelled');
      navigate('/trips');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to cancel trip';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!trip) return;
    setActionLoading(true);
    try {
      await api.put(`/trips/${trip._id}/complete`);
      toast.success('Trip marked as completed');
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to complete trip';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-muted animate-pulse" />
          <div className="h-7 w-32 rounded bg-muted animate-pulse" />
        </div>
        <div className="rounded-xl border overflow-hidden space-y-0">
          <div className="h-24 bg-muted/50 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="h-4 flex-1 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-28 rounded bg-muted animate-pulse" />
                <div className="h-3 w-20 rounded bg-muted animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <p className="text-center text-destructive mt-6">{error || 'Trip not found'}</p>
      </div>
    );
  }

  const isPast = new Date(trip.departure_time) < new Date();
  const driverInitial = trip.driver.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      {/* Page header row */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Trip Details</h1>
      </div>

      {/* Main card */}
      <Card className="overflow-hidden p-0">
        {/* Route banner */}
        <div className="bg-primary/5 border-b px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl font-bold text-foreground truncate">{trip.origin}</span>
            <ArrowRight className="h-5 w-5 text-primary shrink-0" />
            <span className="text-2xl font-bold text-foreground truncate">{trip.destination}</span>
          </div>
          <Badge variant={statusVariant[trip.status]} className="shrink-0 capitalize">
            {trip.status}
          </Badge>
        </div>

        <CardContent className="p-5 space-y-5">
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="text-sm font-medium leading-tight">
                  {new Date(trip.departure_time).toLocaleString('en-PK', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Banknote className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Fare</p>
                <p className="text-sm font-medium leading-tight">PKR {trip.fare.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Seats</p>
                <p className="text-sm font-medium leading-tight">
                  {trip.seats_available}/{trip.seats_total} available
                </p>
              </div>
            </div>

            {trip.vehicle_desc && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Car className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="text-sm font-medium leading-tight truncate">{trip.vehicle_desc}</p>
                </div>
              </div>
            )}
          </div>

          {/* Waypoints */}
          {trip.waypoints && trip.waypoints.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Waypoints</p>
                <ul className="text-sm text-foreground space-y-0.5">
                  {trip.waypoints.map((wp, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
                      {wp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Driver section */}
          <div className="border-t pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Driver
            </p>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                {driverInitial}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold">{trip.driver.name}</p>
                <p className="text-sm text-muted-foreground">{trip.driver.phone}</p>
                {trip.driver.avg_rating !== undefined && trip.driver.avg_rating > 0 && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <StarRating value={trip.driver.avg_rating} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {trip.driver.avg_rating.toFixed(1)} ({trip.driver.review_count ?? 0} review{trip.driver.review_count !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route map */}
          {CITY_COORDS[trip.origin] && CITY_COORDS[trip.destination] && (
            <div className="border-t pt-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Route Preview
              </p>
              <RouteMap origin={trip.origin} destination={trip.destination} className="h-44" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book button */}
      {!isDriver && user?.role === 'rider' && trip.status === 'scheduled' && trip.seats_available > 0 && (
        <Button
          className="w-full h-12 text-base font-semibold shadow-md shadow-primary/30"
          onClick={() => navigate(`/trips/${trip._id}/book`)}
        >
          Request a Seat — PKR {trip.fare.toLocaleString()}
        </Button>
      )}

      {/* Driver actions */}
      {isDriver && (
        <>
          {trip.bookings && trip.bookings.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Booking Requests ({trip.bookings.length})</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {trip.bookings.map((booking) => (
                  <BookingRow
                    key={booking._id}
                    booking={booking}
                    onAccept={() => handleAccept(booking._id)}
                    onReject={() => handleReject(booking._id)}
                    disabled={actionLoading}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {trip.status === 'scheduled' && (
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={() => setShowCancelConfirm(true)}
                disabled={actionLoading}
              >
                Cancel Trip
              </Button>
              {isPast && (
                <Button
                  className="flex-1 h-11 font-semibold shadow-md shadow-primary/30"
                  onClick={handleComplete}
                  disabled={actionLoading}
                >
                  Mark as Complete
                </Button>
              )}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Cancel this trip?"
        description="All pending bookings will be rejected and riders will be notified. This cannot be undone."
        confirmLabel="Yes, cancel trip"
        variant="destructive"
        onConfirm={handleCancel}
        loading={actionLoading}
      />
    </div>
  );
}
