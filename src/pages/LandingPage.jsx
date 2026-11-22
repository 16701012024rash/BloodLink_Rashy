import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Users, 
  Building2, 
  Clock, 
  Activity, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles,
  Droplet,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_GROUP_STATS, TESTIMONIALS } from '../data/mockData';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { useBloodRequest } from '../context/BloodRequestContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { stats } = useBloodRequest();
  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/find-donors?blood=${encodeURIComponent(selectedBlood)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className="min-h-screen bg-surface-50 text-slate-800">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-blood-50 border border-blood-200/80 px-3.5 py-1.5 rounded-full text-blood-800 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blood-600 animate-ping" />
                <span>India’s Leading Smart Blood Network</span>
              </div>

              {/* Main Headline */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                  Blood<span className="text-blood-800">Link</span>
                  <br />
                  <span className="text-blood-800">Donate Blood. Save Lives.</span>
                </h1>
                <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                  "Every Drop Counts. Every Donor Matters." Connecting blood donors with those who need them—quickly, safely, and transparently, because every single second matters.
                </p>
              </div>

              {/* Dual CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/find-donors"
                  className="flex items-center space-x-2 bg-blood-800 hover:bg-blood-900 text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-maroon hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <Droplet className="w-4 h-4 fill-white" />
                  <span>Find a Donor</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/register?role=donor"
                  className="flex items-center space-x-2 bg-white hover:bg-blood-50 text-blood-800 border-2 border-blood-800 px-7 py-3 rounded-full text-sm font-bold shadow-sm transition transform hover:-translate-y-0.5"
                >
                  <Heart className="w-4 h-4 fill-blood-800" />
                  <span>Become a Donor</span>
                </Link>

                <Link
                  to="/emergency-request"
                  className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-3 rounded-full border border-red-200 transition"
                >
                  <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                  <span>Urgent Blood Request</span>
                </Link>
              </div>

              {/* Trust Indicators Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 font-semibold border-t border-surface-200">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blood-700" />
                  <span>Verified Donors</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-blood-700" />
                  <span>Real-Time Availability</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center space-x-1.5">
                  <Lock className="w-4 h-4 text-blood-700" />
                  <span>Safe & Secure</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background decorative blob */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-blood-200/50 to-rose-100 rounded-3xl filter blur-xl opacity-70" />
                
                {/* Main Card Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-card border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80&w=800"
                    alt="Blood donation and compassionate healthcare"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  
                  {/* Floating Quote Sticker (from image 1) */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-blood-100 max-w-[210px]">
                    <div className="text-[11px] font-bold text-slate-800 leading-snug">
                      “A little kindness... can make a big difference”
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-blood-700 font-semibold">
                      <span>Be a Lifesaver</span>
                      <Heart className="w-3.5 h-3.5 fill-blood-600 text-blood-600" />
                    </div>
                  </div>

                  {/* Bottom Quick-Search Floating Widget */}
                  <div className="p-4 bg-white/95 backdrop-blur-md border-t border-surface-200">
                    <form onSubmit={handleHeroSearch} className="flex items-center gap-2">
                      <select
                        value={selectedBlood}
                        onChange={(e) => setSelectedBlood(e.target.value)}
                        className="bg-surface-50 text-xs font-bold px-3 py-2.5 rounded-xl border border-slate-200 text-blood-900 focus:outline-none focus:border-blood-800"
                      >
                        {BLOOD_GROUPS.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        placeholder="City e.g. New Delhi..."
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blood-800"
                      />

                      <button
                        type="submit"
                        className="bg-blood-800 hover:bg-blood-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 shrink-0"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Find</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 FEATURE QUICK PILL CARDS (matches Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <Link
            to="/find-donors"
            className="group bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card hover:border-blood-300 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blood-50 group-hover:bg-blood-800 transition flex items-center justify-center shrink-0">
                <Droplet className="w-6 h-6 text-blood-800 group-hover:text-white transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blood-800 transition">
                  Find Nearby Donors
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Search verified donors near you in just a few clicks.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blood-800 group-hover:translate-x-1 transition shrink-0 ml-2" />
          </Link>

          {/* Card 2 */}
          <Link
            to="/register?role=donor"
            className="group bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card hover:border-blood-300 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blood-50 group-hover:bg-blood-800 transition flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-blood-800 group-hover:text-white transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blood-800 transition">
                  Become a Donor
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Register today and be a verified neighborhood hero.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blood-800 group-hover:translate-x-1 transition shrink-0 ml-2" />
          </Link>

          {/* Card 3 */}
          <Link
            to="/notifications"
            className="group bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card hover:border-blood-300 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blood-50 group-hover:bg-blood-800 transition flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blood-800 group-hover:text-white transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blood-800 transition">
                  Real-Time Updates
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Get instant SMS & push alerts on donor availability.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blood-800 group-hover:translate-x-1 transition shrink-0 ml-2" />
          </Link>

          {/* Card 4 */}
          <Link
            to="/emergency-request"
            className="group bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card hover:border-blood-300 transition-all duration-300 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-blood-50 group-hover:bg-blood-800 transition flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 text-blood-800 group-hover:text-white transition" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blood-800 transition">
                  Save Lives
                </h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Be the reason for someone’s second chance at life.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blood-800 group-hover:translate-x-1 transition shrink-0 ml-2" />
          </Link>

        </div>
      </section>

      {/* CRIMSON STATISTICS BANNER (matches Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative overflow-hidden bg-gradient-to-r from-blood-900 via-blood-800 to-blood-900 text-white rounded-3xl p-8 sm:p-10 shadow-maroon">
          
          {/* Subtle background red blood cells graphic pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* Stat 1 */}
            <div className="flex items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/15">
                <Droplet className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {stats.fulfilledRequests.toLocaleString()}+
                </div>
                <div className="text-xs text-blood-200 font-medium">Lives Impacted</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/15">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {stats.totalDonors.toLocaleString()}+
                </div>
                <div className="text-xs text-blood-200 font-medium">Registered Donors</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/15">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  500+
                </div>
                <div className="text-xs text-blood-200 font-medium">Partner Hospitals</div>
              </div>
            </div>

            {/* Stat 4 + Heartbeat wave */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/15">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    24x7
                  </div>
                  <div className="text-xs text-blood-200 font-medium">Emergency Support</div>
                </div>
              </div>

              {/* Heartbeat ECG waveform graphic */}
              <div className="hidden xl:block opacity-60">
                <svg viewBox="0 0 120 40" className="w-24 h-10 stroke-current text-white fill-none stroke-2">
                  <path d="M0 20 L40 20 L48 5 L56 35 L64 12 L72 26 L78 20 L120 20" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOOD GROUP AVAILABILITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-blood-800 uppercase tracking-widest bg-blood-50 px-3 py-1 rounded-full border border-blood-100">
            Live Inventory & Need Status
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Current Blood Group Availability
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real-time readiness across regional blood banks and registered voluntary donors. Click any group to find available donors immediately.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {BLOOD_GROUP_STATS.map((item) => {
            const isCritical = item.availability === 'Critical';
            const isLow = item.availability === 'Low';

            return (
              <div
                key={item.group}
                onClick={() => navigate(`/find-donors?blood=${encodeURIComponent(item.group)}`)}
                className="bg-white rounded-3xl p-4 border border-surface-200 hover:border-blood-700 shadow-sm hover:shadow-card transition-all duration-300 text-center cursor-pointer group flex flex-col items-center justify-between"
              >
                <BloodGroupBadge group={item.group} size="lg" className="mb-2 group-hover:scale-110" />
                
                <div className="text-xs font-bold text-slate-800">
                  {item.group}
                </div>

                <div className="mt-2 w-full">
                  <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                    <span>Stock</span>
                    <span className="font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-2.5">
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : isLow
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.need === 'Urgent' ? '🚨 Need Urgent' : `${item.availability}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW BLOODLINK WORKS (3 STEPS) */}
      <section className="bg-surface-100 py-16 mb-20 border-y border-surface-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blood-800 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-blood-100 shadow-xs">
              Simple & Fast
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              How BloodLink Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Three seamless steps to connect patients with ready donors within minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm relative group hover:shadow-card transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blood-800 text-white font-black text-lg flex items-center justify-center mb-6 shadow-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blood-800 transition">
                Search for Donors
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Filter donors by compatible blood group, city, hospital radius, and real-time availability status.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-100 text-xs font-bold text-blood-800 flex items-center space-x-1">
                <Link to="/find-donors" className="flex items-center space-x-1 hover:underline">
                  <span>Explore Search Filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm relative group hover:shadow-card transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blood-800 text-white font-black text-lg flex items-center justify-center mb-6 shadow-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blood-800 transition">
                Connect with Potential Donors
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Submit an emergency request or send direct requests. Matching donors receive instant multi-channel push and SMS alerts.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-100 text-xs font-bold text-blood-800 flex items-center space-x-1">
                <Link to="/emergency-request" className="flex items-center space-x-1 hover:underline">
                  <span>Create Emergency Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-sm relative group hover:shadow-card transition duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blood-800 text-white font-black text-lg flex items-center justify-center mb-6 shadow-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blood-800 transition">
                Save Lives Safely
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Coordinate donation at verified partner hospital blood banks. Track status in real time until transfusion completes.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-100 text-xs font-bold text-blood-800 flex items-center space-x-1">
                <Link to="/register?role=donor" className="flex items-center space-x-1 hover:underline">
                  <span>Join as Volunteer Donor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOWER SECTION: ABOUT, TESTIMONIALS, GIVE BLOOD (Matches Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: About BloodLink */}
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200"
                    alt="Hands holding red blood heart"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">About BloodLink</h3>
                  <span className="text-xs text-blood-700 font-semibold">Our Mission & Community</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe in the power of community. BloodLink bridges the gap between donors and patients, ensuring that no one has to face a shortage of blood during life’s most vulnerable moments.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-100">
              <Link
                to="/find-donors"
                className="inline-flex items-center space-x-2 bg-blood-800 hover:bg-blood-900 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-sm"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: What Our Users Say (Testimonial with dots from Screenshot 1) */}
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between" id="faqs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg text-slate-900">What Our Users Say</h3>
                <div className="text-blood-700 font-serif text-3xl leading-none">“</div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-600 italic leading-relaxed min-h-[70px]">
                "{TESTIMONIALS[activeTestimonial].quote}"
              </blockquote>

              <div className="flex items-center space-x-3 mt-4 pt-3 border-t border-surface-100">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].author}
                  className="w-9 h-9 rounded-full object-cover border border-blood-200"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {TESTIMONIALS[activeTestimonial].author}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {TESTIMONIALS[activeTestimonial].location} • {TESTIMONIALS[activeTestimonial].role}
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial navigation dots */}
            <div className="flex items-center justify-center space-x-2 mt-4 pt-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTestimonial === i ? 'w-5 bg-blood-800' : 'bg-slate-200'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Card 3: Give Blood. Give Hope. (Promo Card from Screenshot 1) */}
          <div className="bg-gradient-to-br from-blood-50 via-white to-blood-100/60 rounded-3xl p-6 border border-blood-200 shadow-sm flex flex-col justify-between relative overflow-hidden" id="contact">
            {/* Background blood drop art */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 text-blood-200/50 pointer-events-none">
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blood-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-900">
                    Give Blood.
                    <br />
                    <span className="text-blood-800">Give Hope.</span>
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pr-6">
                A single donation can save up to 3 separate lives. Sign up in 60 seconds and become a designated donor for emergency hospital alerts.
              </p>
            </div>

            <div className="mt-6 pt-4">
              <Link
                to="/register?role=donor"
                className="inline-flex items-center space-x-2 bg-blood-800 hover:bg-blood-900 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-sm"
              >
                <span>Be a Donor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* EMERGENCY CTA STRIP */}
      <section className="bg-blood-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-2xl font-black tracking-tight text-white flex items-center justify-center md:justify-start space-x-2">
              <span className="text-red-500 animate-pulse">●</span>
              <span>Need Blood Urgently Right Now?</span>
            </h3>
            <p className="text-blood-200 text-xs sm:text-sm">
              Our automated emergency notification engine alerts all compatible registered donors in your hospital vicinity within 45 seconds.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/emergency-request"
              className="bg-blood-600 hover:bg-blood-500 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg transition"
            >
              Post Emergency Request
            </Link>
            <a
              href="tel:108"
              className="border border-blood-700 hover:bg-blood-900 text-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition"
            >
              Call 108 Emergency
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
