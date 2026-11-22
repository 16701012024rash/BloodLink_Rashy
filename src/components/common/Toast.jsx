import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Bell, X } from 'lucide-react';

/* ══════════════════════════════════════════════
   PREMIUM TOAST NOTIFICATION SYSTEM
   ══════════════════════════════════════════════ */
const toastConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-white border-l-4 border-success-500',
    icon_cls: 'text-success-500',
    title_cls: 'text-surface-900',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-white border-l-4 border-danger-500',
    icon_cls: 'text-danger-500',
    title_cls: 'text-surface-900',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-white border-l-4 border-warning-500',
    icon_cls: 'text-warning-500',
    title_cls: 'text-surface-900',
  },
  emergency: {
    icon: AlertCircle,
    bg: 'bg-blood-900 border-l-4 border-blood-400 text-white',
    icon_cls: 'text-blood-300',
    title_cls: 'text-white',
  },
  info: {
    icon: Info,
    bg: 'bg-white border-l-4 border-navy-500',
    icon_cls: 'text-navy-500',
    title_cls: 'text-surface-900',
  },
};

const ToastItem = ({ toast, onRemove }) => {
  const cfg = toastConfig[toast.type] || toastConfig.info;
  const Icon = cfg.icon;

  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 48, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 48, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-start gap-3 p-4 rounded-xl shadow-xl max-w-sm w-full pointer-events-auto ${cfg.bg}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.icon_cls}`} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-semibold mb-0.5 ${cfg.title_cls}`}>{toast.title}</p>
        )}
        <p className={`text-sm leading-snug ${cfg.title_cls ? cfg.title_cls + '/80' : 'text-surface-600'}`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`p-0.5 rounded hover:opacity-70 transition flex-shrink-0 ${cfg.title_cls || 'text-surface-400'}`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export const ToastContainer = ({ toasts = [], onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[300] flex flex-col-reverse gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════════
   GLOBAL TOAST WRAPPER (reads from context)
   ══════════════════════════════════════════════ */
import { useNotification } from '../../context/NotificationContext';

export const GlobalToastContainer = () => {
  const { toasts, removeToast } = useNotification();
  return <ToastContainer toasts={toasts} onRemove={removeToast} />;
};

export default GlobalToastContainer;
