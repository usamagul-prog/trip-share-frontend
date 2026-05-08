import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface BookingWithChat {
  _id: string;
  status: string;
  trip: {
    _id: string;
    origin: string;
    destination: string;
    departure_time: string;
    driver?: { _id: string; name: string };
  };
  rider?: { _id: string; name: string };
}

export default function ChatListPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingWithChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<{ bookings: BookingWithChat[] }>('/bookings?tab=all')
      .then((r) => setBookings(r.data.bookings ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chatableBookings = bookings.filter((b) =>
    ['confirmed', 'completed'].includes(b.status),
  );

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && chatableBookings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <MessageCircle className="mx-auto mb-3 opacity-30" size={48} />
          <p className="font-medium">No conversations yet</p>
          <p className="text-sm mt-1">Confirmed bookings will appear here</p>
        </div>
      )}

      <div className="space-y-2">
        {chatableBookings.map((booking) => (
          <button
            key={booking._id}
            className="w-full flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left"
            onClick={() => navigate(`/chat/${booking._id}`)}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {booking.trip.origin} → {booking.trip.destination}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {new Date(booking.trip.departure_time).toLocaleDateString('en-PK')}
                {booking.trip.driver && ` · ${booking.trip.driver.name}`}
              </p>
            </div>
            <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
