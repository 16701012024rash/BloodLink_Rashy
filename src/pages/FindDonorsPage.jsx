import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, MapPin, Users, ShieldCheck, Heart, AlertCircle, Droplets, Info } from 'lucide-react';
import { BLOOD_GROUPS, CITIES, BLOOD_COMPATIBILITY } from '../data/mockData';
import { useBloodRequest } from '../context/BloodRequestContext';
import { DonorCard } from '../components/cards/DonorCard';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';

export const FindDonorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { donors, searchDonors } = useBloodRequest();

  // Filters state initialized from URL query params
  const [selectedBlood, setSelectedBlood] = useState(searchParams.get('blood') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [availabilityOnly, setAvailabilityOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [compatibilityModal, setCompatibilityModal] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const blood = searchParams.get('blood');
    const city = searchParams.get('city');
    const q = searchParams.get('q');
    if (blood) setSelectedBlood(blood);
    if (city) setSelectedCity(city);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Compute filtered donor results
  const filteredDonors = searchDonors({
    bloodGroup: selectedBlood,
    city: selectedCity,
    availabilityOnly,
    searchQuery
  });

  const handleResetFilters = () => {
    setSelectedBlood('All');
    setSelectedCity('All Cities');
    setAvailabilityOnly(false);
    setSearchQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-surface-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-surface-200">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blood-50 text-blood-800 text-xs font-bold px-3 py-1 rounded-full border border-blood-100 mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Verified Lifesaver Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Find Blood Donors
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Connect directly with verified, ready donors across cities. No middlemen, no delayed responses in critical emergencies.
            </p>
          </div>

          {/* Quick Compatibility Guide Button */}
          <button
            onClick={() => setCompatibilityModal(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-blood-800 bg-white hover:bg-blood-50 border border-blood-300 px-4 py-2.5 rounded-full transition shadow-xs shrink-0"
          >
            <Info className="w-4 h-4 text-blood-700" />
            <span>Blood Compatibility Guide</span>
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Blood Group Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Blood Group
              </label>
              <div className="relative">
                <select
                  value={selectedBlood}
                  onChange={(e) => setSelectedBlood(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-3 bg-surface-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blood-800 appearance-none text-slate-800"
                >
                  <option value="All">All Blood Types</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* City / Location Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                City / Location
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-semibold px-4 py-3 bg-surface-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blood-800 appearance-none text-slate-800"
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Text Search Query */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Search Name or Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Amit, Delhi, O-..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs px-4 py-3 bg-surface-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-blood-800 text-slate-800"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {}}
                className="flex-1 bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold py-3 px-4 rounded-2xl transition shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Filter className="w-4 h-4" />
                <span>Filter Donors</span>
              </button>

              <button
                onClick={handleResetFilters}
                className="p-3 rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick Filter Badges row */}
          <div className="mt-5 pt-4 border-t border-surface-100 flex flex-wrap items-center justify-between gap-4">
            {/* Quick blood pills */}
            <div className="flex items-center flex-wrap gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Quick Select:</span>
              {['All', ...BLOOD_GROUPS].map(bg => (
                <button
                  key={bg}
                  onClick={() => setSelectedBlood(bg)}
                  className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                    selectedBlood === bg
                      ? 'bg-blood-800 text-white shadow-xs'
                      : 'bg-surface-100 text-slate-600 hover:bg-blood-100 hover:text-blood-800'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 text-blood-800 rounded border-slate-300 focus:ring-blood-500"
              />
              <span>Show Available Donors Only</span>
            </label>
          </div>
        </div>

        {/* RESULTS HEADER & COUNTER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-slate-800">
              Showing <strong className="text-blood-800">{filteredDonors.length}</strong> matching donors
            </span>
            {selectedBlood !== 'All' && (
              <span className="bg-blood-100 text-blood-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Group {selectedBlood}
              </span>
            )}
            {selectedCity !== 'All Cities' && (
              <span className="bg-slate-200 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {selectedCity}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            ⚡ Donors updated in real-time
          </div>
        </div>

        {/* DONORS GRID */}
        {filteredDonors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonors.map(donor => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-blood-50 text-blood-700 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              No matching donors found
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We couldn't find any donors matching your specific criteria right now. Try clearing filters or submit an emergency request to broadcast an alert.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition"
              >
                Clear Filters
              </button>
              <a
                href="/emergency-request"
                className="px-5 py-2 bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold rounded-full transition shadow-sm"
              >
                Broadcast Emergency Request
              </a>
            </div>
          </div>
        )}

      </div>

      {/* COMPATIBILITY GUIDE MODAL */}
      {compatibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-surface-200">
              <div className="flex items-center space-x-2">
                <Droplets className="w-6 h-6 text-blood-800" />
                <h3 className="text-lg font-bold text-slate-900">
                  Blood Group Compatibility Chart
                </h3>
              </div>
              <button
                onClick={() => setCompatibilityModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-blood-50 rounded-2xl border border-blood-100 text-slate-700">
                💡 <strong>Universal Lifesavers:</strong> Type <strong>O-</strong> is the universal donor for red blood cells and can be given to all blood types in emergencies. Type <strong>AB+</strong> is the universal recipient.
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-surface-200 text-slate-500 uppercase text-[10px] font-bold">
                      <th className="py-2.5 px-3">Blood Group</th>
                      <th className="py-2.5 px-3">Can Receive From</th>
                      <th className="py-2.5 px-3">Can Donate To</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {Object.entries(BLOOD_COMPATIBILITY).map(([group, comp]) => (
                      <tr key={group} className="hover:bg-blood-50/50">
                        <td className="py-2.5 px-3 font-bold text-blood-900">
                          <BloodGroupBadge group={group} size="sm" />
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {comp.canReceiveFrom.join(', ')}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {comp.canDonateTo.join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-200 flex justify-end">
              <button
                onClick={() => setCompatibilityModal(false)}
                className="px-6 py-2 rounded-full bg-blood-800 text-white font-bold text-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
