import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ArrowRight, ShieldCheck, Zap, Lock, Users, Building2,
  Clock, Activity, PhoneCall, CheckCircle2, Droplet, ChevronLeft, ChevronRight,
  AlertTriangle, MapPin, Star, TrendingUp, Award, Globe
} from 'lucide-react';
import { BLOOD_GROUPS, BLOOD_GROUP_STATS, TESTIMONIALS } from '../data/mockData';
import { useBloodRequest } from '../context/BloodRequestContext';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { SectionHeader, BloodBadge, StatDisplay, LiveDot } from '../components/ui/index.jsx';

/* ─── Fade-in-up animation variant ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
};

/* ─── Animated counter ─── */
const AnimatedCount = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { stats } = useBloodRequest();
  const [selectedBlood, setSelectedBlood] = useState('O+');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate(`/find-donors?blood=${encodeURIComponent(selectedBlood)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ══════════════════════════════════════
          HERO SECTION — Deep Navy + Crimson
         ══════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial from-blood-900/20 via-transparent to-transparent" />

        {/* Floating blood drop decoration */}
        <div className="absolute top-20 right-10 w-80 h-80 opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-blood-400 animate-float">
            <path d="M100 10 C100 10 160 70 160 120 C160 153 133 180 100 180 C67 180 40 153 40 120 C40 70 100 10 100 10Z" />
          </svg>
        </div>
        <div className="absolute bottom-10 left-10 w-48 h-48 opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full fill-blood-300 animate-float" style={{ animationDelay: '2s' }}>
            <path d="M100 10 C100 10 160 70 160 120 C160 153 133 180 100 180 C67 180 40 153 40 120 C40 70 100 10 100 10Z" />
          </svg>
        </div>

        <div className="container-app relative z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left — Copy */}
            <motion.div className="space-y-8" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>

              {/* Live pill */}
              <motion.div variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-2 bg-blood-800/30 border border-blood-700/40 text-blood-300 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-sm">
                  <LiveDot status={isSupabaseConfigured ? 'live' : 'sandbox'} />
                  {isSupabaseConfigured ? 'Live Network Active' : 'Demo Mode — Connect Supabase to go live'}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp} custom={1}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                  Every Second<br />
                  <span className="text-blood-400">Matters.</span><br />
                  Every Drop<br />
                  <span className="text-blood-400">Counts.</span>
                </h1>
              </motion.div>

              {/* Subheadline */}
              <motion.p variants={fadeUp} custom={2} className="text-lg text-navy-300 max-w-xl leading-relaxed">
                Connecting blood donors, patients and hospitals through intelligent, real-time blood matching. India's most trusted emergency donor network.
              </motion.p>

              {/* Search widget */}
              <motion.div variants={fadeUp} custom={3}>
                <form onSubmit={handleHeroSearch} className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/15 flex flex-col sm:flex-row gap-1.5">
                  <select
                    value={selectedBlood}
                    onChange={e => setSelectedBlood(e.target.value)}
                    className="bg-white text-surface-900 font-bold text-sm px-4 py-3 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blood-500 cursor-pointer flex-shrink-0"
                  >
                    {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      placeholder="City e.g. New Delhi..."
                      value={selectedCity}
                      onChange={e => setSelectedCity(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 text-sm bg-white/90 rounded-xl border-0 outline-none focus:ring-2 focus:ring-blood-500 placeholder:text-surface-400"
                    />
                  </div>
                  <button type="submit" className="btn btn-md btn-primary rounded-xl px-6 flex-shrink-0">
                    <Search className="w-4 h-4" />
                    <span>Find Blood</span>
                  </button>
                </form>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
                <Link to="/emergency-request" className="btn btn-lg bg-blood-700 hover:bg-blood-600 text-white border border-blood-500 shadow-blood">
                  <AlertTriangle className="w-5 h-5" />
                  Emergency Request
                </Link>
                <Link to="/register" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                  <Heart className="w-5 h-5 fill-blood-400 text-blood-400" />
                  Become a Donor
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div variants={fadeUp} custom={5} className="flex flex-wrap items-center gap-5 text-xs text-navy-400 font-semibold pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-success-400" />Verified Donors</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-warning-400" />Real-Time Alerts</span>
                <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-navy-400" />Secure & Private</span>
                <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-navy-400" />Pan-India Network</span>
              </motion.div>
            </motion.div>

            {/* Right — Stats Card + ECG */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="hidden lg:flex flex-col gap-4"
            >
              {/* Live stats card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-sm">Platform Activity</h3>
                  <LiveDot status={isSupabaseConfigured ? 'live' : 'sandbox'} label="Live" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Registered Donors', value: stats.totalDonors, icon: Users, color: 'text-blue-300' },
                    { label: 'Active Requests', value: stats.activeRequests, icon: Activity, color: 'text-warning-300' },
                    { label: 'Lives Impacted', value: stats.fulfilledRequests, icon: Heart, color: 'text-blood-300' },
                    { label: '24x7 Support', value: '108', icon: PhoneCall, color: 'text-success-300' },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                      className="bg-white/10 rounded-2xl p-4">
                      <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
                      <div className="text-2xl font-black text-white num-display">
                        <AnimatedCount target={typeof s.value === 'number' ? s.value : 0} />
                        {typeof s.value === 'string' && s.value}
                      </div>
                      <div className="text-xs text-navy-400 mt-0.5">{s.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* ECG animation */}
                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-3.5 h-3.5 text-success-400" />
                    <span className="text-xs text-navy-400 font-medium">System Heartbeat</span>
                  </div>
                  <svg viewBox="0 0 300 50" className="w-full h-10 stroke-success-400 fill-none stroke-[2]">
                    <path className="ecg-stroke" d="M0 25 L60 25 L70 10 L80 40 L90 15 L100 30 L110 25 L180 25 L190 8 L200 42 L210 12 L220 32 L230 25 L300 25" />
                  </svg>
                </div>
              </div>

              {/* Blood availability quick view */}
              <div className="grid grid-cols-4 gap-2">
                {BLOOD_GROUP_STATS.slice(0, 4).map(item => {
                  const isCritical = item.availability === 'Critical';
                  return (
                    <div key={item.group} onClick={() => navigate(`/find-donors?blood=${encodeURIComponent(item.group)}`)}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15 cursor-pointer hover:bg-white/20 transition text-center group">
                      <BloodBadge group={item.group} size="sm" className="mx-auto mb-1.5" />
                      <div className="text-xs font-bold text-white">{item.group}</div>
                      <div className={`text-[9px] mt-1 font-bold ${isCritical ? 'text-blood-400' : 'text-success-400'}`}>
                        {isCritical ? 'CRITICAL' : 'AVAILABLE'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          QUICK FEATURE PILLS
         ══════════════════════════════════════ */}
      <section className="bg-white border-b border-surface-200">
        <div className="container-app py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Droplet, label: 'Find Nearby Donors', desc: 'ABO + GPS matching', to: '/find-donors', color: 'text-blood-700' },
              { icon: Users,   label: 'Become a Donor',    desc: 'Register in 60 seconds', to: '/register', color: 'text-blue-700' },
              { icon: Clock,   label: 'Real-Time Alerts',  desc: 'Instant multi-channel', to: '/notifications', color: 'text-warning-700' },
              { icon: Heart,   label: 'Save Lives',        desc: 'Emergency request', to: '/emergency-request', color: 'text-success-700' },
            ].map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link to={f.to} className="group flex items-center gap-3.5 p-4 rounded-2xl bg-surface-50 hover:bg-white border border-surface-200 hover:border-surface-300 hover:shadow-card transition-all">
                  <div className={`w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-surface-900 group-hover:text-blood-800 transition truncate">{f.label}</div>
                    <div className="text-xs text-surface-400 truncate">{f.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-surface-300 group-hover:text-blood-600 group-hover:translate-x-0.5 transition ml-auto flex-shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PLATFORM STATS BANNER
         ══════════════════════════════════════ */}
      <section className="bg-gradient-crimson py-14">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            {[
              { value: stats.totalDonors, suffix: '+', label: 'Registered Donors' },
              { value: stats.fulfilledRequests, suffix: '+', label: 'Lives Impacted' },
              { value: 500, suffix: '+', label: 'Partner Hospitals' },
              { value: 24, suffix: 'x7', label: 'Emergency Support' },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl sm:text-4xl font-black num-display mb-1">
                  <AnimatedCount target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-blood-200 font-medium">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS
         ══════════════════════════════════════ */}
      <section className="section bg-white" id="how-it-works">
        <div className="container-app">
          <SectionHeader centered overline="Simple & Fast" title="How BloodLink Works" description="Three seamless steps connecting patients with ready donors in minutes." className="mb-14" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', icon: Search, title: 'Search for Donors', desc: 'Filter by compatible blood group, city, hospital radius, and real-time availability. Advanced ABO/RhD clinical compatibility engine.' },
              { n: '02', icon: Zap, title: 'Connect Instantly', desc: 'Submit an emergency request or direct request. Matching donors receive multi-channel push, SMS, and in-app alerts within 45 seconds.' },
              { n: '03', icon: Heart, title: 'Save Lives Safely', desc: 'Coordinate at verified partner hospitals. Track donation status in real time until transfusion completes. Donor history is recorded.' },
            ].map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="card-hover p-7 group">
                <div className="w-12 h-12 bg-blood-800 text-white font-black text-lg rounded-2xl flex items-center justify-center mb-5 shadow-blood group-hover:shadow-blood-lg transition">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2 group-hover:text-blood-800 transition">{step.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{step.desc}</p>
                <div className="mt-5 pt-4 border-t border-surface-100">
                  <step.icon className="w-5 h-5 text-blood-300 group-hover:text-blood-600 transition" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOOD GROUP AVAILABILITY
         ══════════════════════════════════════ */}
      <section className="section bg-surface-50" id="blood-groups">
        <div className="container-app">
          <SectionHeader centered overline="Live Inventory" title="Blood Group Availability" description="Real-time readiness across regional blood banks and registered voluntary donors." className="mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {BLOOD_GROUP_STATS.map((item, i) => {
              const isCritical = item.availability === 'Critical';
              const isLow = item.availability === 'Low';
              return (
                <motion.div key={item.group} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  onClick={() => navigate(`/find-donors?blood=${encodeURIComponent(item.group)}`)}
                  className={`card-hover p-4 text-center cursor-pointer group transition-all ${isCritical ? 'ring-1 ring-blood-200' : ''}`}
                >
                  <BloodBadge group={item.group} size="md" className="mx-auto mb-2.5" />
                  <div className="text-xs font-black text-surface-800 mb-2">{item.group}</div>
                  <div className="w-full bg-surface-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.percentage}%` }} viewport={{ once: true }}
                      className={`h-full rounded-full ${isCritical ? 'bg-danger-500' : isLow ? 'bg-warning-500' : 'bg-success-500'}`} />
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isCritical ? 'bg-danger-50 text-danger-700' : isLow ? 'bg-warning-50 text-warning-700' : 'bg-success-50 text-success-700'
                  }`}>
                    {isCritical ? '🚨 Critical' : isLow ? '⚠️ Low' : '✓ Available'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ABOUT + TESTIMONIALS + CTA
         ══════════════════════════════════════ */}
      <section className="section bg-white" id="about">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* About */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="card p-7 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blood-50 flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 text-blood-700 fill-blood-200" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">About BloodLink</h3>
                <span className="badge badge-blood text-xs mb-3">Our Mission</span>
                <p className="text-sm text-surface-500 leading-relaxed">
                  We believe in the power of community. BloodLink bridges the gap between donors and patients, ensuring that no one has to face a blood shortage during life's most critical moments. Every verified donor on our platform is a heartbeat of hope.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-surface-100 flex items-center gap-3">
                {[ShieldCheck, Zap, Award].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl bg-surface-50 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-surface-500" />
                  </div>
                ))}
                <Link to="/find-donors" className="ml-auto btn btn-sm btn-primary">Explore <ArrowRight className="w-3.5 h-3.5" /></Link>
              </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="card p-7 flex flex-col justify-between" id="faqs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-surface-900">What Our Users Say</h3>
                  <span className="text-blood-200 font-serif text-4xl leading-none">"</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTestimonial} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
                    <blockquote className="text-sm text-surface-600 italic leading-relaxed min-h-[80px]">
                      "{TESTIMONIALS[activeTestimonial].quote}"
                    </blockquote>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-surface-100">
                      <img src={TESTIMONIALS[activeTestimonial].avatar} alt={TESTIMONIALS[activeTestimonial].author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-blood-100" />
                      <div>
                        <div className="text-sm font-bold text-surface-900">{TESTIMONIALS[activeTestimonial].author}</div>
                        <div className="text-xs text-surface-400">{TESTIMONIALS[activeTestimonial].location} · {TESTIMONIALS[activeTestimonial].role}</div>
                      </div>
                      <div className="ml-auto flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-warning-400 text-warning-400" />)}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-center gap-2 mt-5">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => setActiveTestimonial(i)}
                    className={`rounded-full transition-all duration-300 ${activeTestimonial === i ? 'w-6 h-2 bg-blood-700' : 'w-2 h-2 bg-surface-200'}`} />
                ))}
              </div>
            </motion.div>

            {/* Join CTA */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-gradient-hero rounded-2xl p-7 flex flex-col justify-between relative overflow-hidden border border-navy-700" id="contact">
              <div className="absolute inset-0 bg-dot-pattern opacity-30" />
              <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5">
                <svg viewBox="0 0 200 200" className="w-full h-full fill-blood-400">
                  <path d="M100 10 C100 10 160 70 160 120 C160 153 133 180 100 180 C67 180 40 153 40 120 C40 70 100 10 100 10Z" />
                </svg>
              </div>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-blood-800 flex items-center justify-center mb-5 shadow-blood">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Give Blood.<br /><span className="text-blood-400">Give Hope.</span></h3>
                <p className="text-sm text-navy-300 leading-relaxed">
                  A single donation can save up to 3 separate lives. Join our verified donor network and be ready when it matters most.
                </p>
              </div>
              <div className="relative mt-6 flex flex-col gap-2">
                <Link to="/register" className="btn btn-md bg-blood-700 hover:bg-blood-600 text-white border border-blood-600 shadow-blood w-full justify-center">
                  <Heart className="w-4 h-4 fill-current" />Be a Donor
                </Link>
                <Link to="/emergency-request" className="btn btn-md bg-white/10 hover:bg-white/20 text-white border border-white/20 w-full justify-center">
                  <AlertTriangle className="w-4 h-4" />Emergency Request
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EMERGENCY CTA STRIP
         ══════════════════════════════════════ */}
      <section className="bg-blood-950 py-14">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-blood-500 animate-pulse flex-shrink-0" />
                Need Blood Urgently Right Now?
              </h3>
              <p className="text-sm text-blood-300">
                Our AI alert engine notifies all compatible verified donors in your hospital vicinity within 45 seconds.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/emergency-request" className="btn btn-lg bg-blood-700 hover:bg-blood-600 text-white border border-blood-600 shadow-blood">
                Post Emergency Request
              </Link>
              <a href="tel:108" className="btn btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20">
                <PhoneCall className="w-5 h-5" />Call 108
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
