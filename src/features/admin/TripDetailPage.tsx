import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import adminApi from '@/lib/adminApi';
import type { AdminTripDetail } from './types';

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<AdminTripDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get<{ trip: AdminTripDetail }>(`/admin/trips/${id}`)
      .then(({ data }) => setTrip(data.trip))
      .catch(() => toast.error('Trip not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (!trip) return <div className="p-8 text-gray-500">Trip not found</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate('/admin/trips')} className="text-sm text-gray-500 hover:text-gray-700 mb-4">← Back to Trips</button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{trip.origin} → {trip.destination}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Info label="Driver" value={`${trip.driver.name} (${trip.driver.phone})`} />
          <Info label="Departure" value={new Date(trip.departure_time).toLocaleString()} />
          <Info label="Seats" value={`${trip.seats_available} available / ${trip.seats_total} total`} />
          <Info label="Fare" value={`PKR ${trip.fare}`} />
          <Info label="Status" value={trip.status} />
          <Info label="Bookings" value={String(trip.bookingCount)} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-4">Bookings ({trip.bookings.length})</h3>
        {trip.bookings.length === 0 ? (
          <p className="text-sm text-gray-500">No bookings</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                {['Rider', 'Phone', 'Status', 'Pickup Point'].map((h) => (
                  <th key={h} className="text-left pb-2 text-xs text-gray-500 uppercase font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trip.bookings.map((b) => (
                <tr key={b._id} className="border-b last:border-0">
                  <td className="py-2">{b.rider.name}</td>
                  <td className="py-2">{b.rider.phone}</td>
                  <td className="py-2 capitalize">{b.status}</td>
                  <td className="py-2">{b.pickup_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-gray-500 text-xs uppercase font-medium">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
