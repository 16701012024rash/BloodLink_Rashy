import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Menu, X, ChevronDown, User, LogOut,
  ShieldAlert, Droplet, AlertTriangle, Heart, LayoutDashboard,
  Settings, Wifi, WifiOff, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { LiveDot } from '../ui/index.jsx';

const NavLink = ({ to, children, active, className = '' }) => (
  <Link
    to={to}
    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${active
      ? 'bg-blood-50 text-blood-800 font-semibold'
      : `text-surface-600 hover:text-surface-900 hover:bg-surface-100 ${className}`
      }`}
  >
    {children}
  </Link>
);

export const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);
  const [donorDropOpen, setDonorDropOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const userDropRef = useRef(null);
  const searchRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const dbStatus = isSupabaseConfigured ? 'live' : 'sandbox';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) setUserDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-donors?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    setUserDropOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <>
      {/* Top Announcement Strip */}
      <div className="bg-navy-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:108" className="flex items-center gap-1.5 font-bold text-blood-300 hover:text-blood-200 transition">
              <span className="animate-pulse-dot inline-block w-1.5 h-1.5 bg-blood-400 rounded-full" />
              Emergency: 108 / 112
            </a>
            <span className="hidden sm:block text-navy-400">|</span>
            <span className="hidden sm:block text-navy-300">India's Real-Time Blood Donor Network</span>
          </div>
          <div className="flex items-center gap-3">
            <LiveDot
              status={dbStatus}
              label={isSupabaseConfigured ? '🟢 Cloud Live' : '🟡 Sandbox'}
            />
            {currentUser?.isAdmin && (
              <span className="badge bg-blood-800/40 border border-blood-700/50 text-blood-300">
                <ShieldAlert className="w-3 h-3" />
                Admin Mode
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-surface-200' : 'bg-white border-b border-surface-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-9 h-9 fill-blood-800 drop-shadow-sm transition-transform group-hover:scale-105">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5 absolute text-white fill-none stroke-current stroke-[2.5]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 3 8 2-6 2 4h4" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black tracking-tight text-surface-900">
                  Blood<span className="text-blood-800">Link</span>
                </div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-surface-400 -mt-0.5">Smart Donor Network</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" active={isActive('/')}>Home</NavLink>

              {/* Find Donors with dropdown */}
              <div className="relative" onMouseLeave={() => setDonorDropOpen(false)}>
                <button
                  onMouseEnter={() => setDonorDropOpen(true)}
                  onClick={() => navigate('/find-donors')}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/find-donors') ? 'bg-blood-50 text-blood-800 font-semibold' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`}
                >
                  Find Donors
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${donorDropOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {donorDropOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-surface-200 py-2 z-50"
                    >
                      <Link to="/find-donors" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-blood-800 font-medium">
                        <Search className="w-4 h-4" />All Verified Donors
                      </Link>
                      <div className="px-4 py-1.5 text-xs font-bold text-surface-400 uppercase tracking-widest mt-1 border-t border-surface-100 pt-2">Quick Match by Group</div>
                      <div className="grid grid-cols-4 gap-1 px-3 pb-2">
                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                          <Link key={bg} to={`/find-donors?blood=${encodeURIComponent(bg)}`}
                            className="text-center py-1.5 text-xs font-bold rounded-lg hover:bg-blood-50 text-blood-800 transition">
                            {bg}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/emergency-request" active={isActive('/emergency-request')}>
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-blood-600" />
                  Emergency
                </span>
              </NavLink>

              {currentUser && (
                <NavLink to="/dashboard" active={isActive('/dashboard')}>
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </span>
                </NavLink>
              )}

              <a href="/#about" className="px-3.5 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all">About</a>
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-surface-500 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition">
                  <Search className="w-5 h-5" />
                </button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.form onSubmit={handleSearch}
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-surface-200 p-2.5 z-50 flex items-center gap-2">
                      <Search className="w-4 h-4 text-surface-400 flex-shrink-0" />
                      <input ref={searchRef} autoFocus type="text" placeholder="Search donors, cities..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-surface-400 text-surface-800" />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="p-0.5 hover:opacity-70">
                          <X className="w-3.5 h-3.5 text-surface-400" />
                        </button>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Notifications Bell */}
              {currentUser && (
                <Link to="/notifications" className="relative p-2 text-surface-500 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-blood-700 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Dropdown or Auth Buttons */}
              {currentUser ? (
                <div className="relative" ref={userDropRef}>
                  <button onClick={() => setUserDropOpen(!userDropOpen)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-100 transition">
                    <div className="w-8 h-8 rounded-full bg-gradient-crimson flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                      {currentUser.name?.charAt(0).toUpperCase() || currentUser.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-semibold text-surface-700 max-w-[90px] truncate">
                      {currentUser.name || currentUser.full_name}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform hidden sm:block ${userDropOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userDropOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-surface-200 py-2 z-50 overflow-hidden"
                      >
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-surface-100">
                          <p className="text-sm font-bold text-surface-900 truncate">{currentUser.name || currentUser.full_name}</p>
                          <p className="text-xs text-surface-400 truncate">{currentUser.email}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            {currentUser.isDonor && <span className="badge badge-blood text-[10px]"><Heart className="w-2.5 h-2.5 fill-current" />Donor</span>}
                            {currentUser.isAdmin && <span className="badge badge-warning text-[10px]"><ShieldAlert className="w-2.5 h-2.5" />Admin</span>}
                          </div>
                        </div>
                        <div className="py-1">
                          <Link to="/dashboard" onClick={() => setUserDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition">
                            <LayoutDashboard className="w-4 h-4 text-surface-400" />My Dashboard
                          </Link>
                          <Link to="/dashboard?tab=profile" onClick={() => setUserDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition">
                            <User className="w-4 h-4 text-surface-400" />My Profile
                          </Link>
                          <Link to="/dashboard?tab=settings" onClick={() => setUserDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-surface-700 hover:bg-surface-50 hover:text-surface-900 transition">
                            <Settings className="w-4 h-4 text-surface-400" />Settings
                          </Link>
                          {currentUser.isAdmin && (
                            <Link to="/admin" onClick={() => setUserDropOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-blood-700 hover:bg-blood-50 transition">
                              <ShieldAlert className="w-4 h-4" />Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-surface-100 pt-1 pb-1">
                          <button onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-600 hover:bg-surface-50 hover:text-surface-900 transition">
                            <LogOut className="w-4 h-4 text-surface-400" />Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="hidden sm:block btn btn-sm btn-ghost text-surface-600">Sign In</Link>
                  <Link to="/register" className="btn btn-sm btn-primary">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:block">Join BloodLink</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-surface-600 hover:bg-surface-100 rounded-lg transition ml-1">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-surface-200 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <Link to="/" className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/') ? 'bg-blood-50 text-blood-800' : 'text-surface-700 hover:bg-surface-50'}`}>
                  Home
                </Link>
                <Link to="/find-donors" className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/find-donors') ? 'bg-blood-50 text-blood-800' : 'text-surface-700 hover:bg-surface-50'}`}>
                  <Droplet className="w-4 h-4" />Find Donors
                </Link>
                <Link to="/emergency-request" className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/emergency-request') ? 'bg-blood-50 text-blood-800' : 'text-surface-700 hover:bg-surface-50'}`}>
                  <AlertTriangle className="w-4 h-4 text-blood-600" />Emergency Request
                </Link>
                {currentUser && (
                  <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive('/dashboard') ? 'bg-blood-50 text-blood-800' : 'text-surface-700 hover:bg-surface-50'}`}>
                    <LayoutDashboard className="w-4 h-4" />My Dashboard
                  </Link>
                )}
                <a href="/#about" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-700 hover:bg-surface-50">About</a>
                {!currentUser && (
                  <div className="pt-2 flex flex-col gap-2">
                    <Link to="/login" className="btn btn-md btn-secondary w-full justify-center">Sign In</Link>
                    <Link to="/register" className="btn btn-md btn-primary w-full justify-center">Join BloodLink</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
