import React, { useState } from 'react';
import { 
  Calendar, 
  Droplet, 
  Heart, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  ArrowRight,
  Shield,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import { DashboardSidebar } from '../components/layout/DashboardSidebar';
import { StatCard } from '../components/cards/StatCard';
import { ImpactBadge } from '../components/common/ImpactBadge';
import { TimelineTracker } from '../components/common/TimelineTracker';
import { RequestCard } from '../components/cards/RequestCard';

export const DonorDashboard = () => {
  const { currentUser, toggleAvailability } = useAuth();
  const { requests, appointments, acceptRequest, rescheduleAppointment } = useBloodRequest();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);

  // Active appointment
  const currentApt = appointments[0] || {
    title: 'Booking for blood donation appointment',
    center: 'Red Cross Delhi',
    address: '1 Red Cross Road, New Delhi',
    date: '25 Nov 2026',
    time: '10:00 AM'
  };

  // Nearby urgent request matching O+ or universal
  const urgentRequest = requests.find(r => r.status === 'Pending' || r.id === 'REQ-2026-881') || requests[0];

  // Donation Journey Milestones matching Screenshot 2
  const donationJourneyMilestones = [
    { title: 'Successfully Donated', date: '13 Apr 2026' },
    { title: 'Blood Camp Drive', date: '12 Sep 2026' },
    { title: 'Successfully Donated', date: '12 Oct 2026' },
    { title: 'Next Scheduled Slot', date: '25 Nov 2026' }
  ];

  const handleDonateNow = () => {
    if (urgentRequest && currentUser) {
      acceptRequest(urgentRequest.id, currentUser);
      showToast(`You accepted the request from ${urgentRequest.hospitalName}! Coordinator alerted.`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar matching Screenshot 2 */}
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          
          {/* Header row: Welcome Back, Amit! (O+) + Availability Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-surface-200">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Donor Command Center
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back, <span className="text-blood-800">{currentUser?.name || 'Amit'}!</span>{' '}
                <span className="text-blood-800">({currentUser?.bloodGroup || 'O+'})</span>
              </h1>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-3 bg-surface-50 p-2.5 rounded-2xl border border-surface-200 self-start sm:self-auto">
              <span className="text-xs font-bold text-slate-700">
                {currentUser?.isAvailable ? 'Available to Donate' : 'Temporarily Unavailable'}
              </span>
              <button
                onClick={toggleAvailability}
                className="text-blood-800 hover:text-blood-900 transition"
                title="Toggle donor availability"
              >
                {currentUser?.isAvailable ? (
                  <div className="w-12 h-6 bg-emerald-600 rounded-full flex items-center p-1 transition cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white ml-auto shadow-sm" />
                  </div>
                ) : (
                  <div className="w-12 h-6 bg-slate-300 rounded-full flex items-center p-1 transition cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Conditional View based on active Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* 4 QUICK STAT CARDS (Screenshot 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                  icon={Calendar}
                  label="Last Donated"
                  value={currentUser?.lastDonated || '12 Oct 2026'}
                />
                <StatCard
                  icon={Droplet}
                  label="Total Donations"
                  value={`${currentUser?.totalDonations || 4} Times`}
                />
                <StatCard
                  icon={Heart}
                  label="Lives Impacted"
                  value={`${currentUser?.livesImpacted || 12} Lives`}
                  highlight
                />
                <StatCard
                  icon={CheckCircle2}
                  label="Next Eligible Date"
                  value={currentUser?.nextEligibleDate || 'Eligible Now!'}
                  badgeText="Ready"
                />
              </div>

              {/* TWO MEDIUM CARDS (Screenshot 2) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Card 1: Upcoming Donation Appointment */}
                <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Upcoming Donation Appointment
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blood-100 text-blood-800">
                        {currentApt.status || 'Confirmed'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                      {currentApt.title}
                    </p>

                    <div className="space-y-2.5 text-xs text-slate-700 bg-surface-50 p-4 rounded-2xl border border-surface-100">
                      <div className="flex items-center space-x-2 font-bold text-slate-900">
                        <Building2 className="w-4 h-4 text-blood-700 shrink-0" />
                        <span>{currentApt.center}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="w-4 h-4 text-blood-700 shrink-0" />
                        <span>{currentApt.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 font-semibold text-blood-800">
                        <Clock className="w-4 h-4 text-blood-700 shrink-0" />
                        <span>{currentApt.date}, {currentApt.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons matching Screenshot 2 */}
                  <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-surface-100">
                    <button
                      onClick={() => setShowRescheduleModal(true)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setShowDirectionsModal(true)}
                      className="flex-1 py-2.5 px-4 rounded-full border border-blood-800 text-blood-800 hover:bg-blood-50 text-xs font-bold transition"
                    >
                      View Directions
                    </button>
                  </div>
                </div>

                {/* Card 2: Active Blood Requests Nearby */}
                <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        Active Blood Requests Nearby
                      </h3>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                    </div>

                    <p className="text-xs text-slate-500 mb-4">
                      Urgent O+ or match-type requests in your vicinity.
                    </p>

                    {urgentRequest ? (
                      <div className="bg-blood-50/60 p-4 rounded-2xl border border-blood-100 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Request by:</span>
                          <span className="font-bold text-slate-900 text-sm">{urgentRequest.hospitalName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Required:</span>
                          <span className="font-bold text-blood-800 text-sm">{urgentRequest.unitsRequired} Units ({urgentRequest.bloodGroup})</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Location:</span>
                          <span className="font-semibold text-slate-700">{urgentRequest.city}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Priority:</span>
                          <span className="font-bold text-red-600">{urgentRequest.priority}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No urgent requests nearby at the moment.</p>
                    )}
                  </div>

                  {/* Donate Now Button matching Screenshot 2 */}
                  <div className="mt-6 pt-4 border-t border-surface-100 flex justify-end">
                    <button
                      onClick={handleDonateNow}
                      className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-maroon"
                    >
                      Donate Now
                    </button>
                  </div>
                </div>

              </div>

              {/* LOWER ROW: My Donation Journey & Impact Badges (Screenshot 2) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Card: My Donation Journey (Timeline) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
                  <div className="border-b border-surface-100 pb-3 mb-2 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        My Donation Journey
                      </h3>
                      <p className="text-xs text-slate-500">
                        Historical tracking of all verified transfusions and upcoming dates.
                      </p>
                    </div>
                  </div>

                  {/* Horizontal Timeline Tracker */}
                  <TimelineTracker milestones={donationJourneyMilestones} />
                </div>

                {/* Right Card: Impact Badge (Screenshot 2) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-surface-200 shadow-sm flex flex-col justify-between">
                  <div className="border-b border-surface-100 pb-3 mb-4">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Impact Badge
                    </h3>
                    <p className="text-xs text-slate-500">
                      Earned milestones for voluntary donations.
                    </p>
                  </div>

                  <div className="flex items-center justify-around py-4">
                    <ImpactBadge title="Life Saver" type="lifesaver" subtitle="Level 3" />
                    <ImpactBadge title="Regular Donor" type="award" subtitle="4+ Transfusions" />
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Tab: Blood Requests (Incoming list with Accept/Reject) */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-lg mb-1">
                  Incoming Blood Requests
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Requests sent by patients and partner hospital emergency desks matching your O+ group.
                </p>

                <div className="space-y-4">
                  {requests.map(req => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      role="donor"
                      onAccept={(id) => {
                        acceptRequest(id, currentUser);
                        showToast(`Request accepted! Contacting ${req.hospitalName}`, 'success');
                      }}
                      onDecline={(id) => {
                        showToast('Request dismissed', 'info');
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Donation History */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4">
                Verified Donation Records
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Center / Hospital</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Units</th>
                      <th className="py-3 px-3">Certificate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    <tr className="hover:bg-blood-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">12 Oct 2026</td>
                      <td className="py-3 px-3 text-slate-700">City Hospital, Delhi</td>
                      <td className="py-3 px-3 text-slate-600">Whole Blood</td>
                      <td className="py-3 px-3 font-semibold text-blood-800">1 Unit</td>
                      <td className="py-3 px-3">
                        <span className="text-blood-800 font-bold hover:underline cursor-pointer">
                          Download Certificate
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blood-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">12 Sep 2026</td>
                      <td className="py-3 px-3 text-slate-700">Rotary Blood Camp</td>
                      <td className="py-3 px-3 text-slate-600">Whole Blood</td>
                      <td className="py-3 px-3 font-semibold text-blood-800">1 Unit</td>
                      <td className="py-3 px-3">
                        <span className="text-blood-800 font-bold hover:underline cursor-pointer">
                          Download Certificate
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blood-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">13 Apr 2026</td>
                      <td className="py-3 px-3 text-slate-700">Max Healthcare</td>
                      <td className="py-3 px-3 text-slate-600">Whole Blood</td>
                      <td className="py-3 px-3 font-semibold text-blood-800">1 Unit</td>
                      <td className="py-3 px-3">
                        <span className="text-blood-800 font-bold hover:underline cursor-pointer">
                          Download Certificate
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab: Profile & Settings */}
          {(activeTab === 'profile' || activeTab === 'settings') && (
            <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm max-w-2xl">
              <h3 className="font-extrabold text-slate-900 text-lg mb-4">
                Donor Profile Information
              </h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-center space-x-4 pb-4 border-b border-surface-100">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-blood-200"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{currentUser?.name}</h4>
                    <p className="text-slate-500">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-blood-100 text-blood-800 font-bold">
                      Verified O+ Lifesaver
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Phone Number</span>
                    <span className="font-semibold text-slate-800">{currentUser?.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Registered City</span>
                    <span className="font-semibold text-slate-800">{currentUser?.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Blood Type</span>
                    <span className="font-bold text-blood-800 text-sm">{currentUser?.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-1">Total Transfusions</span>
                    <span className="font-bold text-slate-800">{currentUser?.totalDonations} Donations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 text-center">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Reschedule Donation Appointment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select a new date and time for Red Cross Delhi:
            </p>
            <input
              type="date"
              defaultValue="2026-11-28"
              className="w-full text-xs p-3 rounded-xl border border-slate-300 mb-3"
            />
            <select className="w-full text-xs p-3 rounded-xl border border-slate-300 mb-5">
              <option>10:00 AM</option>
              <option>11:30 AM</option>
              <option>02:00 PM</option>
              <option>04:30 PM</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  rescheduleAppointment(currentApt.id, '28 Nov 2026', '11:30 AM');
                  setShowRescheduleModal(false);
                  showToast('Appointment rescheduled to 28 Nov 2026 at 11:30 AM', 'success');
                }}
                className="flex-1 py-2.5 rounded-full bg-blood-800 text-white text-xs font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-surface-200">
              <h3 className="font-bold text-slate-900">Directions to {currentApt.center}</h3>
              <button onClick={() => setShowDirectionsModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>
            <div className="my-4 text-xs text-slate-600 space-y-2">
              <p>📍 <strong>Address:</strong> {currentApt.address}</p>
              <p>🚇 <strong>Nearest Metro:</strong> Central Secretariat (Yellow/Violet Line), Gate No. 2 (300m walking distance).</p>
              <p>🕒 <strong>Donor Reception:</strong> Ground Floor, Room 102. Please bring any photo ID.</p>
            </div>
            <button
              onClick={() => setShowDirectionsModal(false)}
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
