import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, ShieldCheck, Activity, ArrowRight } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-navy-900 text-navy-300 pt-16 pb-8 border-t border-navy-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">

        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 24 24" className="w-9 h-9 fill-blood-600">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <svg viewBox="0 0 24 24" className="w-5 h-5 absolute inset-0 m-auto text-white fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-4 3 8 2-6 2 4h4" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-white">Blood<span className="text-blood-500">Link</span></span>
          </div>
          <p className="text-sm text-navy-400 max-w-sm leading-relaxed">
            Every Drop Counts. Every Donor Matters. BloodLink intelligently connects voluntary blood donors with patients and healthcare institutions across India through real-time, clinically verified matching.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-navy-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-navy-700">
              <ShieldCheck className="w-3.5 h-3.5 text-success-400" />Verified Community
            </span>
            <span className="inline-flex items-center gap-1.5 bg-navy-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-navy-700">
              <Activity className="w-3.5 h-3.5 text-blood-400" />24x7 Real-Time
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Quick Navigation</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/find-donors', label: 'Find Blood Donors' },
              { to: '/emergency-request', label: '🚨 Emergency Request', urgent: true },
              { to: '/register', label: 'Become a Donor' },
              { to: '/dashboard', label: 'User Dashboard' },
              { to: '/admin', label: 'Admin Portal' },
            ].map(item => (
              <li key={item.to}>
                <Link to={item.to} className={`hover:text-white transition ${item.urgent ? 'text-blood-400 hover:text-blood-300 font-semibold' : ''}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Blood Groups */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Blood Groups</h4>
          <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
            {['O+','O-','A+','A-','B+','B-','AB+','AB-'].map(bg => (
              <Link key={bg} to={`/find-donors?blood=${encodeURIComponent(bg)}`}
                className="p-2 rounded-lg bg-navy-800 hover:bg-blood-900/50 hover:text-white transition flex items-center justify-between border border-navy-700">
                <span>{bg}</span><span className="text-navy-500 text-[10px]">Match →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Emergency */}
        <div>
          <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Emergency Desk</h4>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-blood-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-bold text-sm">108 / 112</div>
                <div className="text-navy-400">National Emergency Response</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blood-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">helpdesk@bloodlink.org</div>
                <div className="text-navy-400">Hospital & Blood Bank Desk</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-blood-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium">AIIMS & Partner Banks</div>
                <div className="text-navy-400">New Delhi (Pan-India)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-navy-500 gap-4">
        <p>© 2026 BloodLink Technologies. All rights reserved. Built for life-saving efficiency.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-navy-300 cursor-pointer transition">Privacy Policy</span>
          <span className="hover:text-navy-300 cursor-pointer transition">Terms of Service</span>
          <span className="hover:text-navy-300 cursor-pointer transition">Donor Ethics</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
