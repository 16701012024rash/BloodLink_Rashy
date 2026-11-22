import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Backwards-compatibility wrapper for legacy /requester-dashboard route.
 * Redirects to the unified User Dashboard with the requests tab active.
 */
export const RequesterDashboard = () => {
  return <Navigate to="/dashboard?tab=requests" replace />;
};

export default RequesterDashboard;
