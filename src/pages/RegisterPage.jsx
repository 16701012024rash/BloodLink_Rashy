import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Droplet, MapPin, Calendar, Heart, ShieldCheck } from 'lucide-react';
import { BLOOD_GROUPS, CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { showToast } = useNotification();

  // Role toggle: donor or requester
  const initialRole = searchParams.get('role') === 'requester' ? 'requester' : 'donor';
  const [role, setRole] = useState(initialRole);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+',
    city: 'New Delhi',
    age: '',
    lastDonationDate: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const err = {};
    if (!formData.fullName.trim()) err.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) err.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 8) err.phone = 'Valid phone number is required';
    if (!formData.password || formData.password.length < 6) err.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) err.confirmPassword = 'Passwords do not match';
    if (role === 'donor' && (!formData.age || parseInt(formData.age, 10) < 18)) {
      err.age = 'Donors must be at least 18 years old';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the registration form', 'error');
      return;
    }

    const newUser = register({
      ...formData,
      role
    });

    showToast(`Account created! Welcome to BloodLink, ${newUser.name}`, 'success');

    if (role === 'donor') navigate('/donor-dashboard');
    else navigate('/requester-dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full space-y-6">
        
        {/* Title above card (matching Screenshot 4) */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join the <span className="text-blood-800">BloodLink</span> Community
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign up to donate life-saving blood or coordinate emergency transfusions.
          </p>
        </div>

        {/* Card matching Screenshot 4 with dark burgundy 2px border */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-blood-800 shadow-xl relative">
          
          {/* Top Tabs (Login / Signup from Screenshot 4) */}
          <div className="flex border-b border-surface-200 mb-6">
            <Link
              to="/login"
              className="flex-1 text-center py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
            >
              Login
            </Link>
            <div className="flex-1 text-center py-2 text-xs font-bold text-blood-800 border-b-2 border-blood-800">
              Signup
            </div>
          </div>

          {/* Persona selector toggle: Donor vs Requester */}
          <div className="flex bg-surface-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole('donor')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                role === 'donor'
                  ? 'bg-blood-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blood-800'
              }`}
            >
              🩸 Register as Donor
            </button>
            <button
              type="button"
              onClick={() => setRole('requester')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                role === 'requester'
                  ? 'bg-blood-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blood-800'
              }`}
            >
              🏥 Register as Requester
            </button>
          </div>

          <h2 className="text-center font-bold text-slate-800 text-base mb-5">
            {role === 'donor' ? 'Create Your Donor Account' : 'Create Patient / Requester Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full text-xs pl-10 pr-4 py-3 rounded-xl border ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  } focus:outline-none focus:border-blood-800 text-slate-800`}
                />
              </div>
              {errors.fullName && <span className="text-[10px] text-red-600 font-semibold">{errors.fullName}</span>}
            </div>

            {/* Email Address */}
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full text-xs pl-10 pr-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  } focus:outline-none focus:border-blood-800 text-slate-800`}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-600 font-semibold">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number (e.g. +91 98765 43210)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full text-xs pl-10 pr-4 py-3 rounded-xl border ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-300'
                  } focus:outline-none focus:border-blood-800 text-slate-800`}
                />
              </div>
              {errors.phone && <span className="text-[10px] text-red-600 font-semibold">{errors.phone}</span>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full text-xs pl-10 pr-3 py-3 rounded-xl border ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    } focus:outline-none focus:border-blood-800 text-slate-800`}
                  />
                </div>
                {errors.password && <span className="text-[10px] text-red-600 font-semibold">{errors.password}</span>}
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full text-xs pl-10 pr-3 py-3 rounded-xl border ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-300'
                    } focus:outline-none focus:border-blood-800 text-slate-800`}
                  />
                </div>
                {errors.confirmPassword && <span className="text-[10px] text-red-600 font-semibold">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Blood Type & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-blood-900 bg-white"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  City / Location
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-slate-800 bg-white"
                >
                  {CITIES.slice(1).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Donor specific fields: Age & Last donation */}
            {role === 'donor' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    placeholder="Age (18-65)"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-slate-800"
                  />
                  {errors.age && <span className="text-[10px] text-red-600 font-semibold">{errors.age}</span>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Last Donated (optional)"
                    value={formData.lastDonationDate}
                    onChange={(e) => setFormData({ ...formData, lastDonationDate: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Create Account Button (crimson pill from Screenshot 4) */}
            <button
              type="submit"
              className="w-full mt-4 bg-blood-800 hover:bg-blood-900 text-white font-bold text-sm py-3 rounded-full transition shadow-md shadow-blood-800/20"
            >
              Create Account
            </button>

            {/* Legal Links from Screenshot 4 */}
            <div className="text-center text-[11px] text-slate-500 pt-2 space-x-3">
              <span className="hover:underline cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
            </div>
          </form>

        </div>

        {/* Footer Link matching Screenshot 4 */}
        <div className="text-center text-xs text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blood-800 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
