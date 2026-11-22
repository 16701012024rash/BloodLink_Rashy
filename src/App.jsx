import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { TopAnnouncementBar } from './components/layout/TopAnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FindDonorsPage } from './pages/FindDonorsPage';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { RequesterDashboard } from './pages/RequesterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotificationsPage } from './pages/NotificationsPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50 text-slate-800 font-sans">
      <ScrollToTop />
      
      {/* Top Maroon Announcement Bar (Screenshots 1, 2, 3) */}
      <TopAnnouncementBar />

      {/* Main Navbar with BloodLink drop logo and responsive navigation */}
      <Navbar />

      {/* Dynamic Page Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/find-donors" element={<FindDonorsPage />} />
          <Route path="/emergency-request" element={<EmergencyRequestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/donor-dashboard" element={<DonorDashboard />} />
          <Route path="/requester-dashboard" element={<RequesterDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>

      {/* Comprehensive Healthcare Footer */}
      <Footer />

      {/* Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
