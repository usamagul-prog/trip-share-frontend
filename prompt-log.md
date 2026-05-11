# TripShare — Claude Code Prompt Log

Documenting the 5 most effective and 3 least effective prompts used during development.

---

## 5 Best Prompts

### 1. Full Project Scaffolding (Phase 3)

**Prompt:**
> Scaffold both repos following this structure exactly. Backend: `src/routes/`, `src/controllers/`, `src/services/`, `src/models/`, `src/middleware/`, `src/utils/`. Frontend: `src/pages/`, `src/components/`, `src/store/`, `src/api/`, `src/schemas/`, `src/types/`. Install only these packages [full list provided]. Create `.env.example` in each with all required keys documented. Create `README.md` with setup instructions. Create a working health check at `GET /api/health`. Do not write any feature code yet.

**Why it worked:**
Extremely specific — named every directory, every package, and every constraint. Saying "do not write any feature code yet" prevented scope creep. The health check gave an immediate deployability test. Output required zero revision.

**Lesson:** When scaffolding, more constraints = better output. Vague prompts like "set up the project" produce inconsistent directory layouts that require painful cleanup.

---

### 2. JWT Auth with Refresh Token Flow

**Prompt:**
> Implement email + password auth end-to-end. Backend: POST /api/auth/register (hash with bcrypt, return access + refresh tokens), POST /api/auth/login (same), POST /api/auth/refresh (verify refresh token in DB, issue new access token, rotate refresh token). Access token: 15m, RS256 would be ideal but HS256 is fine. Refresh token: 7d, store hashed in User model, one valid at a time. Frontend: store access token in memory (Zustand), refresh token in httpOnly cookie (if possible, else localStorage with a note). Add an axios interceptor that retries the original request once if it gets a 401 and the refresh succeeds. Type everything — no `any`.

**Why it worked:**
Named every endpoint, the exact TTLs, the storage strategy, the token rotation policy, and the interceptor behaviour. The note "(if possible, else localStorage with a note)" let Claude make a pragmatic decision without getting stuck. Output was production-quality with zero back-and-forth.

**Lesson:** Auth is security-critical. Vague prompts produce insecure defaults. Specifying rotation, storage, and interceptor behaviour up front avoids 3-4 revision cycles.

---

### 3. Real-time Chat with Socket.io

**Prompt:**
> Add real-time chat between confirmed booking pairs. Socket.io on the backend, already installed. Room naming: `booking:{bookingId}`. On connect, verify the JWT from the handshake `auth.token` field. Only allow join if the user is the trip driver or the booking rider. Persist every message to MongoDB as a Message document `{ booking, sender, text, createdAt }`. On the frontend, connect in a `useChatSocket` hook that takes `bookingId`. Expose: `messages`, `sendMessage(text)`, `connected`. Load the last 50 messages from `GET /api/messages/:bookingId` on mount, then append socket events. Add a "Load earlier" button that fetches the next page. No `any` anywhere.

**Why it worked:**
Specified the room naming convention, the auth strategy (handshake token), the access control rule, the persistence schema, the hook interface, and the pagination behaviour — all before a single line was written. The output matched the spec exactly.

**Lesson:** Real-time features have many implicit decisions (room names, reconnection, auth). Making them all explicit eliminates guesswork and produces correct output first time.

---

### 4. UI Redesign with Design System

**Prompt:**
> The current UI looks inconsistent. Redesign all pages to use this system: primary color #2563EB (blue-600), surface white (#FFFFFF), border gray-200. Use `class-variance-authority` for all component variants. Cards: rounded-xl, shadow-sm, border border-gray-200, p-4. Buttons: primary (blue-600 bg, white text), secondary (white bg, blue-600 border + text), danger (red-600). Typography: heading-1 = text-2xl font-bold, heading-2 = text-xl font-semibold, body = text-sm text-gray-600. Apply consistently across: LandingPage, TripListPage, TripDetailPage, BookingPage, ProfilePage, AdminDashboard. Do not change any logic or API calls — styling only.

