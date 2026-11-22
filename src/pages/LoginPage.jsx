import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Heart, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Alert } from '../components/ui/index.jsx';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, resetPassword } = useAuth();
  const { showToast } = useNotification();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back to BloodLink!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setSubmitting(true);
    try {
      await resetPassword(resetEmail);
      setResetSent(true);
      showToast('Password reset link sent to your email.', 'success');
    } catch (err) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center relative overflow-hidden p-12">
        <div className="absolute inset-0 bg-dot-pattern opacity-30" />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10 text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <svg viewBox="0 0 24 24" className="w-20 h-20 fill-blood-600 drop-shadow-lg">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <svg viewBox="0 0 24 24" className="w-10 h-10 absolute inset-0 m-auto text-white fill-none stroke-current stroke-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 3 8 2-6 2 4h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Blood<span className="text-blood-400">Link</span></h1>
          <p className="text-navy-300 text-lg mb-8 max-w-xs">India's Real-Time Emergency Blood Donor Network</p>
          <div className="space-y-3 text-left max-w-sm mx-auto">
            {['Clinical ABO/RhD compatibility matching', 'Real-time GPS donor proximity', 'Instant multi-channel emergency alerts', 'Privacy-protected donor profiles'].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-navy-300">
                <div className="w-5 h-5 rounded-full bg-success-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-success-400" />
                </div>
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 24 24" className="w-10 h-10 fill-blood-800"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
            </div>
            <span className="text-2xl font-black text-surface-900">Blood<span className="text-blood-800">Link</span></span>
          </div>

          {!resetMode ? (
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-surface-900 mb-1">Welcome back</h2>
                <p className="text-sm text-surface-500">Sign in to your BloodLink account</p>
              </div>

              {error && <Alert type="error" className="mb-5" onClose={() => setError('')}>{error}</Alert>}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="label">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="you@example.com" className="input pl-10" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="label mb-0">Password</label>
                    <button type="button" onClick={() => setResetMode(true)} className="text-xs text-blood-700 hover:text-blood-900 font-semibold transition">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="Enter your password" className="input pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={submitting || loading} className="btn btn-lg btn-primary w-full mt-2">
                  {(submitting || loading) ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {(submitting || loading) ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="text-sm text-surface-500 text-center mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-blood-700 font-semibold hover:text-blood-900 transition">Create account</Link>
              </p>
            </>
          ) : (
            <>
              <div className="mb-7">
                <h2 className="text-2xl font-bold text-surface-900 mb-1">Reset password</h2>
                <p className="text-sm text-surface-500">Enter your email and we'll send a reset link</p>
              </div>

              {resetSent ? (
                <Alert type="success" title="Reset link sent!">Check your inbox at <strong>{resetEmail}</strong>. The link expires in 60 minutes.</Alert>
              ) : (
                <>
                  {error && <Alert type="error" className="mb-4" onClose={() => setError('')}>{error}</Alert>}
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="label">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="you@example.com" className="input pl-10" />
                      </div>
                    </div>
                    <button type="submit" disabled={submitting} className="btn btn-lg btn-primary w-full">
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                      {submitting ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              )}

              <button onClick={() => { setResetMode(false); setError(''); }} className="mt-5 text-sm text-blood-700 font-semibold hover:text-blood-900 transition flex items-center gap-1">
                ← Back to sign in
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
