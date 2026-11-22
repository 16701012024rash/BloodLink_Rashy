import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, ShieldCheck, Activity } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-blood-600">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <svg viewBox="0 0 24 24" className="w-5 h-5 absolute text-white fill-none stroke-current stroke-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 3 8 2-6 2 4h4" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Blood<span className="text-blood-500">Link</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Every Drop Counts. Every Donor Matters. BloodLink is an intelligent emergency networking platform connecting voluntary blood donors directly with patients and healthcare institutions across India.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Community</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
                <Activity className="w-4 h-4 text-blood-400" />
                <span>24x7 Real-Time Alert System</span>
              </span>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blood-400 transition">Home</Link>
              </li>
              <li>
                <Link to="/find-donors" className="hover:text-blood-400 transition">Find Blood Donors</Link>
              </li>
              <li>
                <Link to="/emergency-request" className="text-blood-400 hover:text-blood-300 font-semibold transition">
                  🚨 Emergency Request
                </Link>
              </li>
              <li>
                <Link to="/register?role=donor" className="hover:text-blood-400 transition">Become a Donor</Link>
              </li>
              <li>
                <Link to="/donor-dashboard" className="hover:text-blood-400 transition">Donor Dashboard</Link>
              </li>
              <li>
                <Link to="/requester-dashboard" className="hover:text-blood-400 transition">Requester Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-blood-400 transition">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Blood Group Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Blood Groups</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              {['O+ Positive', 'O- Negative', 'A+ Positive', 'A- Negative', 'B+ Positive', 'B- Negative', 'AB+ Positive', 'AB- Negative'].map((bg) => {
                const code = bg.split(' ')[0];
                return (
                  <Link
                    key={bg}
                    to={`/find-donors?blood=${encodeURIComponent(code)}`}
                    className="p-1.5 rounded bg-slate-800 hover:bg-blood-900 hover:text-white transition flex items-center justify-between"
                  >
                    <span>{code}</span>
                    <span className="text-[10px] text-slate-400">Match</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Col 5: Emergency Contacts */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Emergency Desk</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-blood-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-white font-bold text-sm">108 / 112</div>
                  <div className="text-slate-400 text-[11px]">National Emergency Response</div>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-blood-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-white font-medium">helpdesk@bloodlink.org</div>
                  <div className="text-slate-400 text-[11px]">Hospital & Blood Bank Desk</div>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blood-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-white font-medium">AIIMS Campus & Partner Banks</div>
                  <div className="text-slate-400 text-[11px]">Connaught Place, New Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 BloodLink Technologies. All rights reserved. Built for life-saving efficiency.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Donor Code of Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
