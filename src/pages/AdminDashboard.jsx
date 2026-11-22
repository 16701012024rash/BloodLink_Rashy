import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Droplet, Activity, CheckCircle2, AlertTriangle,
  Search, ShieldCheck, ShieldAlert, Building2, Check, X,
  TrendingUp, BarChart3, Archive, FileText, Eye, RefreshCw,
  Clock, Flag, Filter, ChevronDown, ChevronUp, Zap,
  ClipboardList, Database, Bell
} from 'lucide-react';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import { BLOOD_GROUPS, BLOOD_GROUP_STATS } from '../data/mockData';
import { inventoryService } from '../services/inventoryService';
import { adminService } from '../services/adminService';
import {
  BloodBadge, EmptyState, SkeletonCard, SkeletonTable,
  Spinner, Tabs, ConfirmDialog, LiveDot
} from '../components/ui/index.jsx';

// ── Utility helpers ──────────────────────────────────────────────
function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function UrgencyBadge({ value }) {
  const v = (value || '').toLowerCase();
  if (v.includes('critical') || v.includes('golden'))
    return <span className="badge badge-danger text-[10px]">🔴 Critical</span>;
  if (v.includes('6'))
    return <span className="badge badge-warning text-[10px]">🟡 6 hrs</span>;
  return <span className="badge badge-info text-[10px]">🟢 24 hrs</span>;
}

