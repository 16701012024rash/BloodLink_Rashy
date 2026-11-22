/**
 * BloodLink Design System — Shared primitive components
 * Used across all pages for consistent UI.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

/* ════════════════════════════════════════════════════════
   SKELETON LOADERS
   ════════════════════════════════════════════════════════ */
export const SkeletonLine = ({ className = '' }) => (
  <div className={`shimmer-bg rounded-md ${className}`} />
);

export const SkeletonCard = ({ className = '' }) => (
  <div className={`card p-5 space-y-3 ${className}`}>
    <div className="flex items-center gap-3">
      <SkeletonLine className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="h-3.5 w-2/3" />
        <SkeletonLine className="h-3 w-1/3" />
      </div>
    </div>
    <SkeletonLine className="h-3 w-full" />
    <SkeletonLine className="h-3 w-4/5" />
    <SkeletonLine className="h-8 w-24 rounded-lg mt-2" />
  </div>
);

export const SkeletonStatCard = () => (
  <div className="card p-5 space-y-3">
    <SkeletonLine className="h-3 w-20" />
    <SkeletonLine className="h-8 w-24" />
    <SkeletonLine className="h-2.5 w-16 rounded-full" />
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 items-center">
        <SkeletonLine className="h-9 w-9 rounded-full flex-shrink-0" />
        <SkeletonLine className="h-3.5 flex-1" />
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════
   EMPTY STATES
   ════════════════════════════════════════════════════════ */
export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-surface-400" />
      </div>
    )}
    <h3 className="text-base font-semibold text-surface-700 mb-1.5">{title}</h3>
    {description && <p className="text-sm text-surface-400 max-w-sm leading-relaxed">{description}</p>}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);

/* ════════════════════════════════════════════════════════
   LOADING SPINNER
   ════════════════════════════════════════════════════════ */
export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-10 h-10' };
  return <Loader2 className={`animate-spin text-blood-800 ${sizes[size]} ${className}`} />;
};

export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-[320px] gap-3">
    <Spinner size="lg" />
    <p className="text-sm text-surface-500 font-medium">{message}</p>
  </div>
);

/* ════════════════════════════════════════════════════════
   ALERT BANNERS
   ════════════════════════════════════════════════════════ */
const alertConfig = {
  success: { icon: CheckCircle2, classes: 'bg-success-50 border-success-200 text-success-800', iconClass: 'text-success-600' },
  error:   { icon: AlertCircle,  classes: 'bg-danger-50 border-danger-200 text-danger-800',   iconClass: 'text-danger-600' },
  warning: { icon: AlertTriangle,classes: 'bg-warning-50 border-warning-200 text-warning-800',iconClass: 'text-warning-600' },
  info:    { icon: Info,         classes: 'bg-navy-50 border-navy-100 text-navy-700',         iconClass: 'text-navy-500' },
};

