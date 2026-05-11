# Add API Call

Add a typed API function and wire it into a Zustand store slice.

## Checklist
- [ ] API function in `src/api/` — one file per domain (e.g. `trips.ts`, `bookings.ts`)
- [ ] Response type defined as a TypeScript interface or Zod schema
- [ ] Auth token read from Zustand auth store (or injected via axios interceptor)
- [ ] Corresponding Zustand store slice in `src/store/` with loading + error states
- [ ] Store action is `async`, uses `set()` for loading/error/data lifecycle

## API Function

```typescript
// src/api/trips.ts
import { api } from './client'; // shared axios instance

export interface Trip {
  _id: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  seatsAvailable: number;
  pricePerSeat: number;
  driver: { _id: string; name: string; rating: { average: number; count: number } };
  status: 'active' | 'cancelled' | 'completed';
}

export interface TripSearchParams {
  origin: string;
  destination: string;
  date: string;
}

export async function searchTrips(params: TripSearchParams): Promise<Trip[]> {
  const { data } = await api.get<Trip[]>('/trips', { params });
  return data;
}

export async function getTripById(id: string): Promise<Trip> {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
}

export async function createTrip(payload: Omit<Trip, '_id' | 'driver' | 'status'>): Promise<Trip> {
  const { data } = await api.post<Trip>('/trips', payload);
  return data;
}
```

## Zustand Store Slice

```typescript
// src/store/tripsStore.ts
import { create } from 'zustand';
import { searchTrips, getTripById, Trip, TripSearchParams } from '../api/trips';

interface TripsState {
  trips: Trip[];
  selectedTrip: Trip | null;
  loading: boolean;
  error: string | null;
  search: (params: TripSearchParams) => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTripsStore = create<TripsState>((set) => ({
  trips: [],
  selectedTrip: null,
  loading: false,
  error: null,

  search: async (params) => {
    set({ loading: true, error: null });
    try {
      const trips = await searchTrips(params);
      set({ trips, loading: false });
    } catch {
      set({ error: 'Failed to load trips. Please try again.', loading: false });
    }
  },

  fetchTrip: async (id) => {
    set({ loading: true, error: null });
    try {
      const trip = await getTripById(id);
      set({ selectedTrip: trip, loading: false });
    } catch {
      set({ error: 'Trip not found.', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
```

## Shared Axios Client

```typescript
// src/api/client.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Usage in Component

```tsx
import { useEffect } from 'react';
import { useTripsStore } from '../store/tripsStore';

export function TripList() {
  const { trips, loading, error, search } = useTripsStore();

  useEffect(() => {
    search({ origin: 'Islamabad', destination: 'Lahore', date: '2026-05-15' });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ul>
      {trips.map((trip) => (
        <li key={trip._id}>{trip.origin} → {trip.destination}</li>
      ))}
    </ul>
  );
}
```
