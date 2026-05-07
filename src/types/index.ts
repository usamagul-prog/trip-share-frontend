export interface User {
  _id: string;
  name: string;
  phone: string;
  role: 'driver' | 'rider' | 'admin';
  avatar_url?: string;
  is_verified: boolean;
}

export interface Trip {
  _id: string;
  driver: User;
  origin: string;
  destination: string;
  departure_time: string;
  seats_available: number;
  fare: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
}

export interface Booking {
  _id: string;
  trip: Trip;
  rider: User;
  pickup_point: string;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_method: 'cash';
}
