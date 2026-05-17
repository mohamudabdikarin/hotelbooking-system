import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';

import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RoomsPage } from './pages/RoomsPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { BookingsListPage } from './pages/BookingsListPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/Dashboard';
import { CustomersPage } from './pages/CustomersPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/rooms" element={<RoomsPage />} />

              <Route path="/booking/:roomId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/bookings" element={<ProtectedRoute><BookingsListPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><DashboardPage /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><CustomersPage /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
         
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
