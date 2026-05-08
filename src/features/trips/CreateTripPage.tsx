import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CitySelect from './components/CitySelect';
import { CAR_MODELS } from '@/constants/carModels';
import api from '@/lib/api';

const createTripSchema = z.object({
  origin: z.string().min(2, 'Select origin city'),
  destination: z.string().min(2, 'Select destination city'),
  departure_time: z.string().min(1, 'Departure time is required'),
  seats_total: z.number().int().min(1).max(4),
  fare: z.number().int().min(1, 'Enter a fare').max(50000, 'Max fare is PKR 50,000'),
  vehicle_desc: z.string().max(100).optional(),
  vehicle_plate: z.string().regex(/^[A-Z]{2,4}-\d{3,4}$/i, 'Enter a valid Pakistani license plate (e.g. ABC-1234)').optional().or(z.literal('')),
  waypoints: z.array(z.string().min(2).max(60)).max(5).optional(),
});

type FormData = z.infer<typeof createTripSchema>;

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user && user.role !== 'driver') navigate('/trips');
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(createTripSchema),
    defaultValues: { seats_total: 1, fare: 0, waypoints: [] },
  });

  const origin = watch('origin') ?? '';
  const destination = watch('destination') ?? '';
  const seats = watch('seats_total') ?? 1;

  const onSubmit = async (data: FormData) => {
    try {
      const departureIso = new Date(data.departure_time).toISOString();
      await api.post('/trips', { ...data, departure_time: departureIso });
      toast.success('Trip posted successfully!');
      navigate('/trips');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
        'Failed to create trip';
      toast.error(msg);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Back button row */}
      <div className="flex items-center gap-2 mb-5">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Post a New Trip</h1>
        <p className="text-muted-foreground mt-1">Share your route and split the fuel cost</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

            {/* Section 1: Route */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Route
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>From</Label>
                  <CitySelect
                    value={origin}
                    onChange={(v) => setValue('origin', v, { shouldValidate: true })}
                    placeholder="Origin city"
                  />
                  {errors.origin && (
                    <p className="text-xs text-destructive">{errors.origin.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>To</Label>
                  <CitySelect
                    value={destination}
                    onChange={(v) => setValue('destination', v, { shouldValidate: true })}
                    placeholder="Destination city"
                  />
                  {errors.destination && (
                    <p className="text-xs text-destructive">{errors.destination.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t" />

            {/* Section 2: Schedule & Seats */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Schedule &amp; Seats
              </p>

              <div className="space-y-1.5">
                <Label>Departure Date &amp; Time</Label>
                <Input type="datetime-local" {...register('departure_time')} />
                {errors.departure_time && (
                  <p className="text-xs text-destructive">{errors.departure_time.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Seats (1–4)</Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-2 p-0 flex items-center justify-center text-base font-semibold shrink-0"
                      onClick={() => setValue('seats_total', Math.max(1, seats - 1))}
                      disabled={seats <= 1}
                    >
                      −
                    </Button>
                    <span className="w-8 text-center text-xl font-bold text-foreground">{seats}</span>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-2 p-0 flex items-center justify-center text-base font-semibold shrink-0"
                      onClick={() => setValue('seats_total', Math.min(4, seats + 1))}
                      disabled={seats >= 4}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Fare (PKR)</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 1500"
                    min={1}
                    max={50000}
                    {...register('fare', { valueAsNumber: true })}
                  />
                  {errors.fare && (
                    <p className="text-xs text-destructive">{errors.fare.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t" />

            {/* Section 3: Vehicle Details */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Vehicle Details
              </p>

              <div className="space-y-1.5">
                <Label>
                  Vehicle{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('vehicle_desc')}
                  defaultValue=""
                >
                  <option value="">Select car model…</option>
                  {CAR_MODELS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                {errors.vehicle_desc && (
                  <p className="text-xs text-destructive">{errors.vehicle_desc.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>
                  License Plate{' '}
                  <span className="text-muted-foreground font-normal">(optional, e.g. ABC-1234)</span>
                </Label>
                <Input
                  placeholder="ABC-1234"
                  maxLength={12}
                  {...register('vehicle_plate')}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register('vehicle_plate').onChange(e);
                  }}
                />
                {errors.vehicle_plate && (
                  <p className="text-xs text-destructive">{errors.vehicle_plate.message}</p>
                )}
              </div>
            </div>

            <div className="border-t" />

            {/* Section 4: Waypoints */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Waypoints
              </p>

              <div className="space-y-2">
                {(watch('waypoints') ?? []).map((wp, idx) => (
                  <div key={`${idx}-${(watch('waypoints') ?? []).length}`} className="flex gap-2">
                    <Input
                      placeholder={`Stop ${idx + 1}`}
                      value={wp}
                      onChange={(e) => {
                        const current = [...(watch('waypoints') ?? [])];
                        current[idx] = e.target.value;
                        setValue('waypoints', current);
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-10 rounded-full border-2 p-0 flex items-center justify-center shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive"
                      onClick={() => {
                        const current = watch('waypoints') ?? [];
                        setValue('waypoints', current.filter((_, i) => i !== idx));
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {(watch('waypoints') ?? []).length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={() => {
                      const current = watch('waypoints') ?? [];
                      setValue('waypoints', [...current, '']);
                    }}
                  >
                    + Add Waypoint
                  </Button>
                )}
                {(watch('waypoints') ?? []).length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Optional — add up to 5 intermediate stops.
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold shadow-md shadow-primary/30"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Trip'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
