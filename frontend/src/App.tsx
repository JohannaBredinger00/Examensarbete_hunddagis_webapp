import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyDogs from './pages/MyDogs';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminDogs from './pages/admin/AdminDogs';
import AdminBookings from './pages/admin/AdminBookings';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Login />;

  // Admin routes
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="dogs" element={<AdminDogs />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    );
  }

  // Customer routes
  if (user.role === "customer") {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-dogs" element={<MyDogs />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  return null; // fallback
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;
