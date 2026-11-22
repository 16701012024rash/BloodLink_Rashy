import React from 'react';
import { Building2, MapPin, Calendar, Clock, AlertCircle, CheckCircle2, User, Phone } from 'lucide-react';
import { BloodGroupBadge } from '../common/BloodGroupBadge';
import { StatusBadge } from '../common/StatusBadge';

export const RequestCard = ({ 
  request, 
  onAccept, 
  onDecline, 
  onCancel, 
  onViewDetails,
  showActions = true,
  role = 'donor'
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-100">
        <div className="flex items-center space-x-3">
          <BloodGroupBadge group={request.bloodGroup} size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                {request.patientName}
              </h4>
              <span className="text-xs text-slate-400">({request.id})</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-blood-700 shrink-0" />
              <span>{request.hospitalName}, {request.city}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={request.status} priority={request.priority} />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs">
        <div className="bg-surface-50 p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Units Needed</span>
          <span className="font-bold text-blood-800 text-sm">{request.unitsRequired} Units</span>
        </div>
        <div className="bg-surface-50 p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Required By</span>
          <span className="font-semibold text-slate-700">{request.requiredDate}</span>
        </div>
        <div className="bg-surface-50 p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Priority</span>
          <span className={`font-bold ${request.priority === 'Critical' ? 'text-red-600' : 'text-slate-700'}`}>
            {request.priority}
          </span>
        </div>
        <div className="bg-surface-50 p-2 rounded-xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Phone</span>
          <span className="font-semibold text-slate-700 truncate block">{request.contactNumber}</span>
        </div>
      </div>

      {/* Progress Bar if In Progress */}
      {request.status !== 'Cancelled' && (
        <div className="my-3">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Fulfillment Progress</span>
            <span className="font-bold text-blood-800">{request.progressPercent || 25}%</span>
          </div>
          <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                request.progressPercent === 100 
                  ? 'bg-emerald-500' 
                  : request.priority === 'Critical' 
                  ? 'bg-red-600' 
                  : 'bg-blood-700'
              }`}
              style={{ width: `${request.progressPercent || 25}%` }}
            />
          </div>
        </div>
      )}

      {/* Notes */}
      {request.notes && (
        <p className="text-xs text-slate-600 bg-blood-50/50 p-2.5 rounded-xl border border-blood-100/60 my-2">
          <strong>Note:</strong> {request.notes}
        </p>
      )}

      {/* Matched Donor details if available */}
      {request.matchedDonor && (
        <div className="mt-2 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-emerald-700" />
            <span className="text-slate-700">
              Matched Donor: <strong className="text-emerald-900">{request.matchedDonor.name}</strong> ({request.matchedDonor.bloodGroup})
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
            {request.matchedDonor.status}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-end space-x-2">
          {role === 'donor' && request.status === 'Pending' && (
            <>
              {onDecline && (
                <button
                  onClick={() => onDecline(request.id)}
                  className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  Decline
                </button>
              )}
              {onAccept && (
                <button
                  onClick={() => onAccept(request.id)}
                  className="px-4 py-1.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
                >
                  Donate Now
                </button>
              )}
            </>
          )}

          {role === 'requester' && request.status !== 'Completed' && request.status !== 'Cancelled' && (
            <>
              {onCancel && (
                <button
                  onClick={() => onCancel(request.id)}
                  className="px-3 py-1.5 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                >
                  Cancel Request
                </button>
              )}
              <button
                onClick={onViewDetails}
                className="px-4 py-1.5 rounded-full bg-blood-800 hover:bg-blood-900 text-white text-xs font-bold transition shadow-sm"
              >
                Track Live
              </button>
            </>
          )}

          {request.status === 'Completed' && (
            <span className="text-emerald-700 text-xs font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Transfusion Successfully Completed</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
