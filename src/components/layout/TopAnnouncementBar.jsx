import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Instagram, Linkedin, Youtube, ChevronDown, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { CITIES } from '../../data/mockData';

export const TopAnnouncementBar = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, verifyAdminAccess, isSupabaseConfigured } = useAuth();
  const { showToast } = useNotification();
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [keyError, setKeyError] = useState('');

  const handleAdminKeySubmit = async (e) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setIsVerifying(true);
    setKeyError('');
    try {
      const success = await verifyAdminAccess(adminKey);
      if (success) {
        showToast('Admin privileges unlocked successfully!', 'success');
        setShowAdminModal(false);
        setAdminKey('');
        navigate('/admin');
      } else {
        setKeyError('Invalid Secret Admin Key. Access denied.');
        showToast('Invalid Admin Key', 'error');
      }
    } catch (err) {
      setKeyError('Failed to verify key on server.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-blood-950 text-blood-100 text-xs py-2 px-4 sm:px-8 border-b border-blood-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left tagline */}
        <div className="flex items-center space-x-2">
          <span className="inline-block text-blood-400">🩸</span>
          <span className="font-medium tracking-wide">Donate Blood. Save Lives.</span>
          <span className="text-red-400">♥</span>
        </div>

        {/* Right tools and contacts */}
        <div className="flex items-center flex-wrap justify-center gap-4 sm:gap-6">
          {/* City selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityMenu(!showCityMenu)}
              className="flex items-center space-x-1 text-blood-200 hover:text-white transition cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-blood-400" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-blood-400" />
            </button>

            {showCityMenu && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowCityMenu(false)}
              >
                {CITIES.slice(1, 8).map(city => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-blood-50 hover:text-blood-800 transition ${
                      selectedCity === city ? 'font-bold text-blood-800 bg-blood-50' : ''
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-blood-800 hidden sm:inline">|</span>

          {/* Emergency 24/7 hotline */}
          <a
            href="tel:108"
            className="flex items-center space-x-1 text-blood-200 hover:text-white font-medium transition"
          >
            <Phone className="w-3.5 h-3.5 text-blood-400" />
            <span>Emergency? Call <strong className="text-white underline">108</strong></span>
          </a>

          <span className="text-blood-800 hidden sm:inline">|</span>

          {/* Social icons */}
          <div className="flex items-center space-x-3 text-blood-300">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white transition">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>

          <span className="text-blood-800 hidden sm:inline">|</span>

          {/* Database Integration Status Indicator */}
          <span 
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
              isSupabaseConfigured 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
            title={isSupabaseConfigured ? 'Connected to live Supabase PostgreSQL' : 'Local Sandbox Mode (Configure VITE_SUPABASE_URL in .env to connect cloud database)'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isSupabaseConfigured ? 'Cloud Live' : 'Sandbox DB'}</span>
          </span>

          <span className="text-blood-800 hidden sm:inline">|</span>

          {/* Secret Admin Access Action */}
          {isAdmin ? (
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-1 bg-purple-900 hover:bg-purple-800 text-purple-200 px-2.5 py-1 rounded-full border border-purple-700 transition"
              title="Open Admin Control Center"
            >
              <ShieldAlert className="w-3 h-3 text-purple-300" />
              <span className="font-bold">Admin Active</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center space-x-1 text-blood-300 hover:text-white transition"
              title="Enter Secret Admin Access Key"
            >
              <KeyRound className="w-3 h-3 text-blood-400" />
              <span>Admin Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Secret Admin Key Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs text-slate-800 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 bg-blood-50 text-blood-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-1">Enter Secret Admin Key</h3>
            <p className="text-xs text-slate-500 mb-4">
              Authorized administrators only. This key is validated securely on the backend.
            </p>

            {keyError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                {keyError}
              </div>
            )}

            <form onSubmit={handleAdminKeySubmit} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Secret Admin Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-blood-800 font-mono text-center tracking-widest"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminKey('');
                    setKeyError('');
                  }}
                  className="flex-1 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition disabled:opacity-60"
                >
                  {isVerifying ? 'Verifying...' : 'Unlock Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
