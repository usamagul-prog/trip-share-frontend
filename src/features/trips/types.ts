export interface Trip {
  _id: string;
  driver: { _id: string; name: string; phone: string; avatar_url?: string };
  origin: string;
  destination: string;
  departure_time: string;
  seats_total: number;
  seats_available: number;
  fare: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  vehicle_desc?: string;
  waypoints?: string[];
  createdAt: string;
}

export interface Booking {
  _id: string;
  rider: { _id: string; name: string; phone: string };
  pickup_point: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
}

export interface TripWithBookings extends Trip {
  bookings: Booking[];
}
