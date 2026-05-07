import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import DashboardPage from './features/admin/DashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<TripListPage />} />
        <Route path="/trips/:id" element={<TripDetailPage />} />
        <Route path="/trips/create" element={<CreateTripPage />} />
        <Route path="/trips/:id/book" element={<BookingPage />} />
        <Route path="/bookings" element={<MyBookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/chat/:bookingId" element={<ChatPage />} />
        <Route path="/admin" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
