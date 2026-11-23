import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, Droplet, MapPin, Clock, User, Phone, ChevronRight,
  CheckCircle2, Loader2, Building2, Heart, ArrowLeft, FileText, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import { BLOOD_GROUPS } from '../data/mockData';
import { Alert, BloodBadge, ProgressBar } from '../components/ui/index.jsx';

const COMPONENTS = ['Whole Blood', 'Packed Red Blood Cells (PRBC)', 'Platelets', 'Fresh Frozen Plasma (FFP)', 'Cryoprecipitate'];
const URGENCY = [
  { id: 'Critical (Golden Hour)', label: 'Critical — Golden Hour', desc: 'Life-threatening. Needed within 1 hour.', cls: 'border-blood-700 bg-blood-50 text-blood-900', badge: 'bg-blood-700 text-white' },
  { id: 'Within 6 Hours', label: 'Within 6 Hours', desc: 'Urgent but not immediately life-threatening.', cls: 'border-warning-500 bg-warning-50 text-warning-900', badge: 'bg-warning-500 text-white' },
  { id: 'Within 24 Hours', label: 'Within 24 Hours', desc: 'Needed today for planned procedure.', cls: 'border-navy-500 bg-navy-50 text-navy-900', badge: 'bg-navy-600 text-white' },
];

const STEPS = ['Patient Info', 'Blood Requirements', 'Hospital & Urgency', 'Review & Submit'];

