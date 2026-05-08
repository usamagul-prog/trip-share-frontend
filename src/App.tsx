import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import TripListPage from './features/trips/TripListPage';
import TripDetailPage from './features/trips/TripDetailPage';
import CreateTripPage from './features/trips/CreateTripPage';
import BookingPage from './features/bookings/BookingPage';
import MyBookingsPage from './features/bookings/MyBookingsPage';
import ProfilePage from './features/profile/ProfilePage';
import EditProfilePage from './features/profile/EditProfilePage';
import NotificationsPage from './features/notifications/NotificationsPage';
import ChatPage from './features/chat/ChatPage';
import ReviewPage from './features/reviews/ReviewPage';
import ReviewHistoryPage from './features/reviews/ReviewHistoryPage';
import AdminLoginPage from './features/admin/LoginPage';
import DashboardPage from './features/admin/DashboardPage';
import UsersPage from './features/admin/UsersPage';
import UserDetailPage from './features/admin/UserDetailPage';
import TripsAdminPage from './features/admin/TripsPage';
import TripDetailAdminPage from './features/admin/TripDetailPage';
import { useFcmSetup } from './features/notifications/hooks/useFcmSetup';

export default function App() {
  useFcmSetup();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(console.error);
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<ProtectedRoute><TripListPage /></ProtectedRoute>} />
        <Route path="/trips/create" element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
        <Route path="/trips/:id/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/trips/:id/review" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
        <Route path="/reviews" element={<ProtectedRoute><ReviewHistoryPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/chat/:bookingId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        {/* Admin */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout><DashboardPage /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/users" element={<AdminProtectedRoute><AdminLayout><UsersPage /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/users/:id" element={<AdminProtectedRoute><AdminLayout><UserDetailPage /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/trips" element={<AdminProtectedRoute><AdminLayout><TripsAdminPage /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/admin/trips/:id" element={<AdminProtectedRoute><AdminLayout><TripDetailAdminPage /></AdminLayout></AdminProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
