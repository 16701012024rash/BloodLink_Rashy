import React, { useState } from 'react';
import { Phone, MapPin, Instagram, Linkedin, Youtube, ChevronDown, UserCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CITIES } from '../../data/mockData';

export const TopAnnouncementBar = () => {
  const { currentUser, switchRole } = useAuth();
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);

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

          {/* Demo Persona Quick Switcher (Helpful for testing & evaluators) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-1.5 bg-blood-900 hover:bg-blood-800 text-blood-100 px-2.5 py-1 rounded-full border border-blood-700 transition"
              title="Switch demo persona to test any role"
            >
              <UserCircle2 className="w-3.5 h-3.5 text-blood-300" />
              <span>Role: <strong className="text-white capitalize">{currentUser ? currentUser.role : 'Guest'}</strong></span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1 border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Switch Demo Persona
                </div>
                <button
                  onClick={() => { switchRole('donor'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-blood-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-800">Amit Kumar (O+)</div>
                    <div className="text-[10px] text-slate-500">Donor Persona</div>
                  </div>
                  {currentUser?.role === 'donor' && <span className="text-blood-800 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => { switchRole('requester'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-blood-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-800">Maria Rodriguez (A+)</div>
                    <div className="text-[10px] text-slate-500">Requester Persona</div>
                  </div>
                  {currentUser?.role === 'requester' && <span className="text-blood-800 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => { switchRole('admin'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-blood-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-800">System Admin</div>
                    <div className="text-[10px] text-slate-500">Admin Oversight</div>
                  </div>
                  {currentUser?.role === 'admin' && <span className="text-blood-800 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => { switchRole('guest'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-blood-50 flex items-center justify-between border-t border-slate-100"
                >
                  <div>
                    <div className="font-semibold text-slate-800">Guest Visitor</div>
                    <div className="text-[10px] text-slate-500">Logged Out State</div>
                  </div>
                  {!currentUser && <span className="text-blood-800 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
