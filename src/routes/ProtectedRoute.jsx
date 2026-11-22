import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound } from 'lucide-react';

/**
 * Standard ProtectedRoute (requires logged in user)
 */
export const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-blood-800 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Verifying security credentials...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
};

/**
 * AdminRoute Guard (requires secret admin key authorization)
 */
export const AdminRoute = ({ children }) => {
  const { currentUser, isAuthenticated, isAdmin, verifyAdminAccess } = useAuth();
  const location = useLocation();
  const [adminKey, setAdminKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthenticated || !currentUser) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const handleVerifyKey = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setErrorMsg('');
    try {
      const success = await verifyAdminAccess(adminKey);
      if (!success) {
        setErrorMsg('Invalid Secret Admin Key. Access denied.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please check key.');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border-2 border-blood-800 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-blood-50 text-blood-800 rounded-3xl flex items-center justify-center mx-auto border border-blood-200">
            <KeyRound className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Admin Key Required</h2>
            <p className="text-xs text-slate-500 mt-1">
              The Administrative Control Center is strictly restricted. Please provide your server-side Secret Admin Access Key to proceed.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerifyKey} className="space-y-4">
            <input
              type="password"
              required
              placeholder="Enter Secret Admin Key"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-blood-800 font-mono text-center tracking-widest"
              autoFocus
            />

            <div className="flex space-x-2">
              <a
                href="/dashboard"
                className="flex-1 py-3 rounded-full border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Back to Dashboard
              </a>
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-3 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm disabled:opacity-60"
              >
                {isVerifying ? 'Verifying...' : 'Unlock Panel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return children;
};
