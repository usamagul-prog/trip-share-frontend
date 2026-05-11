# Add Component

Scaffold a new React component following TripShare frontend conventions.

## Checklist
- [ ] File in `src/components/` (reusable) or `src/pages/` (route-level)
- [ ] All props explicitly typed — no implicit `any`
- [ ] Use `class-variance-authority` for variant-based styling
- [ ] Global state via Zustand store; local UI state via `useState`
- [ ] Forms use React Hook Form + Zod resolver
- [ ] Internal links use `<Link>` from `react-router-dom`, never `<a>`
- [ ] No direct DOM manipulation

## Basic Component

```tsx
// src/components/TripCard.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { Link } from 'react-router-dom';

const cardVariants = cva(
  'rounded-xl border p-4 transition-shadow hover:shadow-md',
  {
    variants: {
      status: {
        active: 'bg-white border-gray-200',
        cancelled: 'bg-gray-50 border-gray-200 opacity-60',
        completed: 'bg-green-50 border-green-200',
      },
    },
    defaultVariants: { status: 'active' },
  }
);

interface TripCardProps extends VariantProps<typeof cardVariants> {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  seatsAvailable: number;
  pricePerSeat: number;
}

export function TripCard({
  id,
  origin,
  destination,
  departureDate,
  seatsAvailable,
  pricePerSeat,
  status,
}: TripCardProps) {
  return (
    <Link to={`/trips/${id}`} className={cardVariants({ status })}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-900">{origin} → {destination}</p>
          <p className="text-sm text-gray-500 mt-1">{departureDate}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-blue-600">PKR {pricePerSeat}</p>
          <p className="text-xs text-gray-500">{seatsAvailable} seats left</p>
        </div>
      </div>
    </Link>
  );
}
```

## Form Component

```tsx
// src/components/SearchForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const searchSchema = z.object({
  origin: z.string().min(1, 'Origin is required'),
  destination: z.string().min(1, 'Destination is required'),
  date: z.string().min(1, 'Date is required'),
});

type SearchData = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (data: SearchData) => void;
  loading?: boolean;
}

export function SearchForm({ onSearch, loading = false }: SearchFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchData>({ resolver: zodResolver(searchSchema) });

  return (
    <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
      <div>
        <input
          {...register('origin')}
          placeholder="From"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.origin && (
          <p className="text-red-500 text-xs mt-1">{errors.origin.message}</p>
        )}
      </div>
      <div>
        <input
          {...register('destination')}
          placeholder="To"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.destination && (
          <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
        )}
      </div>
      <div>
        <input
          {...register('date')}
          type="date"
          className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search Trips'}
      </button>
    </form>
  );
}
```

## Component with Zustand

```tsx
// src/components/NotificationBell.tsx
import { useNotificationStore } from '../store/notificationStore';

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotificationStore();

  return (
    <div className="relative">
      <button onClick={markAllRead} className="relative p-2">
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
```