function StatusPill({ status }) {
  const s = (status || '').toLowerCase();
  const map = {
    pending: 'bg-amber-100 text-amber-800',
    'in progress': 'bg-blue-100 text-blue-800',
    'donor found': 'bg-blue-100 text-blue-800',
    matching: 'bg-indigo-100 text-indigo-800',
    fulfilled: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-slate-100 text-slate-600',
  };
  const cls = Object.entries(map).find(([k]) => s.includes(k))?.[1] || 'bg-slate-100 text-slate-600';
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cls}`}>{status}</span>;
}

// ── KPI Card ─────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-navy-900 leading-none mt-0.5">{value ?? '—'}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ── Main AdminDashboard ──────────────────────────────────────────
export const AdminDashboard = () => {
  const { donors, requests, stats, toggleDonorVerification, updateRequestStatus } = useBloodRequest();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview');
  const [donorSearch, setDonorSearch] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [donorFilterBlood, setDonorFilterBlood] = useState('All');
  const [requestFilterStatus, setRequestFilterStatus] = useState('All');
  const [bloodBanks, setBloodBanks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [adminKPIs, setAdminKPIs] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useEffect(() => {
    setLoadingData(true);
    Promise.all([
      inventoryService.getBloodBanks(),
      adminService.getAuditLogs(),
      adminService.getKPIs(),
    ]).then(([banks, logs, kpis]) => {
      if (banks) setBloodBanks(banks);
      if (logs) setAuditLogs(logs);
      if (kpis) setAdminKPIs(kpis);
    }).catch(err => {
      console.error('Admin data load error:', err);
    }).finally(() => {
      setLoadingData(false);
      setLastRefreshed(new Date());
    });
  }, []);

  const refreshData = async () => {
    setLoadingData(true);
    try {
      const [banks, logs, kpis] = await Promise.all([
        inventoryService.getBloodBanks(),
        adminService.getAuditLogs(),
        adminService.getKPIs(),
      ]);
      if (banks) setBloodBanks(banks);
      if (logs) setAuditLogs(logs);
      if (kpis) setAdminKPIs(kpis);
      setLastRefreshed(new Date());
      showToast('Dashboard refreshed', 'success');
    } catch {
      showToast('Failed to refresh data', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Filtered lists
  const filteredDonors = donors.filter(d => {
    const name = (d.name || d.full_name || '').toLowerCase();
    const city = (d.city || '').toLowerCase();
    const q = donorSearch.toLowerCase();
    const matchSearch = !q || name.includes(q) || city.includes(q);
    const matchBlood = donorFilterBlood === 'All' || d.bloodGroup === donorFilterBlood || d.blood_group === donorFilterBlood;
    return matchSearch && matchBlood;
  });

  const filteredRequests = requests.filter(r => {
    const q = requestSearch.toLowerCase();
    const matchSearch = !q ||
      (r.patientName || r.patient_name || '').toLowerCase().includes(q) ||
      (r.hospitalName || r.hospital_name || '').toLowerCase().includes(q) ||
      (r.id || '').toLowerCase().includes(q);
    const st = r.status || r.request_status || '';
    const matchStatus = requestFilterStatus === 'All' || st === requestFilterStatus;
    return matchSearch && matchStatus;
  });

  const tabDefs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'donors', label: `Donors (${donors.length})`, icon: Users },
    { id: 'requests', label: `Requests (${requests.length})`, icon: Droplet },
    { id: 'inventory', label: 'Blood Banks', icon: Building2 },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* ── Admin Header ── */}
      <div className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1.5 bg-blood-900/50 text-blood-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blood-700/50">
                  <ShieldCheck className="w-3 h-3" />
                  Admin Control Center
                </div>
                <div className="flex items-center gap-1 text-[11px] text-navy-400">
                  <LiveDot status="live" />
                  Live
                </div>
              </div>
              <h1 className="text-2xl font-black tracking-tight">BloodLink Operations Dashboard</h1>
              <p className="text-navy-400 text-xs mt-0.5">
                Last updated: {lastRefreshed.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={refreshData}
              disabled={loadingData}
              className="flex items-center gap-2 px-4 py-2 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── KPI Cards ── */}
        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon={Users}
              label="Total Donors"
              value={(adminKPIs?.totalDonors ?? stats.totalDonors).toLocaleString()}
              color="bg-blood-100 text-blood-700"
              sub={`${adminKPIs?.verifiedDonors ?? 0} verified`}
            />
            <KpiCard
              icon={Activity}
              label="Active Requests"
              value={adminKPIs?.activeRequests ?? stats.activeRequests}
              color="bg-amber-100 text-amber-700"
              sub="Awaiting matching"
            />
            <KpiCard
              icon={CheckCircle2}
              label="Fulfilled"
              value={(adminKPIs?.fulfilledRequests ?? stats.fulfilledRequests).toLocaleString()}
              color="bg-emerald-100 text-emerald-700"
              sub="All-time requests"
            />
            <KpiCard
              icon={Zap}
              label="Critical Cases"
              value={adminKPIs?.criticalCases ?? stats.criticalRequests ?? 0}
              color="bg-red-100 text-red-700"
              sub="Golden hour priority"
            />
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex overflow-x-auto gap-1 bg-white border border-surface-200 rounded-2xl p-1.5 shadow-sm">
          {tabDefs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-navy-900 hover:bg-surface-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Blood group distribution */}
                <div className="lg:col-span-7 card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-base">Blood Group Distribution</h3>
                      <p className="text-xs text-slate-500">Registered donor breakdown by blood type</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-blood-700" />
                  </div>
                  <div className="space-y-4">
                    {BLOOD_GROUP_STATS.map(item => (
                      <div key={item.group}>
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span className="flex items-center gap-2">
                            <BloodBadge group={item.group} size="sm" />
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({item.donors.toLocaleString()} registered)
                            </span>
                          </span>
                          <span className={`text-[11px] font-bold ${
                            item.availability === 'Critical' ? 'text-red-600' :
                            item.availability === 'Low' ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {item.percentage}% · {item.availability}
                          </span>
                        </div>
                        <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                            className={`h-full rounded-full ${
                              item.availability === 'Critical' ? 'bg-red-500' :
                              item.availability === 'Low' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform integrity panel */}
                <div className="lg:col-span-5 card p-6 flex flex-col gap-6">
                  <div>
                    <h3 className="font-extrabold text-navy-900 text-base mb-1">Platform Integrity</h3>
                    <p className="text-xs text-slate-500">Safety mechanisms active</p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-emerald-900">Hospital Verification Gateway</div>
                        <div className="text-[11px] text-emerald-700 mt-0.5">Ward coordinator tokens required for hospital requests.</div>
                      </div>
                    </div>
                    <div className="p-3.5 bg-blood-50 border border-blood-100 rounded-2xl flex items-start gap-3">
                      <Droplet className="w-5 h-5 text-blood-700 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-blood-900">56-Day Cooling-Off Enforcement</div>
                        <div className="text-[11px] text-blood-700 mt-0.5">Prevents double-booking whole blood donations.</div>
                      </div>
                    </div>
                    <div className="p-3.5 bg-surface-100 border border-surface-200 rounded-2xl flex items-start gap-3">
                      <Database className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">Row-Level Security</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">All Supabase queries scoped to authenticated user context.</div>
                      </div>
                    </div>
                    {adminKPIs?.pendingVerifications > 0 && (
                      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                        <Bell className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-900">
                            {adminKPIs.pendingVerifications} Pending Verifications
                          </div>
                          <div className="text-[11px] text-amber-700 mt-0.5">Review donor verification requests.</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="btn btn-primary w-full text-sm"
                    >
                      Review Active Requests
                    </button>
                  </div>
                </div>

                {/* Quick stats row */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Blood Banks', value: bloodBanks.length, icon: Building2, color: 'text-indigo-600 bg-indigo-50' },
                    { label: 'Pending Verifications', value: adminKPIs?.pendingVerifications ?? 0, icon: ShieldAlert, color: 'text-amber-600 bg-amber-50' },
                    { label: 'Audit Events', value: auditLogs.length, icon: ClipboardList, color: 'text-slate-600 bg-slate-100' },
                    { label: 'Verified Donors', value: adminKPIs?.verifiedDonors ?? 0, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
                  ].map(item => (
                    <div key={item.label} className="card p-4 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="font-black text-navy-900 text-lg leading-none">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DONORS TABLE ── */}
            {activeTab === 'donors' && (
              <div className="card p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-surface-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name or city…"
                        value={donorSearch}
                        onChange={e => setDonorSearch(e.target.value)}
                        className="input pl-9 w-full sm:w-56 text-sm"
                      />
                    </div>
                    <select
                      value={donorFilterBlood}
                      onChange={e => setDonorFilterBlood(e.target.value)}
                      className="input text-sm font-bold"
                    >
                      <option value="All">All Groups</option>
                      {BLOOD_GROUPS.filter(bg => bg !== 'All').map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    <strong className="text-navy-900">{filteredDonors.length}</strong> donors
                  </span>
                </div>

                {filteredDonors.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No donors found"
                    description="Try adjusting your search or filter criteria."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-surface-100 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-3 px-3">Donor</th>
                          <th className="py-3 px-3">Blood Type</th>
                          <th className="py-3 px-3">City</th>
                          <th className="py-3 px-3">Donations</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">Verification</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {filteredDonors.map(donor => (
                          <tr key={donor.id} className="hover:bg-surface-50 transition group">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center font-bold text-navy-700 text-xs shrink-0">
                                  {(donor.name || donor.full_name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-navy-900">{donor.name || donor.full_name}</div>
                                  <div className="text-[10px] text-slate-400">{donor.phone || '—'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <BloodBadge group={donor.bloodGroup || donor.blood_group} size="sm" />
                            </td>
                            <td className="py-3 px-3 text-slate-600">{donor.city || '—'}</td>
                            <td className="py-3 px-3 font-semibold text-navy-900">
                              {donor.totalDonations || 0}×
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {donor.isAvailable ? 'Available' : 'Standby'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {donor.isVerified ? (
                                <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-amber-600 font-bold text-[11px]">
                                  <AlertTriangle className="w-3.5 h-3.5" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setConfirmDialog({
                                  title: donor.isVerified ? 'Revoke Verification' : 'Verify Donor',
                                  message: donor.isVerified
                                    ? `Revoke verification for ${donor.name || donor.full_name}?`
                                    : `Verify ${donor.name || donor.full_name} as a trusted donor?`,
                                  variant: donor.isVerified ? 'danger' : 'primary',
                                  onConfirm: () => {
                                    toggleDonorVerification(donor.id);
                                    showToast(`Verification updated for ${donor.name || donor.full_name}`, 'success');
                                    setConfirmDialog(null);
                                  }
                                })}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition ${
                                  donor.isVerified
                                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                                    : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                {donor.isVerified ? 'Revoke' : 'Verify'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── REQUESTS TABLE ── */}
            {activeTab === 'requests' && (
              <div className="card p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-surface-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patient, hospital, ID…"
                        value={requestSearch}
                        onChange={e => setRequestSearch(e.target.value)}
                        className="input pl-9 w-full sm:w-64 text-sm"
                      />
                    </div>
                    <select
                      value={requestFilterStatus}
                      onChange={e => setRequestFilterStatus(e.target.value)}
                      className="input text-sm font-bold"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress - Donor Found">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">
                    <strong className="text-navy-900">{filteredRequests.length}</strong> requests
                  </span>
                </div>

                {filteredRequests.length === 0 ? (
                  <EmptyState
                    icon={Droplet}
                    title="No requests found"
                    description="Adjust your search or status filter."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-surface-100 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-3 px-3">Patient & ID</th>
                          <th className="py-3 px-3">Blood</th>
                          <th className="py-3 px-3">Hospital</th>
                          <th className="py-3 px-3">Units</th>
                          <th className="py-3 px-3">Priority</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {filteredRequests.map(req => (
                          <tr key={req.id} className="hover:bg-surface-50 transition">
                            <td className="py-3 px-3">
                              <div className="font-bold text-navy-900">{req.patientName || req.patient_name || '—'}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{req.id}</div>
                            </td>
                            <td className="py-3 px-3">
                              <BloodBadge group={req.bloodGroup || req.blood_group} size="sm" />
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">{req.hospitalName || req.hospital_name || '—'}</div>
                              <div className="text-[10px] text-slate-400">{req.city || '—'}</div>
                            </td>
                            <td className="py-3 px-3 font-bold text-blood-700">
                              {req.unitsRequired || req.units_required || 1}u
                            </td>
                            <td className="py-3 px-3">
                              <UrgencyBadge value={req.priority || req.urgency_level} />
                            </td>
                            <td className="py-3 px-3">
                              <StatusPill status={req.status || req.request_status} />
                            </td>
                            <td className="py-3 px-3 text-right space-x-1">
                              {req.status !== 'Completed' && req.request_status !== 'Fulfilled' && (
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Mark Request Completed',
                                    message: `Mark request for "${req.patientName || req.patient_name}" as completed?`,
                                    variant: 'primary',
                                    onConfirm: () => {
                                      updateRequestStatus(req.id, 'Completed');
                                      showToast(`Request ${req.id} marked completed`, 'success');
                                      setConfirmDialog(null);
                                    }
                                  })}
                                  className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition"
                                >
                                  Complete
                                </button>
                              )}
                              {req.status !== 'Cancelled' && req.request_status !== 'Cancelled' && (
                                <button
                                  onClick={() => setConfirmDialog({
                                    title: 'Flag & Cancel Request',
                                    message: `Cancel request ${req.id}? This action will notify the requester.`,
                                    variant: 'danger',
                                    onConfirm: () => {
                                      updateRequestStatus(req.id, 'Cancelled');
                                      showToast(`Request ${req.id} cancelled`, 'info');
                                      setConfirmDialog(null);
                                    }
                                  })}
                                  className="px-2.5 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── BLOOD BANKS ── */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-lg">Regional Blood Bank Network</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {bloodBanks.length} verified repositories with live inventory synchronization
                      </p>
                    </div>
                    <button
                      onClick={() => showToast('Blood bank registration is managed via the admin portal.', 'info')}
                      className="btn btn-primary text-xs"
                    >
                      + Add Bank
                    </button>
                  </div>

                  {bloodBanks.length === 0 ? (
                    <EmptyState
                      icon={Building2}
                      title="No blood banks registered"
                      description="Register verified blood banks to appear here."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bloodBanks.map(bank => (
                        <motion.div
                          key={bank.id}
                          whileHover={{ y: -2 }}
                          className="p-4 rounded-2xl border border-surface-200 bg-surface-50 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-navy-900 text-sm leading-tight">{bank.name}</h4>
                            <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {bank.verification_status || 'Verified'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{bank.address}, {bank.city}</p>
                          {bank.contact_information && (
                            <p className="text-xs text-slate-500 font-mono">📞 {bank.contact_information}</p>
                          )}
                          <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-surface-100">
                            <span>{bank.operating_hours || '24×7'}</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                              <LiveDot status="live" /> Live Synced
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── AUDIT LOGS ── */}
            {activeTab === 'audit' && (
              <div className="card p-6 space-y-5">
                <div>
                  <h3 className="font-extrabold text-navy-900 text-lg">Regulatory Compliance & Audit Trail</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immutable trace of admin actions, verification reviews and emergency dispatch events.
                  </p>
                </div>

                {auditLogs.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No audit events yet"
                    description="Admin actions will appear here as an immutable log."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-surface-100 text-slate-400 font-bold uppercase text-[10px]">
                          <th className="py-3 px-3">When</th>
                          <th className="py-3 px-3">Action</th>
                          <th className="py-3 px-3">Resource</th>
                          <th className="py-3 px-3">Actor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-50">
                        {auditLogs.map((log, i) => (
                          <tr key={log.id || i} className="hover:bg-surface-50 transition">
                            <td className="py-3 px-3">
                              <div className="text-slate-500 font-mono text-[10px]">
                                {log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent'}
                              </div>
                              <div className="text-[10px] text-slate-400">{timeAgo(log.created_at)}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-navy-100 text-navy-800 font-mono text-[10px] font-bold">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              <span className="font-semibold">{log.resource_type}</span>
                              <span className="text-slate-400 font-mono ml-1 text-[10px]">{log.resource_id}</span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">
                                {log.actor?.full_name || 'System / Admin Officer'}
                              </div>
                              {log.actor?.email && (
                                <div className="text-[10px] text-slate-400">{log.actor.email}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Confirm Dialog ── */}
      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title || ''}
        message={confirmDialog?.message || ''}
        variant={confirmDialog?.variant || 'danger'}
        onConfirm={confirmDialog?.onConfirm || (() => {})}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
};
