import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Droplet, MapPin, AlertTriangle, CheckCircle2, XCircle, Loader2, Users } from 'lucide-react';
import { BloodBadge } from '../ui/index.jsx';

const urgencyConfig = {
  'Critical (Golden Hour)': { label: 'Critical · Golden Hour', cls: 'badge-danger', border: 'border-l-4 border-blood-700' },
  'Within 6 Hours':  { label: 'Within 6 Hours', cls: 'badge-warning', border: 'border-l-4 border-warning-500' },
  'Within 24 Hours': { label: 'Within 24 Hours', cls: 'badge-navy',   border: 'border-l-4 border-navy-500'   },
  'Scheduled':       { label: 'Scheduled',       cls: 'badge-neutral', border: 'border-l-4 border-surface-300' },
};

const statusConfig = {
  'Pending':                  { icon: Loader2,       cls: 'text-warning-600', bg: 'bg-warning-50 border-warning-200',   label: 'Pending' },
  'In Progress - Donor Found':{ icon: Users,         cls: 'text-blue-600',   bg: 'bg-blue-50 border-blue-200',         label: 'Donor Found' },
  'Completed':                { icon: CheckCircle2,  cls: 'text-success-600', bg: 'bg-success-50 border-success-200',   label: 'Completed' },
  'Fulfilled':                { icon: CheckCircle2,  cls: 'text-success-600', bg: 'bg-success-50 border-success-200',   label: 'Fulfilled' },
  'Cancelled':                { icon: XCircle,       cls: 'text-surface-400', bg: 'bg-surface-50 border-surface-200',   label: 'Cancelled' },
};

export const RequestCard = ({ request, onAccept, onDecline, onCancel, showActions = false, className = '' }) => {
  const blood   = request.blood_group || request.bloodGroup || '?';
  const urgency = request.urgency_level || request.priority || 'Scheduled';
  const status  = request.request_status || request.status || 'Pending';
  const hospital= request.hospital_name || request.hospitalName || 'Unknown Hospital';
  const city    = request.city || '';
  const units   = request.units_required || request.unitsRequired || 1;
  const urg     = urgencyConfig[urgency] || urgencyConfig['Scheduled'];
  const sts     = statusConfig[status] || statusConfig['Pending'];
  const StatusIcon = sts.icon;

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`card overflow-hidden ${urg.border} ${className}`}>
      <div className="p-5">
        <div className="flex items-start gap-3">
          <BloodBadge group={blood} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-surface-900 text-sm">{request.patient_name || request.patientName || 'Patient'}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-surface-400" />
                  <span className="text-xs text-surface-500 truncate">{hospital}{city ? `, ${city}` : ''}</span>
                </div>
              </div>
              <span className={`badge ${urg.cls} text-[10px] flex-shrink-0`}>{urg.label}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-surface-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-surface-400">Component</div>
            <div className="text-xs font-bold text-surface-800 mt-0.5 truncate">{request.component_type || request.componentType || 'Whole Blood'}</div>
          </div>
          <div className="bg-surface-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-surface-400">Units Needed</div>
            <div className="text-sm font-black text-surface-900 num-display">{units}</div>
          </div>
          <div className="bg-surface-50 rounded-lg p-2.5 text-center">
            <div className="text-xs text-surface-400">Required By</div>
            <div className="text-xs font-bold text-surface-800 mt-0.5 truncate">{request.required_date || request.requiredDate || 'ASAP'}</div>
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-4 p-2.5 rounded-lg border ${sts.bg} text-xs`}>
          <StatusIcon className={`w-4 h-4 flex-shrink-0 ${sts.cls} ${status === 'Pending' ? 'animate-spin' : ''}`} />
          <span className={`font-semibold ${sts.cls}`}>{sts.label}</span>
          {request.matchedDonorsCount != null && (
            <span className="ml-auto text-surface-500">{request.matchedDonorsCount} donor{request.matchedDonorsCount !== 1 ? 's' : ''} notified</span>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            {onAccept && (
              <button onClick={() => onAccept(request.id)} className="btn btn-sm btn-success flex-1 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />Accept
              </button>
            )}
            {onDecline && (
              <button onClick={() => onDecline(request.id)} className="btn btn-sm btn-secondary flex-1 justify-center">
                Decline
              </button>
            )}
            {onCancel && (
              <button onClick={() => onCancel(request.id)} className="btn btn-sm btn-danger flex-1 justify-center">
                <XCircle className="w-3.5 h-3.5" />Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RequestCard;
