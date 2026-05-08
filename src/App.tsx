import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import AppLayout from './components/layout/AppLayout';
import { useFcmSetup } from './features/notifications/hooks/useFcmSetup';
import { OnboardingTour } from './features/onboarding/OnboardingTour';
import { CookieConsent } from './features/legal/CookieConsent';
import { usePlausible } from './hooks/usePlausible';

// Public / auth pages
const LandingPage = lazy(() => import('./features/landing/LandingPage'));
const AboutPage = lazy(() => import('./features/landing/AboutPage'));
const HowItWorksPage = lazy(() => import('./features/landing/HowItWorksPage'));
const TermsPage = lazy(() => import('./features/landing/TermsPage'));
const PrivacyPage = lazy(() => import('./features/landing/PrivacyPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));

// App pages
const TripListPage = lazy(() => import('./features/trips/TripListPage'));
const TripDetailPage = lazy(() => import('./features/trips/TripDetailPage'));
const CreateTripPage = lazy(() => import('./features/trips/CreateTripPage'));
const BookingPage = lazy(() => import('./features/bookings/BookingPage'));
const MyBookingsPage = lazy(() => import('./features/bookings/MyBookingsPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const EditProfilePage = lazy(() => import('./features/profile/EditProfilePage'));
const NotificationsPage = lazy(() => import('./features/notifications/NotificationsPage'));
const ChatPage = lazy(() => import('./features/chat/ChatPage'));
const ChatListPage = lazy(() => import('./features/chat/ChatListPage'));
const ReviewPage = lazy(() => import('./features/reviews/ReviewPage'));
const ReviewHistoryPage = lazy(() => import('./features/reviews/ReviewHistoryPage'));
const NotFoundPage = lazy(() => import('./features/errors/NotFoundPage'));

// Admin pages
const AdminLoginPage = lazy(() => import('./features/admin/LoginPage'));
const DashboardPage = lazy(() => import('./features/admin/DashboardPage'));
const UsersPage = lazy(() => import('./features/admin/UsersPage'));
const UserDetailPage = lazy(() => import('./features/admin/UserDetailPage'));
const TripsAdminPage = lazy(() => import('./features/admin/TripsPage'));
const TripDetailAdminPage = lazy(() => import('./features/admin/TripDetailPage'));
const BookingsAdminPage = lazy(() => import('./features/admin/BookingsPage'));
const ModerationPage = lazy(() => import('./features/admin/ModerationPage'));

function AppInner() {
  useFcmSetup();
  usePlausible();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(console.error);
    }
  }, []);

  return (
    <>
      <Toaster richColors position="top-center" />
      <CookieConsent />
      <OnboardingTour />
      <Suspense fallback={null}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* App (authenticated, with Navbar + BottomNav) */}
          <Route path="/trips" element={<ProtectedRoute><AppLayout><TripListPage /></AppLayout></ProtectedRoute>} />
          <Route path="/trips/create" element={<ProtectedRoute><AppLayout><CreateTripPage /></AppLayout></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><AppLayout><TripDetailPage /></AppLayout></ProtectedRoute>} />
          <Route path="/trips/:id/book" element={<ProtectedRoute><AppLayout><BookingPage /></AppLayout></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><AppLayout><MyBookingsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/trips/:id/review" element={<ProtectedRoute><AppLayout><ReviewPage /></AppLayout></ProtectedRoute>} />
          <Route path="/reviews" element={<ProtectedRoute><AppLayout><ReviewHistoryPage /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><AppLayout><EditProfilePage /></AppLayout></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><AppLayout><ChatListPage /></AppLayout></ProtectedRoute>} />
          <Route path="/chat/:bookingId" element={<ProtectedRoute><AppLayout><ChatPage /></AppLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><UsersPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/users/:id" element={<AdminProtectedRoute><AdminLayout><UserDetailPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/trips" element={<AdminProtectedRoute><AdminLayout><TripsAdminPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/trips/:id" element={<AdminProtectedRoute><AdminLayout><TripDetailAdminPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/bookings" element={<AdminProtectedRoute><AdminLayout><BookingsAdminPage /></AdminLayout></AdminProtectedRoute>} />
          <Route path="/admin/moderation" element={<AdminProtectedRoute><AdminLayout><ModerationPage /></AdminLayout></AdminProtectedRoute>} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
