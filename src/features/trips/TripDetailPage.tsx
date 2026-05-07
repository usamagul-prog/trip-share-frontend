import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MapPin, Clock, Users, Banknote, Car } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTrip } from './hooks/useTrip';
import BookingRow from './components/BookingRow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import { Trip } from './types';

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

  const isDriver = !!user && !!trip && user._id === trip.driver._id;

  const handleAccept = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await api.put(`/api/bookings/${bookingId}/accept`);
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
      await api.put(`/api/bookings/${bookingId}/reject`);
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
      await api.patch(`/api/trips/${trip._id}/cancel`);
      toast.success('Trip cancelled');
      navigate('/');
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
      await api.put(`/api/trips/${trip._id}/complete`);
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
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <p className="text-center text-destructive mt-6">{error || 'Trip not found'}</p>
      </div>
    );
  }

  const isPast = new Date(trip.departure_time) < new Date();

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl leading-tight">
              {trip.origin} → {trip.destination}
            </CardTitle>
            <Badge variant={statusVariant[trip.status]}>{trip.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {new Date(trip.departure_time).toLocaleString('en-PK', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>PKR {trip.fare.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>
                {trip.seats_available}/{trip.seats_total} seats available
              </span>
            </div>
            {trip.vehicle_desc && (
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="truncate">{trip.vehicle_desc}</span>
              </div>
            )}
          </div>

          {trip.waypoints && trip.waypoints.length > 0 && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Waypoints</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  {trip.waypoints.map((wp, i) => (
                    <li key={i}>{wp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="border-t pt-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Driver
            </p>
            <p className="text-sm font-medium">{trip.driver.name}</p>
            <p className="text-sm text-muted-foreground">{trip.driver.phone}</p>
          </div>
        </CardContent>
      </Card>

      {!isDriver && user?.role === 'rider' && trip.status === 'scheduled' && trip.seats_available > 0 && (
        <Button className="w-full" onClick={() => navigate(`/trips/${trip._id}/book`)}>
          Request a Seat — PKR {trip.fare.toLocaleString()}
        </Button>
      )}

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
                className="flex-1"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                Cancel Trip
              </Button>
              {isPast && (
                <Button
                  className="flex-1"
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
    </div>
  );
}
