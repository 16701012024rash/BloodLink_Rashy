import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Backwards-compatibility wrapper for legacy /donor-dashboard route.
 * Redirects to the unified User Dashboard with the donor tab active.
 */
export const DonorDashboard = () => {
  return <Navigate to="/dashboard?tab=donor" replace />;
};

export default DonorDashboard;
