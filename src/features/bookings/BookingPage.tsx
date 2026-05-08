import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useTrip } from '@/features/trips/hooks/useTrip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/api';
import PickupMap from '@/components/map/PickupMap';
import { CITY_COORDS } from '@/constants/cityCoords';

interface FormData {
  pickup_point: string;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { trip, loading } = useTrip(id ?? '');
  const { register, handleSubmit, setValue, formState: { isSubmitting, errors } } = useForm<FormData>();
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (user !== null && user.role !== 'rider') {
      navigate('/trips');
    }
  }, [user, navigate]);

  if (!id) return null;

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/api/bookings', { trip_id: id, pickup_point: data.pickup_point });
      toast.success('Booking request sent');
      navigate('/bookings');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to submit booking';
      toast.error(msg);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;
  }

  if (!trip) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Back</Button>
        <p className="text-center text-destructive mt-6">Trip not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-lg space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>← Back</Button>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{trip.origin} → {trip.destination}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="text-muted-foreground">
            {new Date(trip.departure_time).toLocaleString('en-PK', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
          <p className="font-semibold">PKR {trip.fare.toLocaleString()}</p>
          <p className="text-muted-foreground">Driver: {trip.driver.name}</p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Your Pickup Point</label>

          {CITY_COORDS[trip.origin] && (
            <PickupMap
              city={trip.origin}
              onPickup={({ lat, lng, label }) => {
                setMapCoords({ lat, lng });
                setValue('pickup_point', label, { shouldValidate: true });
              }}
              className="h-52"
            />
          )}

          <textarea
            id="pickup_point"
            {...register('pickup_point', {
              required: 'Pickup point is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
              maxLength: { value: 200, message: 'Maximum 200 characters' },
            })}
            placeholder={mapCoords ? `${mapCoords.lat.toFixed(5)}, ${mapCoords.lng.toFixed(5)}` : 'e.g. Sector F-10 Markaz, near Jinnah Super'}
            rows={2}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none mt-2"
          />
          {errors.pickup_point && (
            <p className="text-xs text-destructive mt-1">{errors.pickup_point.message}</p>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Cash on arrival — pay the driver directly.
        </p>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Booking Request'}
        </Button>
      </form>
    </div>
  );
}
