# TripShare — Product Specification

## Problem

Intercity travel in Pakistan is expensive and unreliable. Fuel prices have doubled since 2022, making solo driving unsustainable for regular commuters. At the same time, intercity buses are overcrowded, slow, and uncomfortable. There is no platform connecting drivers who have empty seats on known routes with riders who want affordable, door-to-door alternatives.

## Solution

TripShare is a carpooling marketplace for Pakistan's intercity corridors. Drivers post upcoming trips with available seats and a price per seat. Riders search, browse, and book a seat — specifying a custom pickup point along the route. Payment is cash on arrival; digital payments (JazzCash, EasyPaisa) are planned for v2.

## Target Routes (MVP)
- Islamabad ↔ Mardan
- Lahore ↔ Faisalabad
- Karachi ↔ Hyderabad

## Live URLs
- Frontend: https://trip-share-frontend.vercel.app
- Backend API: https://backend-production-636e.up.railway.app
- Health check: https://backend-production-636e.up.railway.app/api/health

---

## Core Features

### Authentication
- Email + password registration and login
- JWT session tokens: 15-minute access token, 7-day refresh token
- Role-based access: `rider`, `driver`, `admin`
- Password change with current-password verification

### Trip Management (Driver)
- Create a trip: origin, destination, departure date/time, available seats, price per seat, vehicle info
- Edit or cancel upcoming trips
- View all bookings on a trip
- Accept or reject individual booking requests

### Booking (Rider)
- Search trips by origin, destination, and date
- View trip details: driver profile, rating, vehicle, price
- Book one or more seats with a custom pickup note
- Cancel a booking before trip departure

### Reviews & Ratings
- After a completed trip, both driver and rider can submit a rating (1–5 stars) and comment
- Ratings aggregate on user profiles with average score and count

### Real-time Chat
- Socket.io chat between confirmed booking pairs (driver ↔ rider)
- Message history persisted in MongoDB
- Load-earlier pagination for long chat histories

### Notifications
- In-app notification feed for: booking confirmed/rejected, trip cancelled, new chat message
- Load-more pagination

### Admin Panel
- Dashboard: total users, trips, bookings by status
- User management: view profiles, ban/unban
- Trip moderation: cancel any trip regardless of driver
- Booking oversight: cancel any booking

---

## Data Models

### User
```typescript
{
  _id: ObjectId
  email: string
  passwordHash: string
  name: string
  phone?: string
  avatar?: string          // Cloudinary URL
  role: 'rider' | 'driver' | 'admin'
  rating: { average: number; count: number }
  banned: boolean
  createdAt: Date
}
```

### Trip
```typescript
{
  _id: ObjectId
  driver: ObjectId         // ref User
  origin: string
  destination: string
  departureDate: string    // YYYY-MM-DD
  departureTime: string    // HH:mm
  seats: number
  seatsAvailable: number
  pricePerSeat: number
  vehicle: { make: string; model: string; color: string; plate: string }
  status: 'active' | 'cancelled' | 'completed'
  createdAt: Date
}
```

### Booking
```typescript
{
  _id: ObjectId
  trip: ObjectId           // ref Trip
  rider: ObjectId          // ref User
  seats: number
  pickupNote?: string
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled'
  createdAt: Date
}
```

### Message
```typescript
{
  _id: ObjectId
  booking: ObjectId        // ref Booking
  sender: ObjectId         // ref User
  text: string
  createdAt: Date
}
```

### Notification
```typescript
{
  _id: ObjectId
  user: ObjectId           // ref User
  type: 'booking_confirmed' | 'booking_rejected' | 'trip_cancelled' | 'new_message'
  message: string
  read: boolean
  createdAt: Date
}
```

### Review
```typescript
{
  _id: ObjectId
  reviewer: ObjectId       // ref User
  reviewee: ObjectId       // ref User
  trip: ObjectId           // ref Trip
  rating: number           // 1–5
  comment?: string
  createdAt: Date
}
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register new user |
| POST | /api/auth/login | — | Login, returns tokens |
| POST | /api/auth/refresh | — | Refresh access token |
| POST | /api/auth/change-password | user | Change password |
| GET | /api/trips | — | Search trips (query: origin, destination, date) |
| POST | /api/trips | driver | Create trip |
| GET | /api/trips/:id | — | Trip detail |
| PATCH | /api/trips/:id | driver | Update trip |
| DELETE | /api/trips/:id | driver | Cancel trip |
| POST | /api/bookings | rider | Book a seat |
| GET | /api/bookings | user | List my bookings |
| PATCH | /api/bookings/:id/accept | driver | Accept booking |
| PATCH | /api/bookings/:id/reject | driver | Reject booking |
| PATCH | /api/bookings/:id/cancel | rider | Cancel booking |
| GET | /api/messages/:bookingId | user | Get chat messages |
| POST | /api/messages | user | Send message |
| GET | /api/notifications | user | List notifications |
| PATCH | /api/notifications/:id/read | user | Mark notification read |
| POST | /api/reviews | user | Submit review |
| GET | /api/users/:id | — | Public user profile |
| GET | /api/admin/stats | admin | Dashboard stats |
| GET | /api/admin/users | admin | All users |
| PATCH | /api/admin/users/:id/ban | admin | Ban/unban user |
| GET | /api/admin/trips | admin | All trips |
| DELETE | /api/admin/trips/:id | admin | Cancel any trip |
| GET | /api/admin/bookings | admin | All bookings |
| DELETE | /api/admin/bookings/:id | admin | Cancel any booking |

---

## Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 19 + Vite | Fast HMR, modern React features |
| Styling | TailwindCSS 4 | Utility-first, no runtime overhead |
| State | Zustand | Lightweight, no boilerplate |
| Forms | React Hook Form + Zod | Performant, schema-driven validation |
| Backend | Express 5 + TypeScript | Familiar, async-first |
| Database | MongoDB (Mongoose) | Flexible schema, good for rapid iteration |
| Auth | JWT (access + refresh) | Stateless, works across mobile/web |
| Real-time | Socket.io | Reliable room-based chat |
| Files | Cloudinary | Managed image upload + transforms |
| Email | Resend | Simple transactional email API |
| Frontend deploy | Vercel | Zero-config, instant previews |
| Backend deploy | Railway | Simple Node.js hosting |

---

## Development Approach

Built entirely with Claude Code as the primary development tool, from initial scaffolding through to UI polish. Every feature was specified, implemented, and reviewed within Claude Code sessions. See `prompt-log.md` for the most effective and least effective prompts used during development.
