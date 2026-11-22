import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Grid3X3, Map, Sliders, X, RefreshCw, Users, Droplet } from 'lucide-react';
import { useBloodRequest } from '../context/BloodRequestContext';
import { DonorCard } from '../components/cards/DonorCard';
import { BloodMap } from '../components/common/BloodMap';
import { BLOOD_GROUPS, CITIES } from '../data/mockData';
import { EmptyState, SkeletonCard, Tabs } from '../components/ui/index.jsx';

const RADII = [10, 25, 50, 100];

export const FindDonorsPage = () => {
  const [params] = useSearchParams();
  const { searchDonors, donors } = useBloodRequest();

  const [bloodGroup, setBloodGroup] = useState(params.get('blood') || '');
  const [city, setCity] = useState(params.get('city') || '');
  const [availOnly, setAvailOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [radius, setRadius] = useState(50);
  const [query, setQuery] = useState(params.get('q') || '');
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const runSearch = useCallback(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let res = searchDonors({ bloodGroup, city, availabilityOnly: availOnly, searchQuery: query });
      if (verifiedOnly) res = res.filter(d => d.isVerified || d.verification_status === 'verified');
      setResults(res);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [bloodGroup, city, availOnly, verifiedOnly, query, searchDonors]);

  useEffect(runSearch, [runSearch]);

  const clearFilters = () => {
    setBloodGroup(''); setCity(''); setAvailOnly(false); setVerifiedOnly(false); setQuery('');
  };

  const hasFilters = bloodGroup || city || availOnly || verifiedOnly || query;

  const viewTabs = [
    { id: 'grid', label: 'Grid', icon: Grid3X3 },
    { id: 'map',  label: 'Map',  icon: Map },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Page Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="container-app py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 badge badge-blood mb-2">
                <Droplet className="w-3.5 h-3.5" />Donor Discovery
              </span>
              <h1 className="text-2xl font-bold text-surface-900">Find Blood Donors</h1>
              <p className="text-sm text-surface-500 mt-0.5">
                {loading ? 'Searching...' : `${results.length} verified donor${results.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <Tabs tabs={viewTabs} active={view} onChange={setView} variant="pill" />
          </div>

          {/* Search bar */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input type="text" placeholder="Search donors by name, city, or blood group..."
                value={query} onChange={e => setQuery(e.target.value)}
                className="input pl-10 w-full" />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-300 hover:text-surface-600 transition">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-md flex-shrink-0 ${showFilters ? 'btn-primary' : 'btn-secondary'}`}>
              <Sliders className="w-4 h-4" />Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-blood-500" />}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden">
                <div className="bg-surface-50 rounded-xl border border-surface-200 p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Blood group */}
                    <div>
                      <label className="label text-xs">Blood Group</label>
                      <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="select text-sm">
                        <option value="">All Groups</option>
                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    {/* City */}
                    <div>
                      <label className="label text-xs">City</label>
                      <select value={city} onChange={e => setCity(e.target.value)} className="select text-sm">
                        {CITIES.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
                      </select>
                    </div>
                    {/* Radius */}
                    <div>
                      <label className="label text-xs">Search Radius</label>
                      <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="select text-sm">
                        {RADII.map(r => <option key={r} value={r}>{r} km</option>)}
                      </select>
                    </div>
                    {/* Toggles */}
                    <div className="flex flex-col gap-3 justify-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={availOnly} onChange={e => setAvailOnly(e.target.checked)} className="rounded border-surface-300 text-blood-700 focus:ring-blood-700" />
                        <span className="text-sm font-medium text-surface-700">Available only</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="rounded border-surface-300 text-blood-700 focus:ring-blood-700" />
                        <span className="text-sm font-medium text-surface-700">Verified only</span>
                      </label>
                    </div>
                  </div>
                  {hasFilters && (
                    <button onClick={clearFilters} className="mt-3 btn btn-sm btn-ghost text-blood-700 text-xs">
                      <X className="w-3.5 h-3.5" />Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-6">
        {view === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100vh-280px)] min-h-[500px]">
            {/* Donor list (left) */}
            <div className="lg:col-span-2 space-y-3 overflow-y-auto pr-1 max-h-full">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : results.length === 0 ? (
                <EmptyState icon={Users} title="No compatible donors found"
                  description="Try adjusting your blood group, city or availability filters." />
              ) : (
                results.map(d => (
                  <DonorCard key={d.id} donor={d} selected={selected?.id === d.id}
                    onSelect={setSelected} className="text-sm" />
                ))
              )}
            </div>
            {/* Map (right) */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-surface-200 shadow-card">
              <BloodMap donors={results} selectedDonor={selected} onSelectDonor={setSelected} />
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : results.length === 0 ? (
              <EmptyState icon={Users} title="No compatible donors found in this area"
                description={hasFilters ? "Try adjusting your filters — different blood group, city or remove the availability constraint." : "No donors are registered yet. Be the first to join our network!"}
                action={<a href="/register" className="btn btn-md btn-primary">Become a Donor</a>} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {results.map(d => (
                    <DonorCard key={d.id} donor={d} selected={selected?.id === d.id} onSelect={setSelected} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindDonorsPage;
