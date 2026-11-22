import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, ChevronDown, User, HeartHandshake, LogOut, ShieldAlert, Activity, Droplet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const Navbar = () => {
  const { currentUser, logout, isDonor, isRequester, isAdmin } = useAuth();
  const { unreadCount } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [findDonorsDropdown, setFindDonorsDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/find-donors?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-surface-200 sticky top-8 sm:top-8 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            {/* Blood drop with ECG icon */}
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-11 h-11 fill-blood-800 transition transform group-hover:scale-105 drop-shadow-sm">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              {/* ECG heartbeat overlay */}
              <svg viewBox="0 0 24 24" className="w-6 h-6 absolute text-white fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 3 8 2-6 2 4h4" />
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-blood-800 transition">
                  Blood<span className="text-blood-800">Link</span>
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                Smart Blood Donor Network
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            {/* Home Link */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                isActive('/')
                  ? 'bg-blood-800 text-white font-semibold shadow-sm'
                  : 'text-slate-700 hover:text-blood-800 hover:bg-blood-50'
              }`}
            >
              Home
            </Link>

            {/* Find Donors with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setFindDonorsDropdown(!findDonorsDropdown)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive('/find-donors')
                    ? 'bg-blood-800 text-white font-semibold'
                    : 'text-slate-700 hover:text-blood-800 hover:bg-blood-50'
                }`}
              >
                <span>Find Donors</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {findDonorsDropdown && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-surface-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setFindDonorsDropdown(false)}
                >
                  <Link
                    to="/find-donors"
                    onClick={() => setFindDonorsDropdown(false)}
                    className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-blood-50 hover:text-blood-800"
                  >
                    🔍 All Available Donors
                  </Link>
                  <div className="px-4 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Blood Match
                  </div>
                  <div className="grid grid-cols-4 gap-1 px-3 py-1">
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                      <Link
                        key={bg}
                        to={`/find-donors?blood=${encodeURIComponent(bg)}`}
                        onClick={() => setFindDonorsDropdown(false)}
                        className="text-center py-1 text-xs font-bold rounded hover:bg-blood-100 text-blood-800"
                      >
                        {bg}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Emergency Blood Request */}
            <Link
              to="/emergency-request"
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                isActive('/emergency-request')
                  ? 'bg-blood-800 text-white font-semibold'
                  : 'text-slate-700 hover:text-blood-800 hover:bg-blood-50'
              }`}
            >
              Emergency Request
            </Link>

            {/* Become a Donor */}
            <Link
              to="/register?role=donor"
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                isActive('/register')
                  ? 'bg-blood-800 text-white font-semibold'
                  : 'text-slate-700 hover:text-blood-800 hover:bg-blood-50'
              }`}
            >
              Become a Donor
            </Link>

            {/* Dashboards link depending on role */}
            {currentUser && (
              <Link
                to={
                  isDonor
                    ? '/donor-dashboard'
                    : isRequester
                    ? '/requester-dashboard'
                    : '/admin'
                }
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  location.pathname.includes('dashboard') || location.pathname.includes('admin')
                    ? 'bg-blood-800 text-white font-semibold'
                    : 'text-blood-800 font-bold hover:bg-blood-50'
                }`}
              >
                Dashboard
              </Link>
            )}

            <Link
              to="/#about"
              className="px-3 py-2 rounded-full text-slate-700 hover:text-blood-800 hover:bg-blood-50 transition"
            >
              About Us
            </Link>

            <Link
              to="/#faqs"
              className="px-3 py-2 rounded-full text-slate-700 hover:text-blood-800 hover:bg-blood-50 transition"
            >
              FAQs
            </Link>

            <Link
              to="/#contact"
              className="px-3 py-2 rounded-full text-slate-700 hover:text-blood-800 hover:bg-blood-50 transition"
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-600 hover:text-blood-800 hover:bg-blood-50 rounded-full transition"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <form
                  onSubmit={handleSearchSubmit}
                  className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-surface-200 p-2 z-50 flex items-center space-x-2 animate-in fade-in"
                >
                  <input
                    type="text"
                    placeholder="Search by city, hospital, donor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blood-700"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blood-800 text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-blood-900 transition"
                  >
                    Go
                  </button>
                </form>
              )}
            </div>

            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="relative p-2 text-slate-600 hover:text-blood-800 hover:bg-blood-50 rounded-full transition"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blood-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons or User Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-blood-50 hover:bg-blood-100 border border-blood-200 pl-1.5 pr-3 py-1.5 rounded-full transition text-slate-800"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-blood-400"
                  />
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold block leading-none text-slate-900">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-blood-700 font-semibold uppercase">
                      {currentUser.role} {currentUser.bloodGroup && `(${currentUser.bloodGroup})`}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-blood-800" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-card border border-surface-200 py-2 z-50 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-surface-200">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      {currentUser.bloodGroup && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blood-100 text-blood-800 text-[10px] font-bold rounded-full">
                          Blood Group: {currentUser.bloodGroup}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {isDonor && (
                        <Link
                          to="/donor-dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-blood-50 hover:text-blood-800"
                        >
                          <Activity className="w-4 h-4 text-blood-700" />
                          <span>Donor Dashboard</span>
                        </Link>
                      )}
                      {isRequester && (
                        <Link
                          to="/requester-dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-blood-50 hover:text-blood-800"
                        >
                          <Droplet className="w-4 h-4 text-blood-700" />
                          <span>Requester Dashboard</span>
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-blood-50 hover:text-blood-800"
                        >
                          <ShieldAlert className="w-4 h-4 text-blood-700" />
                          <span>Admin Control Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/notifications"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-xs text-slate-700 hover:bg-blood-50 hover:text-blood-800"
                      >
                        <Bell className="w-4 h-4 text-blood-700" />
                        <span>Notification Center</span>
                      </Link>
                    </div>

                    <div className="border-t border-surface-200 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="flex items-center space-x-2 w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 bg-blood-800 hover:bg-blood-900 text-white px-5 py-2 rounded-full text-xs font-bold transition shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center space-x-1 border border-blood-800 text-blood-800 hover:bg-blood-50 px-4 py-2 rounded-full text-xs font-bold transition"
                >
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-blood-800 rounded-lg"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-surface-200 py-4 space-y-2 animate-in slide-in-from-top-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
            >
              Home
            </Link>
            <Link
              to="/find-donors"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
            >
              Find Donors
            </Link>
            <Link
              to="/emergency-request"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-semibold text-blood-700 hover:bg-blood-50"
            >
              🚨 Emergency Request
            </Link>
            <Link
              to="/register?role=donor"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
            >
              Become a Donor
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/donor-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
                >
                  Donor Dashboard (Amit)
                </Link>
                <Link
                  to="/requester-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
                >
                  Requester Dashboard (Maria)
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blood-50 text-slate-800"
                >
                  Admin Portal
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-surface-200 flex space-x-2 px-4">
              {!currentUser ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-blood-800 text-white py-2 rounded-full text-xs font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center border border-blood-800 text-blood-800 py-2 rounded-full text-xs font-bold"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 bg-red-100 text-red-700 rounded-lg text-xs font-bold"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
