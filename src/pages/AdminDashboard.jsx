import React, { useState } from 'react';
import { 
  Users, 
  Droplet, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Filter, 
  Building2, 
  Flag, 
  Check, 
  X,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import { BLOOD_GROUPS, BLOOD_GROUP_STATS } from '../data/mockData';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';
import { StatusBadge } from '../components/common/StatusBadge';

export const AdminDashboard = () => {
  const { donors, requests, stats, toggleDonorVerification, updateRequestStatus } = useBloodRequest();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'donors', 'requests'
  const [donorSearch, setDonorSearch] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [donorFilterBlood, setDonorFilterBlood] = useState('All');
  const [requestFilterStatus, setRequestFilterStatus] = useState('All');

  // Filtered donors
  const filteredDonors = donors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(donorSearch.toLowerCase()) || 
                          d.city.toLowerCase().includes(donorSearch.toLowerCase());
    const matchesBlood = donorFilterBlood === 'All' || d.bloodGroup === donorFilterBlood;
    return matchesSearch && matchesBlood;
  });

  // Filtered requests
  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.patientName.toLowerCase().includes(requestSearch.toLowerCase()) || 
                          r.hospitalName.toLowerCase().includes(requestSearch.toLowerCase()) ||
                          r.id.toLowerCase().includes(requestSearch.toLowerCase());
    const matchesStatus = requestFilterStatus === 'All' || r.status === requestFilterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blood-100 text-blood-900 text-[11px] font-bold px-3 py-1 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blood-700" />
              <span>National Operations & Verification Desk</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Administrative Control Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor real-time blood requests, audit voluntary donors, and prevent fraudulent requests.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white p-1 rounded-2xl border border-surface-200 shadow-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'overview'
                  ? 'bg-blood-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blood-800'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setActiveTab('donors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'donors'
                  ? 'bg-blood-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blood-800'
              }`}
            >
              Donor Management ({donors.length})
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'requests'
                  ? 'bg-blood-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blood-800'
              }`}
            >
              Request Management ({requests.length})
            </button>
          </div>
        </div>

        {/* 4 HIGH LEVEL KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blood-50 text-blood-800 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Donors
              </span>
              <span className="text-2xl font-black text-slate-900">
                {stats.totalDonors.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Requests
              </span>
              <span className="text-2xl font-black text-amber-600">
                {stats.activeRequests}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Fulfilled Requests
              </span>
              <span className="text-2xl font-black text-emerald-700">
                {stats.fulfilledRequests.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Critical Priority
              </span>
              <span className="text-2xl font-black text-red-600">
                {stats.criticalRequests}
              </span>
            </div>
          </div>
        </div>

        {/* TAB 1: SYSTEM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Blood Group Distribution Chart */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Blood Group Availability & Inventory Index
                  </h3>
                  <p className="text-xs text-slate-500">Live readiness across regional blood banks</p>
                </div>
                <BarChart3 className="w-5 h-5 text-blood-800" />
              </div>

              <div className="space-y-3.5">
                {BLOOD_GROUP_STATS.map(item => (
                  <div key={item.group} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center space-x-2">
                        <span className="w-6 text-blood-900">{item.group}</span>
                        <span className="text-[11px] text-slate-400 font-normal">({item.donors.toLocaleString()} registered)</span>
                      </span>
                      <span>{item.percentage}% Available</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.availability === 'Critical'
                            ? 'bg-red-500'
                            : item.availability === 'Low'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Status & Security Audit */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1">
                  Community Integrity & Compliance
                </h3>
                <p className="text-xs text-slate-500 mb-6">Automated fraud prevention engine.</p>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-emerald-900">Hospital Verification Gateway</div>
                      <div className="text-emerald-700 text-[11px] mt-0.5">
                        All requests from registered hospitals require ward coordinator token verification.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-blood-50 rounded-2xl border border-blood-100 flex items-start space-x-3">
                    <Droplet className="w-5 h-5 text-blood-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-blood-900">Cooling-Off Donation Safety Check</div>
                      <div className="text-blood-700 text-[11px] mt-0.5">
                        Donors are prevented from double-booking whole blood donations within 90 days.
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-surface-100 rounded-2xl border border-surface-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-900">98.6% Transfusion Fulfillment Rate</div>
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        Average response window for critical emergency alerts is 4.2 minutes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-surface-100">
                <button
                  onClick={() => setActiveTab('requests')}
                  className="w-full py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition"
                >
                  Review Pending Emergency Requests
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DONOR MANAGEMENT TABLE */}
        {activeTab === 'donors' && (
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-surface-200">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search donor name or city..."
                  value={donorSearch}
                  onChange={(e) => setDonorSearch(e.target.value)}
                  className="text-xs px-3.5 py-2.5 bg-surface-50 rounded-xl border border-slate-200 w-full sm:w-64"
                />
                <select
                  value={donorFilterBlood}
                  onChange={(e) => setDonorFilterBlood(e.target.value)}
                  className="text-xs px-3 py-2.5 bg-surface-50 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="All">All Groups</option>
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-500">
                Showing <strong>{filteredDonors.length}</strong> registered donors
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Donor Name</th>
                    <th className="py-3 px-3">Blood Type</th>
                    <th className="py-3 px-3">City</th>
                    <th className="py-3 px-3">Donations</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Verification</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredDonors.map(donor => (
                    <tr key={donor.id} className="hover:bg-blood-50/40 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={donor.avatar}
                            alt={donor.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{donor.name}</div>
                            <div className="text-[10px] text-slate-400">{donor.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <BloodGroupBadge group={donor.bloodGroup} size="sm" />
                      </td>
                      <td className="py-3 px-3 text-slate-700">{donor.city}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{donor.totalDonations} Times</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          donor.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {donor.isAvailable ? 'Available' : 'Standby'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {donor.isVerified ? (
                          <span className="text-emerald-700 font-bold flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="text-amber-600 font-bold flex items-center space-x-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Unverified</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            toggleDonorVerification(donor.id);
                            showToast(`Verification status updated for ${donor.name}`, 'info');
                          }}
                          className="px-3 py-1 rounded-full border border-slate-300 hover:bg-blood-50 text-[11px] font-bold text-slate-700"
                        >
                          {donor.isVerified ? 'Revoke Verification' : 'Verify Donor'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REQUEST MANAGEMENT TABLE */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-surface-200">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search patient, hospital, or ID..."
                  value={requestSearch}
                  onChange={(e) => setRequestSearch(e.target.value)}
                  className="text-xs px-3.5 py-2.5 bg-surface-50 rounded-xl border border-slate-200 w-full sm:w-64"
                />
                <select
                  value={requestFilterStatus}
                  onChange={(e) => setRequestFilterStatus(e.target.value)}
                  className="text-xs px-3 py-2.5 bg-surface-50 rounded-xl border border-slate-200 font-bold"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress - Donor Found">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <span className="text-xs text-slate-500">
                Showing <strong>{filteredRequests.length}</strong> blood requests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-surface-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-3 px-3">Req ID & Patient</th>
                    <th className="py-3 px-3">Blood Group</th>
                    <th className="py-3 px-3">Hospital & City</th>
                    <th className="py-3 px-3">Units</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-blood-50/40 transition">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{req.patientName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <BloodGroupBadge group={req.bloodGroup} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{req.hospitalName}</div>
                        <div className="text-[10px] text-slate-500">{req.city}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-blood-800">{req.unitsRequired} Units</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-3 px-3 text-right space-x-1">
                        {req.status !== 'Completed' && (
                          <button
                            onClick={() => {
                              updateRequestStatus(req.id, 'Completed');
                              showToast(`Request ${req.id} marked as completed`, 'success');
                            }}
                            className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            title="Approve / Mark Fulfilled"
                          >
                            Mark Completed
                          </button>
                        )}
                        {req.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              updateRequestStatus(req.id, 'Cancelled');
                              showToast(`Request ${req.id} flagged & cancelled`, 'info');
                            }}
                            className="px-2.5 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[10px] font-bold"
                            title="Flag suspicious request"
                          >
                            Flag / Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
