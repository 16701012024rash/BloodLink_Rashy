import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Eye, EyeOff,
  Droplet, MapPin, Calendar, Heart, ShieldCheck,
  Navigation, Check, ChevronRight, ChevronLeft,
  ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';
import { BLOOD_GROUPS, CITIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { isValidEmail, isValidIndianPhone } from '../utils/validation';

// Blood group color helpers
const BG_COLORS = {
  'O+': 'bg-red-600', 'O-': 'bg-red-800',
  'A+': 'bg-blue-600', 'A-': 'bg-blue-800',
  'B+': 'bg-purple-600', 'B-': 'bg-purple-800',
  'AB+': 'bg-orange-500', 'AB-': 'bg-orange-700',
};

const STEPS = [
  { id: 1, label: 'Account', icon: User },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Donor', icon: Heart },
];

const stepVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }),
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useNotification();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    locality: '',
    pincode: '',
    latitude: 28.6139,
    longitude: 77.2090,
    isDonor: false,
    bloodGroup: 'O+',
    rhFactor: '+',
    lastDonationDate: '',
    preferredRadius: 25,
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported by browser', 'error');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set('latitude', pos.coords.latitude);
        set('longitude', pos.coords.longitude);
        setDetectingLocation(false);
        showToast('GPS coordinates captured!', 'success');
      },
      () => {
        setDetectingLocation(false);
        showToast('Location permission denied.', 'error');
      }
    );
  };

  const validateStep = (s) => {
    const err = {};
    if (s === 1) {
      if (!formData.fullName.trim()) err.fullName = 'Full Name is required';
      if (!isValidEmail(formData.email)) err.email = 'Valid email is required';
      if (!formData.phone.trim() || !isValidIndianPhone(formData.phone))
        err.phone = 'Valid 10-digit phone number required';
      if (!formData.password || formData.password.length < 6)
        err.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword)
        err.confirmPassword = 'Passwords do not match';
    }
    if (s === 2) {
      if (!formData.city) err.city = 'City is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    try {
      await register(formData);
      showToast(`Welcome to BloodLink, ${formData.fullName}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ field }) =>
    errors[field] ? (
      <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {errors[field]}
      </p>
    ) : null;

  const inputCls = (field) =>
    `input w-full text-sm ${errors[field] ? 'border-red-400 bg-red-50 focus:border-red-500' : ''}`;

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT BRAND PANEL ─── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 flex-col justify-between p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blood-900/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-blood-800/15 blur-2xl" />

        {/* Logo */}
        <div>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blood-700 flex items-center justify-center shadow-lg">
              <Droplet className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">BloodLink</span>
          </Link>
        </div>

        {/* Centre copy */}
        <div className="space-y-8 relative z-10">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Join a network<br />
              <span className="text-blood-400">that saves lives.</span>
            </h2>
            <p className="text-navy-300 text-sm mt-4 leading-relaxed max-w-xs">
              One account gives you access to India's real-time blood matching network — as a recipient or a voluntary donor.
            </p>
          </div>

          {/* Step preview */}
          <div className="space-y-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    active ? 'bg-white/10 border border-white/20' : 'opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    done ? 'bg-emerald-500' : active ? 'bg-blood-700' : 'bg-white/10'
                  }`}>
                    {done ? <Check className="w-4 h-4 text-white" /> : <Icon className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-sm font-semibold ${active ? 'text-white' : 'text-navy-400'}`}>
                    Step {s.id}: {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2">
            {['NABH Aligned', 'RLS Protected', 'Real-Time Matching'].map(tag => (
              <span key={tag} className="text-[11px] font-semibold bg-white/10 text-navy-200 px-3 py-1 rounded-full border border-white/10">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <p className="text-navy-500 text-xs relative z-10">
          &copy; {new Date().getFullYear()} BloodLink · Secure · Private
        </p>
      </div>

      {/* ─── RIGHT FORM PANEL ─── */}
      <div className="flex-1 flex flex-col justify-center min-h-screen bg-surface-50 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto px-6 py-12">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blood-700 flex items-center justify-center">
              <Droplet className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-navy-900">BloodLink</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-navy-900">Create your account</h1>
            <p className="text-sm text-slate-500 mt-1">
              Step {step} of {STEPS.length} — {STEPS[step - 1].label}
            </p>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5 mb-8">
            {STEPS.map(s => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                  step >= s.id ? 'bg-blood-700' : 'bg-surface-200'
                }`}
              />
            ))}
          </div>

          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                {/* ── STEP 1: Account ── */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="label">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Maria Rodriguez"
                            value={formData.fullName}
                            onChange={e => set('fullName', e.target.value)}
                            className={`${inputCls('fullName')} pl-9`}
                          />
                        </div>
                        <FieldError field="fullName" />
                      </div>

                      <div>
                        <label className="label">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={e => set('email', e.target.value)}
                            className={`${inputCls('email')} pl-9`}
                          />
                        </div>
                        <FieldError field="email" />
                      </div>

                      <div>
                        <label className="label">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={e => set('phone', e.target.value)}
                            className={`${inputCls('phone')} pl-9`}
                          />
                        </div>
                        <FieldError field="phone" />
                      </div>

                      <div>
                        <label className="label">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={e => set('dateOfBirth', e.target.value)}
                            className={`${inputCls('dateOfBirth')} pl-9`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="label">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={e => set('gender', e.target.value)}
                          className="input w-full"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min 6 characters"
                            value={formData.password}
                            onChange={e => set('password', e.target.value)}
                            className={`${inputCls('password')} pl-9 pr-10`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <FieldError field="password" />
                      </div>

                      <div>
                        <label className="label">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={e => set('confirmPassword', e.target.value)}
                            className={`${inputCls('confirmPassword')} pl-9 pr-10`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <FieldError field="confirmPassword" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Location ── */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between p-3 bg-navy-50 border border-navy-100 rounded-xl">
                      <div>
                        <p className="text-xs font-semibold text-navy-800">Auto-detect my location</p>
                        <p className="text-[11px] text-navy-500 mt-0.5">For faster emergency matching radius</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleDetectGPS}
                        disabled={detectingLocation}
                        className="btn btn-outline btn-sm flex items-center gap-1.5"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        {detectingLocation ? 'Locating…' : 'Use GPS'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">City *</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <select
                            value={formData.city}
                            onChange={e => set('city', e.target.value)}
                            className={`${inputCls('city')} pl-9`}
                          >
                            {CITIES.slice(1).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <FieldError field="city" />
                      </div>

                      <div>
                        <label className="label">State</label>
                        <input
                          type="text"
                          placeholder="e.g. Maharashtra"
                          value={formData.state}
                          onChange={e => set('state', e.target.value)}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="label">Area / Locality</label>
                        <input
                          type="text"
                          placeholder="e.g. Connaught Place"
                          value={formData.locality}
                          onChange={e => set('locality', e.target.value)}
                          className="input w-full"
                        />
                      </div>

                      <div>
                        <label className="label">PIN Code</label>
                        <input
                          type="text"
                          placeholder="e.g. 110001"
                          value={formData.pincode}
                          onChange={e => set('pincode', e.target.value)}
                          className="input w-full"
                        />
                      </div>
                    </div>

                    {(formData.latitude !== 28.6139 || formData.longitude !== 77.2090) && (
                      <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        GPS captured: {formData.latitude.toFixed(4)}°N, {formData.longitude.toFixed(4)}°E
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ── STEP 3: Donor Opt-In ── */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="text-base font-bold text-navy-900 mb-1">Voluntary Blood Donation</h3>
                      <p className="text-sm text-slate-500">
                        You can request blood whether you opt in or not. Becoming a donor helps save lives near you.
                      </p>
                    </div>

                    {/* Opt-in toggle card */}
                    <label
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        formData.isDonor
                          ? 'border-blood-600 bg-blood-50'
                          : 'border-surface-200 bg-white hover:border-blood-300'
                      }`}
                    >
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData.isDonor}
                          onChange={e => set('isDonor', e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          formData.isDonor ? 'bg-blood-700 border-blood-700' : 'border-slate-300 bg-white'
                        }`}>
                          {formData.isDonor && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-blood-700" />
                          <span className="font-bold text-navy-900 text-sm">
                            Register me as a voluntary blood donor
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          You'll be notified when nearby patients need matching blood. You can pause or change availability anytime from your dashboard.
                        </p>
                      </div>
                    </label>

                    {/* Donor details (animated) */}
                    <AnimatePresence>
                      {formData.isDonor && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-white border border-surface-200 rounded-2xl space-y-5">
                            {/* Blood group grid */}
                            <div>
                              <label className="label mb-3 block">Select Your Blood Group</label>
                              <div className="grid grid-cols-4 gap-2">
                                {BLOOD_GROUPS.filter(bg => bg !== 'All').map(bg => (
                                  <button
                                    key={bg}
                                    type="button"
                                    onClick={() => set('bloodGroup', bg)}
                                    className={`relative p-3 rounded-xl border-2 font-black text-sm transition-all ${
                                      formData.bloodGroup === bg
                                        ? `${BG_COLORS[bg] || 'bg-blood-700'} border-transparent text-white shadow-md`
                                        : 'border-surface-200 text-slate-700 hover:border-blood-300 bg-white'
                                    }`}
                                  >
                                    {bg}
                                    {formData.bloodGroup === bg && (
                                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                      </span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="label">Last Donation Date</label>
                                <input
                                  type="date"
                                  value={formData.lastDonationDate}
                                  onChange={e => set('lastDonationDate', e.target.value)}
                                  className="input w-full"
                                />
                              </div>

                              <div>
                                <label className="label">Preferred Donation Radius</label>
                                <select
                                  value={formData.preferredRadius}
                                  onChange={e => set('preferredRadius', parseInt(e.target.value, 10))}
                                  className="input w-full"
                                >
                                  <option value="10">Within 10 km (Locality)</option>
                                  <option value="25">Within 25 km (City Zone)</option>
                                  <option value="50">Within 50 km (Metropolitan)</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-800">
                                Donors must wait <strong>56 days</strong> between whole blood donations. BloodLink automatically enforces this for your safety.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!formData.isDonor && (
                      <div className="p-4 bg-surface-100 border border-surface-200 rounded-xl">
                        <p className="text-xs text-slate-500 text-center">
                          You can still request emergency blood and track requests as a recipient. Donor registration is entirely voluntary.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="btn btn-outline flex items-center gap-2 flex-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn btn-primary flex items-center gap-2 flex-1 justify-center"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account…
                    </>
                  ) : (
                    <>
                      Complete Registration
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign-in link */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blood-700 hover:text-blood-800 hover:underline">
              Sign In
            </Link>
          </p>

          {/* Verification badge */}
          <div className="flex items-center justify-center gap-2 mt-8 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secure registration · Data protected under our Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};