const StepIndicator = ({ step, total }) => (
  <div className="flex items-center gap-2 justify-center">
    {Array.from({ length: total }).map((_, i) => (
      <React.Fragment key={i}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < step ? 'bg-success-500 text-white' : i === step ? 'bg-blood-800 text-white shadow-blood' : 'bg-surface-200 text-surface-500'
          }`}>
          {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
        </div>
        {i < total - 1 && <div className={`flex-1 h-0.5 max-w-[40px] transition-all ${i < step ? 'bg-success-500' : 'bg-surface-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

export const EmergencyRequestPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { submitRequest } = useBloodRequest();
  const { showToast, addNotification } = useNotification();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    patientName: '',
    requesterName: currentUser?.name || currentUser?.full_name || '',
    requesterEmail: currentUser?.email || '',
    contactNumber: currentUser?.phone || '',
    bloodGroup: 'O+',
    componentType: 'Whole Blood',
    unitsRequired: '1',
    hospitalName: '',
    hospitalAddress: '',
    city: currentUser?.city || '',
    urgency: 'Critical (Golden Hour)',
    notes: '',
  });

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const stepValid = () => {
    if (step === 0) return form.patientName && form.requesterName && form.contactNumber;
    if (step === 1) return form.bloodGroup && form.componentType && form.unitsRequired;
    if (step === 2) return form.hospitalName && form.city;
    return true;
  };

  const handleSubmit = async () => {
    if (!currentUser) { navigate('/login', { state: { from: { pathname: '/emergency-request' } } }); return; }
    setSubmitting(true); setError('');
    try {
      const req = await submitRequest({
        requesterId: currentUser?.id,
        patientName: form.patientName,
        requesterName: form.requesterName || currentUser?.name || currentUser?.full_name,
        requesterEmail: form.requesterEmail || currentUser?.email,
        contactNumber: form.contactNumber || currentUser?.phone,
        bloodGroup: form.bloodGroup,
        componentType: form.componentType,
        unitsRequired: parseInt(form.unitsRequired, 10),
        hospitalName: form.hospitalName,
        hospitalAddress: form.hospitalAddress,
        city: form.city,
        priority: form.urgency,
        notes: form.notes,
        latitude: 28.6139,
        longitude: 77.2090,
      });
      setSubmitted(req);
      addNotification({ title: 'Emergency Request Submitted', message: `Request ${req.id} is live. ${req.matchedDonorsCount || 0} donors notified.`, type: 'success' });
      showToast('Emergency request submitted! Donors are being notified.', 'success');
    } catch (err) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card overflow-hidden">
            <div className="bg-gradient-crimson p-7 text-white text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-2xl font-black mb-1">Request Submitted!</h2>
              <p className="text-blood-200 text-sm">Your emergency blood request is live on the network</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-surface-50 rounded-xl p-4 space-y-3">
                {[
                  { label: 'Request ID', value: submitted.id },
                  { label: 'Blood Group', value: submitted.bloodGroup || submitted.blood_group },
                  { label: 'Hospital', value: submitted.hospitalName || submitted.hospital_name },
                  { label: 'Urgency', value: submitted.urgency_level || submitted.priority },
                  { label: 'Donors Notified', value: `${submitted.matchedDonorsCount || 0} compatible donors` },
                  { label: 'Status', value: 'Active — Matching in progress' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-surface-500">{r.label}</span>
                    <span className="font-semibold text-surface-900">{r.value}</span>
                  </div>
                ))}
              </div>

              <Alert type="info" title="What happens next?">
                Compatible donors within your area have been notified via app alerts. Donor responses will appear in your dashboard in real time.
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/dashboard?tab=requests')} className="btn btn-lg btn-primary flex-1 justify-center">
                  <Heart className="w-5 h-5" />Track in Dashboard
                </button>
                <button onClick={() => { setSubmitted(null); setStep(0); setForm(p => ({ ...p, patientName: '', notes: '' })); }}
                  className="btn btn-lg btn-secondary flex-1 justify-center">
                  New Request
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Auth guard */}
        {!currentUser && (
          <Alert type="warning" title="Sign in required" className="mb-5">
            Please <button onClick={() => navigate('/login')} className="underline font-semibold">sign in</button> to submit an emergency blood request.
          </Alert>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blood-800 flex items-center justify-center shadow-blood">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900">Emergency Blood Request</h1>
            <p className="text-sm text-surface-500">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="mb-6">
          <StepIndicator step={step} total={STEPS.length} />
          <ProgressBar value={step} max={STEPS.length - 1} className="mt-3" />
        </div>

        {error && <Alert type="error" className="mb-5" onClose={() => setError('')}>{error}</Alert>}

        <div className="card overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}
              className="p-6 space-y-5">

              {/* Step 0: Patient Info */}
              {step === 0 && (
                <>
                  <h3 className="font-bold text-surface-900 flex items-center gap-2"><User className="w-5 h-5 text-blood-700" />Patient Information</h3>
                  <div>
                    <label className="label label-required">Patient Name</label>
                    <input value={form.patientName} onChange={e => setF('patientName', e.target.value)} placeholder="Full name of the patient" className="input" />
                  </div>
                  <div>
                    <label className="label label-required">Your Name (Requester)</label>
                    <input value={form.requesterName} onChange={e => setF('requesterName', e.target.value)} placeholder="Your full name" className="input" />
                  </div>
                  <div>
                    <label className="label label-required">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                      <input value={form.contactNumber} onChange={e => setF('contactNumber', e.target.value)} placeholder="+91 98765 43210" className="input pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email (optional)</label>
                    <input type="email" value={form.requesterEmail} onChange={e => setF('requesterEmail', e.target.value)} placeholder="For status updates" className="input" />
                  </div>
                </>
              )}

              {/* Step 1: Blood Requirements */}
              {step === 1 && (
                <>
                  <h3 className="font-bold text-surface-900 flex items-center gap-2"><Droplet className="w-5 h-5 text-blood-700" />Blood Requirements</h3>
                  <div>
                    <label className="label label-required">Blood Group Required</label>
                    <div className="grid grid-cols-4 gap-2">
                      {BLOOD_GROUPS.map(bg => (
                        <button key={bg} type="button" onClick={() => setF('bloodGroup', bg)}
                          className={`py-2.5 rounded-xl text-sm font-black transition-all ${form.bloodGroup === bg ? 'bg-blood-800 text-white shadow-blood scale-105' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}>
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label label-required">Blood Component</label>
                    <div className="space-y-2">
                      {COMPONENTS.map(c => (
                        <label key={c} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.componentType === c ? 'border-blood-700 bg-blood-50' : 'border-surface-200 hover:border-surface-300'}`}>
                          <input type="radio" name="component" value={c} checked={form.componentType === c} onChange={e => setF('componentType', e.target.value)} className="text-blood-700 focus:ring-blood-700" />
                          <span className="text-sm font-medium text-surface-800">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label label-required">Units Required</label>
                    <input type="number" min={1} max={20} value={form.unitsRequired} onChange={e => setF('unitsRequired', e.target.value)} className="input w-32" />
                    <p className="text-xs text-surface-400 mt-1">1 unit ≈ 450ml of whole blood</p>
                  </div>
                </>
              )}

              {/* Step 2: Hospital & Urgency */}
              {step === 2 && (
                <>
                  <h3 className="font-bold text-surface-900 flex items-center gap-2"><Building2 className="w-5 h-5 text-blood-700" />Hospital & Urgency</h3>
                  <div>
                    <label className="label label-required">Hospital Name</label>
                    <input value={form.hospitalName} onChange={e => setF('hospitalName', e.target.value)} placeholder="e.g. AIIMS New Delhi" className="input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label label-required">City</label>
                      <input value={form.city} onChange={e => setF('city', e.target.value)} placeholder="City" className="input" />
                    </div>
                    <div>
                      <label className="label">Ward / Room</label>
                      <input value={form.hospitalAddress} onChange={e => setF('hospitalAddress', e.target.value)} placeholder="ICU Ward 3" className="input" />
                    </div>
                  </div>
                  <div>
                    <label className="label label-required">Urgency Level</label>
                    <div className="space-y-2">
                      {URGENCY.map(u => (
                        <label key={u.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.urgency === u.id ? u.cls + ' border-current' : 'border-surface-200 bg-white hover:border-surface-300'}`}>
                          <input type="radio" name="urgency" value={u.id} checked={form.urgency === u.id} onChange={e => setF('urgency', e.target.value)} className="mt-0.5 text-blood-700 focus:ring-blood-700" />
                          <div>
                            <div className="font-bold text-sm">{u.label}</div>
                            <div className="text-xs opacity-75 mt-0.5">{u.desc}</div>
                          </div>
                          {form.urgency === u.id && <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${u.badge} flex-shrink-0`}>Selected</span>}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="label">Additional Notes</label>
                    <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={3} placeholder="Medical context, special requirements..." className="input resize-none" />
                  </div>
                </>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <>
                  <h3 className="font-bold text-surface-900 flex items-center gap-2"><FileText className="w-5 h-5 text-blood-700" />Review & Submit</h3>
                  <div className="bg-surface-50 rounded-xl divide-y divide-surface-200">
                    {[
                      { label: 'Patient', value: form.patientName },
                      { label: 'Blood Group', value: <BloodBadge group={form.bloodGroup} size="sm" /> },
                      { label: 'Component', value: form.componentType },
                      { label: 'Units', value: `${form.unitsRequired} unit(s)` },
                      { label: 'Hospital', value: form.hospitalName },
                      { label: 'City', value: form.city },
                      { label: 'Urgency', value: form.urgency },
                      { label: 'Contact', value: form.contactNumber },
                    ].map(r => (
                      <div key={r.label} className="flex items-center justify-between py-3 px-4">
                        <span className="text-sm text-surface-500">{r.label}</span>
                        <span className="text-sm font-semibold text-surface-900">{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <Alert type="warning" title="Confirm before submitting">
                    This request will immediately alert all compatible verified donors in your area. Only submit for genuine medical emergencies.
                  </Alert>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-6 pb-6 flex items-center justify-between gap-3 border-t border-surface-100 pt-4">
            <button disabled={step === 0} onClick={() => setStep(p => p - 1)} className="btn btn-md btn-secondary disabled:opacity-40">
              <ArrowLeft className="w-4 h-4" />Back
            </button>
            {step < STEPS.length - 1 ? (
              <button disabled={!stepValid()} onClick={() => setStep(p => p + 1)} className="btn btn-md btn-primary disabled:opacity-40">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting || !currentUser} className="btn btn-md btn-primary disabled:opacity-40">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Submit Emergency Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestPage;