export const Alert = ({ type = 'info', title, children, onClose, className = '' }) => {
  const cfg = alertConfig[type] || alertConfig.info;
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.classes} ${className}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.iconClass}`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-0.5">{title}</p>}
        {children && <p className="text-sm opacity-85">{children}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} className="p-0.5 rounded hover:opacity-70 transition flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════════
   LIVE CONNECTION DOT
   ════════════════════════════════════════════════════════ */
export const LiveDot = ({ status = 'live', label, className = '' }) => {
  const cfg = {
    live:        { dot: 'bg-success-500', ping: 'bg-success-500', text: 'text-success-700' },
    reconnecting:{ dot: 'bg-warning-500', ping: 'bg-warning-500', text: 'text-warning-700' },
    offline:     { dot: 'bg-surface-400', ping: '',               text: 'text-surface-500' },
    sandbox:     { dot: 'bg-warning-400', ping: 'bg-warning-400', text: 'text-warning-700' },
  }[status] || { dot: 'bg-surface-400', ping: '', text: 'text-surface-500' };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {cfg.ping && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.ping} opacity-60`} />}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.dot}`} />
      </span>
      {label && <span className={`text-xs font-semibold ${cfg.text}`}>{label}</span>}
    </span>
  );
};

/* ════════════════════════════════════════════════════════
   SECTION HEADER
   ════════════════════════════════════════════════════════ */
export const SectionHeader = ({ overline, title, description, centered = false, className = '' }) => (
  <div className={`${centered ? 'text-center' : ''} ${className}`}>
    {overline && (
      <span className="inline-flex items-center gap-2 text-xs font-bold text-blood-700 uppercase tracking-widest mb-3 bg-blood-50 px-3 py-1 rounded-full border border-blood-100">
        {overline}
      </span>
    )}
    {title && <h2 className="text-3xl lg:text-4xl font-bold text-surface-900 tracking-tight mb-3">{title}</h2>}
    {description && <p className={`text-surface-500 leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`}>{description}</p>}
  </div>
);

/* ════════════════════════════════════════════════════════
   STAT DISPLAY CARD
   ════════════════════════════════════════════════════════ */
export const StatDisplay = ({ label, value, sublabel, icon: Icon, trend, color = 'default', className = '' }) => {
  const colors = {
    default:  { bg: 'bg-surface-100', icon: 'text-surface-500', value: 'text-surface-900' },
    blood:    { bg: 'bg-blood-50',    icon: 'text-blood-700',   value: 'text-blood-800'   },
    success:  { bg: 'bg-success-50',  icon: 'text-success-600', value: 'text-success-700' },
    warning:  { bg: 'bg-warning-50',  icon: 'text-warning-600', value: 'text-warning-700' },
    danger:   { bg: 'bg-danger-50',   icon: 'text-danger-600',  value: 'text-danger-700'  },
    navy:     { bg: 'bg-navy-50',     icon: 'text-navy-600',    value: 'text-navy-700'    },
  };
  const c = colors[color] || colors.default;

  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">{label}</p>
          <p className={`text-2xl font-bold num-display ${c.value}`}>{value}</p>
          {sublabel && <p className="text-xs text-surface-400 mt-1">{sublabel}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className={`w-5 h-5 ${c.icon}`} />
          </div>
        )}
      </div>
      {trend != null && (
        <div className={`mt-3 pt-3 border-t border-surface-100 text-xs font-medium ${trend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   BLOOD GROUP BADGE
   ════════════════════════════════════════════════════════ */
const bloodColors = {
  'O+':  'bg-red-700 text-white',
  'O-':  'bg-red-900 text-white',
  'A+':  'bg-blue-700 text-white',
  'A-':  'bg-blue-900 text-white',
  'B+':  'bg-purple-700 text-white',
  'B-':  'bg-purple-900 text-white',
  'AB+': 'bg-orange-700 text-white',
  'AB-': 'bg-orange-900 text-white',
};

export const BloodBadge = ({ group, size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  const bg = bloodColors[group] || 'bg-surface-700 text-white';
  return (
    <div className={`${sizes[size]} ${bg} rounded-xl flex items-center justify-center font-black tracking-tight shadow-sm flex-shrink-0 ${className}`}>
      {group || '?'}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   CONFIRMATION DIALOG
   ════════════════════════════════════════════════════════ */
export const ConfirmDialog = ({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) => {
  if (!open) return null;
  const btnClass = variant === 'danger' ? 'btn-danger' : 'btn-primary';
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full z-10">
        <h3 className="text-lg font-bold text-surface-900 mb-2">{title}</h3>
        <p className="text-sm text-surface-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn btn-md btn-secondary">{cancelLabel}</button>
          <button onClick={onConfirm} className={`btn btn-md ${btnClass}`}>{confirmLabel}</button>
        </div>
      </motion.div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   PROGRESS BAR
   ════════════════════════════════════════════════════════ */
export const ProgressBar = ({ value, max = 100, label, color = 'blood', size = 'md', className = '' }) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
  const colors = { blood: 'bg-blood-700', success: 'bg-success-500', warning: 'bg-warning-500', danger: 'bg-danger-500', navy: 'bg-navy-600' };
  return (
    <div className={className}>
      {label && <div className="flex justify-between text-xs text-surface-500 mb-1"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div className={`w-full bg-surface-100 rounded-full overflow-hidden ${heights[size]}`}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`${heights[size]} ${colors[color] || colors.blood} rounded-full`} />
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   TABS COMPONENT
   ════════════════════════════════════════════════════════ */
export const Tabs = ({ tabs, active, onChange, className = '', variant = 'underline' }) => {
  if (variant === 'pill') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={`btn btn-sm transition-all ${active === t.id ? 'btn-primary' : 'btn-secondary'}`}>
            {t.icon && <t.icon className="w-3.5 h-3.5" />}
            {t.label}
            {t.count != null && <span className={`text-xs rounded-full px-1.5 py-0.5 ml-1 font-bold ${active === t.id ? 'bg-white/20' : 'bg-surface-200 text-surface-500'}`}>{t.count}</span>}
          </button>
        ))}
      </div>
    );
  }
  // underline variant
  return (
    <div className={`flex gap-1 overflow-x-auto scrollbar-hide border-b border-surface-200 ${className}`}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all -mb-px ${
            active === t.id
              ? 'border-blood-700 text-blood-800'
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
          }`}>
          {t.icon && <t.icon className="w-4 h-4" />}
          {t.label}
          {t.count != null && (
            <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center ${active === t.id ? 'bg-blood-100 text-blood-800' : 'bg-surface-100 text-surface-500'}`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════════
   MODAL WRAPPER
   ════════════════════════════════════════════════════════ */
export const Modal = ({ open, onClose, title, children, size = 'md', className = '' }) => {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`relative bg-white rounded-2xl shadow-2xl ${sizes[size]} w-full max-h-[90vh] flex flex-col z-10 ${className}`}>
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-surface-100">
                <h2 className="text-lg font-bold text-surface-900">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 transition text-surface-400 hover:text-surface-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default {
  SkeletonLine, SkeletonCard, SkeletonStatCard, SkeletonTable,
  EmptyState, Spinner, PageLoader, Alert, LiveDot,
  SectionHeader, StatDisplay, BloodBadge,
  ConfirmDialog, ProgressBar, Tabs, Modal,
};
