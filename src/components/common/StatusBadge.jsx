import React from 'react';
import { CheckCircle2, Clock, AlertCircle, XCircle, ShieldCheck } from 'lucide-react';

export const StatusBadge = ({ status, priority }) => {
  if (priority === 'Critical') {
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>CRITICAL PRIORITY</span>
      </span>
    );
  }

  switch (status) {
    case 'Completed':
    case 'Fulfilled':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Completed</span>
        </span>
      );
    case 'In Progress - Donor Found':
    case 'Donor Found':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>In Progress - Donor Found</span>
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-600" />
          <span>Awaiting Donor</span>
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <XCircle className="w-3 h-3 text-slate-500" />
          <span>Cancelled</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          <span>{status}</span>
        </span>
      );
  }
};
