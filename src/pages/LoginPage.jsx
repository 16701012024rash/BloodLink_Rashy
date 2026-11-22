import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password');
      return;
    }

    const user = login(email, password);
    showToast(`Welcome back, ${user.name}!`, 'success');

    if (user.role === 'donor') navigate('/donor-dashboard');
    else if (user.role === 'requester') navigate('/requester-dashboard');
    else if (user.role === 'admin') navigate('/admin');
    else navigate('/');
  };

  const handleQuickLogin = (role) => {
    let emailToUse = '';
    if (role === 'donor') emailToUse = 'amit.kumar@example.com';
    else if (role === 'requester') emailToUse = 'maria@example.com';
    else if (role === 'admin') emailToUse = 'admin@bloodlink.org';

    setEmail(emailToUse);
    setPassword('demo12345');
    const user = login(emailToUse, 'demo12345', role);
    showToast(`Logged in as ${user.name} (${user.role})`, 'success');

    if (role === 'donor') navigate('/donor-dashboard');
    else if (role === 'requester') navigate('/requester-dashboard');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* Title above card (matching Screenshot 4) */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back to <span className="text-blood-800">BloodLink</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your donation records, matching alerts, and health profile.
          </p>
        </div>

        {/* Card matching Screenshot 4 with dark burgundy 2px border */}
        <div className="bg-white rounded-[32px] p-8 border-2 border-blood-800 shadow-xl relative">
          
          <h2 className="text-center font-bold text-slate-800 text-lg mb-6">
            Sign In to Your Account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-slate-800"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-slate-800"
                />
              </div>
            </div>

            {/* Keep me signed in & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={(e) => setKeepSignedIn(e.target.checked)}
                  className="w-4 h-4 text-blood-800 rounded border-slate-300 focus:ring-blood-700"
                />
                <span>Keep me signed in</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Password reset link sent to demo email', 'info')}
                className="text-slate-600 hover:text-blood-800 underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button (rounded-full solid crimson pill from Screenshot 4) */}
            <button
              type="submit"
              className="w-full mt-4 bg-blood-800 hover:bg-blood-900 text-white font-bold text-sm py-3 rounded-full transition shadow-md shadow-blood-800/20"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Credentials for One-Click Evaluation */}
          <div className="mt-6 pt-5 border-t border-surface-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center mb-2">
              Quick Test Accounts (Click to Fill & Enter)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('donor')}
                className="p-2 rounded-xl bg-blood-50 hover:bg-blood-100 text-blood-900 text-[11px] font-bold border border-blood-200 text-center transition"
              >
                Donor (Amit)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('requester')}
                className="p-2 rounded-xl bg-surface-100 hover:bg-surface-200 text-slate-800 text-[11px] font-bold border border-surface-300 text-center transition"
              >
                Requester (Maria)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 text-center transition"
              >
                Admin
              </button>
            </div>
          </div>

        </div>

        {/* Footer Link matching Screenshot 4 */}
        <div className="text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blood-800 font-bold hover:underline">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};
