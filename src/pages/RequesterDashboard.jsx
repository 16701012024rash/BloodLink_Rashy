import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Droplet, 
  Activity, 
  HeartPulse, 
  Building2, 
  User, 
  Phone, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Send,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { StatCard } from '../components/cards/StatCard';
import { TimelineTracker } from '../components/common/TimelineTracker';
import { RequestCard } from '../components/cards/RequestCard';

export const RequesterDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { requests, cancelRequest } = useBloodRequest();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('requests'); // Highlight 'Blood Requests' as shown in Screenshot 3
  const [showDoctorContactModal, setShowDoctorContactModal] = useState(false);
  const [showDonorContactModal, setShowDonorContactModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Active / current request matching Screenshot 3
  const currentRequest = requests.find(r => r.patientName.includes('Maria') && r.status.includes('In Progress')) || requests[0];

  // Treatment Journey Milestones matching Screenshot 3
  const treatmentJourneyMilestones = [
    { title: 'First Transfusion', date: '01 Sep 2026' },
    { title: 'Last Transfusion', date: '12 Oct 2026' },
    { title: 'Next Treatment Phase', date: 'Nov 2026' }
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar matching Screenshot 3 */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          
          {/* Header row: Welcome Back, Maria! (A+) + New Request CTA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-surface-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Patient & Requester Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back, <span className="text-blood-800">{currentUser?.name || 'Maria'}!</span>{' '}
                <span className="text-blood-800">({currentUser?.bloodGroup || 'A+'})</span>
              </h1>
            </div>

            <Link
              to="/emergency-request"
              className="flex items-center space-x-2 bg-blood-800 hover:bg-blood-900 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Request</span>
            </Link>
          </div>

          {/* 4 QUICK STAT CARDS (Screenshot 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Blood Received"
              value={currentUser?.bloodReceivedDate || '12 Oct 2026'}
            />
            <StatCard
              icon={Droplet}
              label="Total Transfusions"
              value={`${currentUser?.totalTransfusions || 3} Times`}
            />
            <StatCard
              icon={HeartPulse}
              label="Health Progress"
              value={currentUser?.healthProgress || 'Improving'}
              highlight
              badgeText="Stable"
            />
            <StatCard
              icon={Clock}
              label="Next Scheduled Checkup"
              value={currentUser?.nextScheduledCheckup || '15 Nov 2026'}
            />
          </div>

          {/* TWO MIDDLE CARDS (Screenshot 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Current Request Status */}
            <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Current Request Status
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                    Active
                  </span>
                </div>

                {currentRequest ? (
                  <div className="space-y-3">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Request by:</span>
                        <span className="font-bold text-slate-900">{currentRequest.hospitalName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Needed:</span>
                        <span className="font-bold text-blood-800">{currentRequest.unitsRequired} Units ({currentRequest.bloodGroup})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <span className="font-semibold text-emerald-700">{currentRequest.status}</span>
                      </div>
                    </div>

                    {/* Progress Bar from Screenshot 3 */}
                    <div className="pt-2">
                      <div className="w-full h-2.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${currentRequest.progressPercent || 75}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Matched</span>
                        <span>Screened</span>
                        <span>Cross-Match Ready</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No active request.</p>
                )}
              </div>

              {/* Action Buttons matching Screenshot 3 */}
              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-surface-100">
                <button
                  onClick={() => setShowDonorContactModal(true)}
                  className="flex-1 py-2.5 px-4 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
                >
                  Contact Donor
                </button>
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="flex-1 py-2.5 px-4 rounded-full border border-blood-800 text-blood-800 hover:bg-blood-50 text-xs font-bold transition"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Card 2: My Requests History (Screenshot 3) */}
            <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base">
                    My Requests History
                  </h3>
                  <span className="text-xs text-slate-400">Past transfusions</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50 border border-surface-100">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        12 Oct 2026: City Hospital - 2 Units (A+)
                      </span>
                      <span className="text-[10px] text-slate-500">Matched by Amit Kumar</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50 border border-surface-100">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        15 Sep 2026: St. Mary's - 1 Unit (A+)
                      </span>
                      <span className="text-[10px] text-slate-500">Direct donor match</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* View All Requests Button matching Screenshot 3 */}
              <div className="mt-6 pt-4 border-t border-surface-100 flex justify-end">
                <button
                  onClick={() => setActiveTab('history')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
                >
                  View All Requests
                </button>
              </div>
            </div>

          </div>

          {/* LOWER ROW: My Treatment Journey & Care Team (Screenshot 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Card: My Treatment Journey (Timeline) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="border-b border-surface-100 pb-3 mb-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  My Treatment Journey
                </h3>
                <p className="text-xs text-slate-500">
                  Transfusion roadmap and next clinical treatment phase.
                </p>
              </div>

              {/* Horizontal Timeline Tracker matching Screenshot 3 */}
              <TimelineTracker milestones={treatmentJourneyMilestones} />
            </div>

            {/* Right Card: Care Team & Contact (Screenshot 3) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
              <div className="border-b border-surface-100 pb-3 mb-4">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Care Team & Contact
                </h3>
                <p className="text-xs text-slate-500">
                  Assigned hospital coordinator.
                </p>
              </div>

              <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-surface-50 border border-surface-100">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                  alt="Dr. A. Khan"
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-blood-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Dr. A. Khan</h4>
                  <p className="text-[11px] text-slate-500">Primary Doctor & Hematologist</p>
                  <p className="text-[10px] text-blood-800 font-semibold mt-0.5">City Hospital ICU</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-surface-100">
                <button
                  onClick={() => setShowDoctorContactModal(true)}
                  className="w-full py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
                >
                  Contact Care Team
                </button>
              </div>
            </div>

          </div>

          {/* Full Requests Tab View */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4">
                All Blood Requests Log
              </h3>
              <div className="space-y-4">
                {requests.map(req => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    role="requester"
                    onCancel={(id) => {
                      cancelRequest(id);
                      showToast('Request cancelled successfully', 'info');
                    }}
                    onViewDetails={() => setShowDetailsModal(true)}
                  />
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Doctor Contact Modal */}
      {showDoctorContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 text-center">
            <h3 className="font-bold text-slate-900 text-base mb-2">Connect with Dr. A. Khan</h3>
            <p className="text-xs text-slate-500 mb-4">Primary Hematology Care Coordinator</p>
            <div className="bg-surface-50 p-3 rounded-2xl text-xs space-y-2 text-left mb-4">
              <p>📞 <strong>Hospital Hotline:</strong> +91 11 2658 8500 (Ext. 402)</p>
              <p>🏥 <strong>Office:</strong> Ward 302, City Hospital, New Delhi</p>
              <p>⏱ <strong>Duty Hours:</strong> 09:00 AM - 05:00 PM</p>
            </div>
            <button
              onClick={() => {
                setShowDoctorContactModal(false);
                showToast('Connecting call to Dr. Khan...', 'info');
              }}
              className="w-full py-2.5 rounded-full bg-blood-800 text-white text-xs font-bold"
            >
              Call Desk Now
            </button>
          </div>
        </div>
      )}

      {/* Donor Contact Modal */}
      {showDonorContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 text-center">
            <h3 className="font-bold text-slate-900 text-base mb-1">Matched Donor Information</h3>
            <p className="text-xs text-slate-500 mb-4">Amit Kumar (O+ Universal Donor)</p>
            <div className="bg-blood-50 p-4 rounded-2xl text-xs space-y-2 text-left mb-4 border border-blood-100">
              <p>👤 <strong>Donor:</strong> Amit Kumar</p>
              <p>📞 <strong>Phone:</strong> +91 98765 43210</p>
              <p>📍 <strong>Status:</strong> Ready at Red Cross Delhi donor station</p>
            </div>
            <button
              onClick={() => {
                setShowDonorContactModal(false);
                showToast('SMS alert sent to donor coordinator', 'success');
              }}
              className="w-full py-2.5 rounded-full bg-blood-800 text-white text-xs font-bold"
            >
              Notify Arrival at Hospital
            </button>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && currentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-surface-200">
              <h3 className="font-bold text-slate-900">Request {currentRequest.id} Details</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="my-4 text-xs space-y-2.5">
              <div className="flex justify-between"><span className="text-slate-500">Hospital:</span><span className="font-bold">{currentRequest.hospitalName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Address:</span><span>{currentRequest.hospitalAddress}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Room / Ward:</span><span>{currentRequest.roomNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Units Needed:</span><span className="font-bold text-blood-800">{currentRequest.unitsRequired} Units ({currentRequest.bloodGroup})</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-700">{currentRequest.status}</span></div>
              <div className="p-3 bg-surface-50 rounded-xl mt-2 text-slate-600">
                <strong>Medical Notes:</strong> {currentRequest.notes}
              </div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full py-2.5 rounded-full bg-blood-800 text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
