import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalToastContainer } from './components/common/Toast';

// Pages
import { LandingPage }        from './pages/LandingPage';
import { FindDonorsPage }     from './pages/FindDonorsPage';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { LoginPage }          from './pages/LoginPage';
import { RegisterPage }       from './pages/RegisterPage';
import { UserDashboard }      from './pages/UserDashboard';
import { AdminDashboard }     from './pages/AdminDashboard';
import { NotificationsPage }  from './pages/NotificationsPage';
import { ProtectedRoute, AdminRoute } from './routes/ProtectedRoute';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50 text-surface-800 font-sans antialiased">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-donors" element={<FindDonorsPage />} />
          <Route path="/emergency-request" element={<EmergencyRequestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Unified User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute><UserDashboard /></ProtectedRoute>
          } />

          {/* Legacy route aliases */}
          <Route path="/donor-dashboard"    element={<Navigate to="/dashboard?tab=donor"    replace />} />
          <Route path="/requester-dashboard" element={<Navigate to="/dashboard?tab=requests" replace />} />

          {/* Admin Control Center */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <GlobalToastContainer />
    </div>
  );
}

export default App;
