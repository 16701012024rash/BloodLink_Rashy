import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, ShieldCheck, Phone, Clock, Droplet, Award, MessageCircle } from 'lucide-react';
import { BloodBadge } from '../ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function maskPhone(phone) {
  if (!phone) return '•••• ••••••';
  const clean = phone.replace(/\s/g, '');
  if (clean.length <= 5) return '••••••••••';
  return clean.slice(0, -5).replace(/./g, '•') + ' ' + clean.slice(-5).replace(/.{3}$/, '•••');
}

export const DonorCard = ({ donor, distance, onSelect, selected = false, className = '' }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const name  = donor.full_name || donor.name || 'Anonymous Donor';
  const city  = donor.city || donor.state || 'India';
  const blood = donor.blood_group || donor.bloodGroup || '?';
  const avail = donor.isAvailable ?? donor.availability ?? false;
  const verif = donor.isVerified ?? (donor.verification_status === 'verified') ?? false;
  const dons  = donor.total_donations ?? donor.totalDonations ?? 0;
  const lives = donor.lives_impacted ?? donor.livesImpacted ?? 0;
  const lastD = donor.last_donation_date || donor.lastDonated || null;
  const isUniversal = blood === 'O-';

  const handleContact = (e) => {
    e.stopPropagation();
    if (!currentUser) { navigate('/login', { state: { from: { pathname: '/find-donors' } } }); return; }
    navigate('/emergency-request');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect?.(donor)}
      className={`card cursor-pointer transition-all duration-200 overflow-hidden group ${
        selected ? 'ring-2 ring-blood-700 shadow-blood' : 'hover:shadow-card-hover hover:border-surface-300'
      } ${className}`}
    >
      {/* Top strip */}
      <div className={`h-1 w-full ${avail ? 'bg-gradient-to-r from-success-500 to-success-400' : 'bg-surface-200'}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <BloodBadge group={blood} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-surface-900 text-sm truncate">{name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-surface-400" />
                  <span className="text-xs text-surface-500 truncate">{city}</span>
                  {distance != null && <span className="text-xs text-surface-400 font-medium">· {distance.toFixed(1)} km</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`badge text-[10px] font-bold ${avail ? 'badge-success' : 'badge-neutral'}`}>
                  {avail ? '● Available' : '○ Unavailable'}
                </span>
                {isUniversal && (
                  <span className="badge bg-orange-50 border-orange-200 text-orange-700 text-[10px]">
                    Universal
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-surface-50 rounded-xl">
          <div className="text-center">
            <div className="text-base font-black text-surface-900 num-display">{dons}</div>
            <div className="text-[10px] text-surface-400 font-medium">Donations</div>
          </div>
          <div className="text-center border-x border-surface-200">
            <div className="text-base font-black text-surface-900 num-display">{lives}</div>
            <div className="text-[10px] text-surface-400 font-medium">Lives Saved</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black text-surface-900 leading-tight">{lastD ? lastD.toString().slice(0, 6) : 'N/A'}</div>
            <div className="text-[10px] text-surface-400 font-medium">Last Donated</div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {verif && (
            <span className="badge badge-success text-[10px]">
              <ShieldCheck className="w-2.5 h-2.5" />Verified
            </span>
          )}
          {donor.badges?.slice(0, 2).map(b => (
            <span key={b} className="badge badge-blood text-[10px]"><Award className="w-2.5 h-2.5" />{b}</span>
          ))}
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2 text-xs text-surface-500 mb-4 py-2 px-3 bg-surface-50 rounded-lg">
          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-mono font-semibold">{currentUser ? (donor.phone || maskPhone('')) : maskPhone(donor.phone)}</span>
          {!currentUser && <span className="text-[10px] text-surface-400 ml-auto">Sign in to reveal</span>}
        </div>

        {/* Action */}
        <button onClick={handleContact}
          disabled={!avail}
          className={`btn btn-md w-full justify-center ${avail ? 'btn-primary' : 'btn-secondary opacity-60 cursor-not-allowed'}`}>
          {avail ? (
            <><MessageCircle className="w-4 h-4" />Request Blood</>
          ) : (
            <><Clock className="w-4 h-4" />Currently Unavailable</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default DonorCard;
