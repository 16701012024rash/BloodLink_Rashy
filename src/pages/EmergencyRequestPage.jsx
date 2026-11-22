import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  Droplet, 
  ShieldAlert, 
  ArrowRight,
  Info
} from 'lucide-react';
import { BLOOD_GROUPS, CITIES, BLOOD_COMPATIBILITY } from '../data/mockData';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { BloodGroupBadge } from '../components/common/BloodGroupBadge';

export const EmergencyRequestPage = () => {
  const navigate = useNavigate();
  const { submitRequest, donors } = useBloodRequest();
  const { currentUser } = useAuth();
  const { addNotification, showToast } = useNotification();

  const [formData, setFormData] = useState({
    patientName: '',
    requesterName: currentUser ? currentUser.name : '',
    requesterEmail: currentUser ? currentUser.email : '',
    contactNumber: currentUser?.phone || '',
    bloodGroup: 'A+',
    unitsRequired: 2,
    hospitalName: '',
    city: 'New Delhi',
    hospitalAddress: '',
    roomNumber: '',
    requiredDate: 'Immediate',
    priority: 'Critical',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live estimate of matching available donors
  const compatibleGroups = BLOOD_COMPATIBILITY[formData.bloodGroup]?.canReceiveFrom || [formData.bloodGroup];
  const matchingDonorsCount = donors.filter(d => 
    d.isAvailable && 
    compatibleGroups.includes(d.bloodGroup) &&
    (formData.city === 'All Cities' || d.city.toLowerCase().includes(formData.city.toLowerCase()))
  ).length;

  const validate = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.hospitalName.trim()) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.length < 8) {
      newErrors.contactNumber = 'Valid contact number is required';
    }
    if (!formData.hospitalAddress.trim()) newErrors.hospitalAddress = 'Hospital location/address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitRequest(formData);
      setSubmittedRequest(created);
      setIsSubmitting(false);

      addNotification({
        title: `🚨 Emergency Blood Request Dispatched: ${formData.unitsRequired} Units of ${formData.bloodGroup}`,
        message: `${created.hospitalName} (${created.city}) - ${matchingDonorsCount} nearby donors alerted!`,
        type: 'emergency',
        urgent: true,
        actionUrl: '/requester-dashboard'
      });

      showToast('Emergency request broadcasted successfully!', 'emergency');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-surface-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Alert for Emergency Cases */}
        <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-5 flex items-start space-x-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-red-900 text-sm sm:text-base">
              Emergency Blood Request Desk (Active 24x7)
            </h3>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              Every request submitted here is automatically broadcasted with high priority to registered volunteer donors, regional blood banks, and verified coordinators within your hospital's zone.
            </p>
          </div>
        </div>

        {/* MAIN REQUEST CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-surface-200 shadow-card">
          <div className="border-b border-surface-200 pb-5 mb-6">
            <div className="flex items-center space-x-2 text-blood-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Droplet className="w-4 h-4 fill-blood-800" />
              <span>Step 1 of 1: Request Details</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Submit Blood Request
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Provide hospital and patient details. Matched donors will coordinate directly through our verified protocol.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Patient & Blood Requirement */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                1. Patient & Transfusion Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Patient Name */}
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Rodriguez"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className={`w-full text-xs px-4 py-3 rounded-2xl border ${
                      errors.patientName ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-surface-50'
                    } focus:outline-none focus:border-blood-800`}
                  />
                  {errors.patientName && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 block">
                      {errors.patientName}
                    </span>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Required Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full text-xs font-bold px-4 py-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800 text-blood-900"
                  >
                    {BLOOD_GROUPS.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                {/* Units Required */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Units Required *
                  </label>
                  <select
                    value={formData.unitsRequired}
                    onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value, 10) })}
                    className="w-full text-xs font-bold px-4 py-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800"
                  >
                    <option value="1">1 Unit (approx. 450 ml)</option>
                    <option value="2">2 Units</option>
                    <option value="3">3 Units</option>
                    <option value="4">4 Units</option>
                    <option value="5">5+ Units (Massive Trauma)</option>
                  </select>
                </div>
              </div>

              {/* Priority Selector Pill Buttons */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Emergency Priority Level *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { level: 'Critical', desc: 'Immediate (Golden Hour)', color: 'bg-red-50 border-red-300 text-red-700' },
                    { level: 'High', desc: 'Within 6 Hours', color: 'bg-amber-50 border-amber-300 text-amber-800' },
                    { level: 'Medium', desc: 'Within 24 Hours', color: 'bg-blue-50 border-blue-300 text-blue-800' },
                    { level: 'Normal', desc: 'Scheduled / Advance', color: 'bg-slate-50 border-slate-300 text-slate-700' }
                  ].map(p => (
                    <button
                      key={p.level}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p.level })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        formData.priority === p.level
                          ? 'border-2 border-blood-800 bg-blood-50 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>{p.level}</span>
                        {formData.priority === p.level && <span className="text-blood-800 font-bold">●</span>}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2: Hospital & Location Details */}
            <div className="pt-4 border-t border-surface-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                2. Hospital & Location Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hospital Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. City Hospital / AIIMS / Fortis"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className={`w-full text-xs px-4 py-3 rounded-2xl border ${
                      errors.hospitalName ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-surface-50'
                    } focus:outline-none focus:border-blood-800`}
                  />
                  {errors.hospitalName && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 block">
                      {errors.hospitalName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    City / Zone *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800 text-slate-800"
                  >
                    {CITIES.slice(1).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Hospital Campus Address / Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 14, Ring Road, Delhi"
                    value={formData.hospitalAddress}
                    onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                    className={`w-full text-xs px-4 py-3 rounded-2xl border ${
                      errors.hospitalAddress ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-surface-50'
                    } focus:outline-none focus:border-blood-800`}
                  />
                  {errors.hospitalAddress && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 block">
                      {errors.hospitalAddress}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Ward / Room / Bed Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ICU Bed 4 / 3rd Floor"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Contact Person & Notes */}
            <div className="pt-4 border-t border-surface-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                3. Attending Contact & Medical Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Contact Person Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={`w-full text-xs px-4 py-3 rounded-2xl border ${
                      errors.contactNumber ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-surface-50'
                    } focus:outline-none focus:border-blood-800`}
                  />
                  {errors.contactNumber && (
                    <span className="text-[10px] text-red-600 font-semibold mt-1 block">
                      {errors.contactNumber}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Required By (Date / Time)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Immediate / 22 Nov 2026, 4:00 PM"
                    value={formData.requiredDate}
                    onChange={(e) => setFormData({ ...formData, requiredDate: e.target.value })}
                    className="w-full text-xs px-4 py-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Additional Clinical Notes / Medical Condition
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Emergency surgery scheduled. Donor replacement required by hospital blood bank."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full text-xs p-3 rounded-2xl border border-slate-200 bg-surface-50 focus:outline-none focus:border-blood-800"
                  />
                </div>
              </div>
            </div>

            {/* LIVE MATCH CALCULATOR WIDGET */}
            <div className="p-4 bg-blood-50/70 border border-blood-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blood-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {matchingDonorsCount}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {matchingDonorsCount} Compatible Donors Found in {formData.city}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Acceptable groups: {compatibleGroups.join(', ')}
                  </div>
                </div>
              </div>

              <div className="text-xs text-blood-800 font-semibold flex items-center space-x-1">
                <span>Auto-dispatch ready</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blood-800 hover:bg-blood-900 text-white py-4 px-6 rounded-full font-bold text-sm shadow-maroon hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Broadcasting Emergency Request...</span>
                ) : (
                  <>
                    <Droplet className="w-4 h-4 fill-white" />
                    <span>Broadcast Emergency Blood Request Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {submittedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border-2 border-blood-800 animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold text-blood-800 uppercase tracking-wider">
              Request Dispatched Successfully
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Help is on the way!
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your request ID is <strong className="text-slate-900 font-mono">{submittedRequest.id}</strong>. We have broadcasted this urgent need to registered donors across {submittedRequest.city}.
            </p>

            <div className="my-6 p-4 bg-surface-50 rounded-2xl border border-surface-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-800">{submittedRequest.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-bold text-blood-800">{submittedRequest.bloodGroup} ({submittedRequest.unitsRequired} Units)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="font-semibold text-slate-800">{submittedRequest.hospitalName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Priority:</span>
                <span className="font-bold text-red-600">{submittedRequest.priority}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => navigate('/requester-dashboard')}
                className="w-full py-3 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
              >
                Go to Requester Dashboard
              </button>
              <button
                onClick={() => setSubmittedRequest(null)}
                className="w-full py-3 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
