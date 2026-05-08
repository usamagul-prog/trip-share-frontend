export interface AdminUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: 'driver' | 'rider' | 'admin';
  status: 'active' | 'suspended';
  suspension_reason?: string;
  avg_rating: number;
  review_count: number;
  createdAt: string;
}

export interface AdminBooking {
  _id: string;
  trip: {
    _id: string;
    origin: string;
    destination: string;
    departure_time: string;
    fare: number;
  };
  status: string;
  pickup_point: string;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUser {
  trips: AdminTrip[];
  bookings: AdminBooking[];
}

export interface AdminTrip {
  _id: string;
  origin: string;
  destination: string;
  departure_time: string;
  seats_total: number;
  seats_available: number;
  fare: number;
  status: string;
  driver: { _id: string; name: string; phone: string };
  bookingCount: number;
  createdAt: string;
}

export interface AdminTripDetail extends AdminTrip {
  bookings: Array<{
    _id: string;
    rider: { _id: string; name: string; phone: string };
    status: string;
    pickup_point: string;
  }>;
}

export interface AdminStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface AdminMetrics {
  users: { total: number; drivers: number; riders: number };
  trips: { active: number; today: number; thisWeek: number; thisMonth: number };
  bookings: { today: number; thisWeek: number; thisMonth: number; pending: number };
}

export interface AdminBookingFull {
  _id: string;
  status: string;
  pickup_point: string;
  seats: number;
  payment_method: string;
  rider: { _id: string; name: string; phone: string };
  trip: {
    _id: string;
    origin: string;
    destination: string;
    departure_time: string;
    fare: number;
    driver: { _id: string; name: string; phone: string };
  };
  createdAt: string;
}

export interface AdminReport {
  _id: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  reason: string;
  reporter: { _id: string; name: string; phone: string };
  message: { _id: string; text: string; sender: { _id: string; name: string } };
  booking: string;
  createdAt: string;
}
