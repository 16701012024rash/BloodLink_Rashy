import React, { useState } from 'react';
import { MapPin, Calendar, Droplet, Phone, CheckCircle2, Shield, Heart, Send } from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const DonorCard = ({ donor, onRequestBlood }) => {
  const [showContactModal, setShowContactModal] = useState(false);
  const { showToast } = useNotification();
  const { currentUser } = useAuth();

  const handleQuickRequest = () => {
    if (onRequestBlood) {
      onRequestBlood(donor);
    } else {
      setShowContactModal(true);
    }
  };

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    setShowContactModal(false);
    showToast(`Blood request alert dispatched to ${donor.name} via SMS & BloodLink push!`, 'success');
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between group">
        <div>
          {/* Top row: Avatar, Info, Blood Group Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <img
                  src={donor.avatar}
                  alt={donor.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-blood-100 group-hover:border-blood-400 transition"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    donor.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  title={donor.isAvailable ? 'Available Now' : 'Recently Donated / Standby'}
                />
              </div>

              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-slate-900 group-hover:text-blood-800 transition text-base">
                    {donor.name}
                  </h3>
                  {donor.isVerified && (
                    <Shield className="w-4 h-4 text-emerald-600 fill-emerald-100" title="Verified Donor" />
                  )}
                </div>

                <div className="flex items-center space-x-1 text-slate-500 text-xs mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blood-700 shrink-0" />
                  <span>{donor.city}, {donor.state}</span>
                </div>
              </div>
            </div>

            {/* Prominent Blood Group Badge */}
            <BloodGroupBadge group={donor.bloodGroup} size="md" />
          </div>

          {/* Details row: Last Donated & Stats */}
          <div className="mt-4 pt-4 border-t border-surface-200 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-surface-50 p-2.5 rounded-xl border border-surface-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Last Donated
              </span>
              <div className="flex items-center space-x-1 mt-0.5 text-slate-700 font-semibold truncate">
                <Calendar className="w-3.5 h-3.5 text-blood-700" />
                <span>{donor.lastDonated}</span>
              </div>
            </div>

            <div className="bg-surface-50 p-2.5 rounded-xl border border-surface-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Total Donations
              </span>
              <div className="flex items-center space-x-1 mt-0.5 text-slate-700 font-semibold">
                <Droplet className="w-3.5 h-3.5 text-blood-700 fill-blood-200" />
                <span>{donor.totalDonations} Times ({donor.livesImpacted} Lives)</span>
              </div>
            </div>
          </div>

          {/* Bio snippet */}
          {donor.bio && (
            <p className="mt-3 text-xs text-slate-600 line-clamp-2 italic">
              "{donor.bio}"
            </p>
          )}

          {/* Badges pills */}
          {donor.badges && donor.badges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {donor.badges.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blood-50 text-blood-800 border border-blood-100"
                >
                  <Heart className="w-2.5 h-2.5 fill-blood-600" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-5 pt-3 border-t border-surface-100 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                donor.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-600 font-medium">
              {donor.isAvailable ? 'Available Now' : 'Standby'}
            </span>
          </div>

          <button
            onClick={handleQuickRequest}
            disabled={!donor.isAvailable}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
              donor.isAvailable
                ? 'bg-blood-800 hover:bg-blood-900 text-white shadow-blood-800/20 hover:scale-102'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>Request Blood</span>
          </button>
        </div>
      </div>

      {/* Direct Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-surface-200">
              <div className="flex items-center space-x-2">
                <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                <h3 className="font-bold text-slate-900">Request Blood from {donor.name}</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendDirectMessage} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient or Requester Name
                </label>
                <input
                  type="text"
                  required
                  defaultValue={currentUser ? currentUser.name : ''}
                  placeholder="e.g. Maria Rodriguez"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blood-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Hospital, Delhi"
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blood-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Units Needed
                  </label>
                  <select
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blood-800"
                  >
                    <option value="1">1 Unit</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4+ Units</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency / Required Date
                </label>
                <select
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blood-800"
                >
                  <option value="immediate">Immediate / Emergency (within 2-4 hours)</option>
                  <option value="today">Today (within 12 hours)</option>
                  <option value="tomorrow">Tomorrow / Scheduled</option>
                </select>
              </div>

              <div className="bg-blood-50 p-3 rounded-xl border border-blood-100 text-xs text-blood-900">
                🔒 <strong>Privacy Assurance:</strong> Donors receive your hospital coordinates without exposing private home contacts.
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-md"
                >
                  Send Direct Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
