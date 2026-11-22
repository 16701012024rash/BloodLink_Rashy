import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let bgColor = 'bg-white border-blood-200 text-slate-800';
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;

        if (toast.type === 'error' || toast.type === 'emergency') {
          bgColor = 'bg-white border-red-300 text-slate-800';
          icon = <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />;
        } else if (toast.type === 'info') {
          bgColor = 'bg-white border-blue-200 text-slate-800';
          icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-card transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${bgColor}`}
          >
            <div className="flex items-center space-x-3">
              {icon}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