**Why it worked:**
Gave exact colour tokens, named every component variant with its CSS classes, listed every page to update, and explicitly said "do not change any logic". The constraint on scope was critical — without it, Claude tends to refactor logic while restyling.

**Lesson:** Design prompts must specify the design system tokens explicitly and constrain scope. "Make it look better" produces random changes; a token-based spec produces a coherent system.

---

### 5. Admin Panel with Role-based Guards

**Prompt:**
> Build the admin panel. Backend: new router at /api/admin, middleware that checks `req.user.role === 'admin'` and returns 403 otherwise. Endpoints: GET /api/admin/stats (count of users/trips/bookings by status), GET/PATCH /api/admin/users (list with pagination, ban/unban), GET/DELETE /api/admin/trips (list with pagination, cancel any), GET/DELETE /api/admin/bookings (list with pagination, cancel any). Frontend: AdminLayout with sidebar nav. Pages: Dashboard (stat cards), Users, Trips, Bookings. Redirect non-admins to /dashboard at the router level using a RequireAdmin component. Table rows should have action buttons (ban, cancel) that call the relevant endpoints and update state optimistically.

**Why it worked:**
Named every endpoint, the middleware logic, the frontend routing guard component name, and the optimistic update requirement. Specifying "RequireAdmin component" by name meant it was reusable and consistently named across the codebase.

**Lesson:** CRUD panels are deceptively complex. Specifying the guard mechanism, each endpoint, pagination, and optimistic updates up front avoids the most common admin panel bugs.

---

## 3 Worst Prompts

### 1. "Implement the bookings feature"

**Prompt:**
> Implement the bookings feature.

**What happened:**
Claude built a booking system with a two-field schema (`trip`, `rider`), no status state machine, no seat count tracking, no driver accept/reject flow, and no guard against double-booking. It worked in isolation but was incompatible with the trip's `seatsAvailable` field and the notification system. Required a full rewrite.

**What was missing:** The status transitions (`pending → confirmed/rejected`, `confirmed → cancelled`), the seat decrement on confirm, the guard against booking your own trip, and the notification trigger on status change. All of these are obvious in hindsight but implicit in "bookings feature".

**Fix:** Break it into a spec first: "Booking has statuses [list them], status transitions happen on [list endpoints], seat count decrements on confirm, rider cannot book own trip, notifications fire on [list events]."

---

### 2. "Fix the auth"

**Prompt:**
> Fix the auth — users are getting logged out randomly.

**What happened:**
Three rounds of back-and-forth. Claude first checked the JWT expiry (not the issue), then the cookie settings (not the issue), then finally found that the axios interceptor was not retrying after a 401 — it was clearing the token immediately instead. The fix was one line, but required 3 wrong guesses first.

**What was missing:** The symptom ("random logout") was too vague. The actual bug was "the interceptor clears the token on any 401 instead of attempting a refresh first". Providing the interceptor code and the exact reproduction steps would have led to the fix in one turn.

**Fix:** Always include the relevant code snippet and exact reproduction steps. "When the access token expires mid-session, the interceptor at src/api/client.ts clears auth state instead of calling /api/auth/refresh. Here is the interceptor: [code]. Fix it."

---

### 3. "Add Firebase OTP phone auth"

**Prompt:**
> Add Firebase OTP phone auth for registration. Users enter their phone number, get an SMS OTP, verify it, then complete their profile.

**What happened:**
Claude implemented a full Firebase phone auth flow that worked locally but required enabling the Phone provider in the Firebase console, setting up reCAPTCHA, and configuring App Check — none of which we could do quickly during the hackathon. Two hours of work were discarded and we switched to email + password.

**What was missing:** A constraints check upfront. "We don't have time to configure Firebase App Check or reCAPTCHA" would have immediately redirected to a simpler auth strategy.

**Fix:** Before implementing any third-party auth flow, ask: "What Firebase services need to be enabled? What domain configuration is required? Is there a simpler alternative?" The email + password flow took 30 minutes; the OTP flow cost us 2 hours.
