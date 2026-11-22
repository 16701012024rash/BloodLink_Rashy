import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, AlertTriangle, Droplet, CheckCircle2, Calendar, Trash2,
  CheckCheck, ArrowRight, Info, Heart, Shield, Clock, X, Filter
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { EmptyState } from '../components/ui/index.jsx';

const typeConfig = {
  emergency: { icon: AlertTriangle, bg: 'bg-blood-50', border: 'border-blood-200', iconCls: 'text-blood-700', badge: 'badge-danger' },
  match:     { icon: Droplet,       bg: 'bg-blue-50',  border: 'border-blue-200',  iconCls: 'text-blue-700',  badge: 'badge-navy' },
  update:    { icon: Info,          bg: 'bg-surface-50', border: 'border-surface-200', iconCls: 'text-surface-500', badge: 'badge-neutral' },
  reminder:  { icon: Calendar,      bg: 'bg-warning-50', border: 'border-warning-200', iconCls: 'text-warning-600', badge: 'badge-warning' },
  success:   { icon: CheckCircle2,  bg: 'bg-success-50', border: 'border-success-200', iconCls: 'text-success-600', badge: 'badge-success' },
};

function timeAgo(ts) {
  if (!ts) return '';
  if (typeof ts === 'string' && !ts.includes('T')) return ts;
  const d = new Date(ts);
  if (isNaN(d)) return ts;
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60)  return 'Just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotification();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread')    return !n.read && !n.is_read;
    if (filter === 'emergency') return n.type === 'emergency' || n.urgent;
    return true;
  });

  const filters = [
    { id: 'all',       label: `All (${notifications.length})` },
    { id: 'unread',    label: `Unread (${unreadCount})` },
    { id: 'emergency', label: '🚨 Emergency' },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 badge badge-blood mb-2">
                <Bell className="w-3.5 h-3.5" />Real-Time Notifications
              </div>
              <h1 className="text-2xl font-bold text-surface-900">Notification Center</h1>
              <p className="text-sm text-surface-500 mt-0.5">Emergency alerts, donor responses, and appointment updates.</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead(currentUser?.id)}
                className="btn btn-md btn-secondary self-start sm:self-auto">
                <CheckCheck className="w-4 h-4 text-blood-700" />Mark All Read
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mt-5 flex-wrap">
            {filters.map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`btn btn-sm transition-all ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState icon={Bell} title="No notifications here"
              description={filter === 'unread' ? 'You\'re all caught up! No unread notifications.' : 'Notifications will appear here as platform activity occurs.'} />
          ) : (
            filtered.map(n => {
              const isUnread = !n.read && !n.is_read;
              const cfg = typeConfig[n.type] || typeConfig.update;
              const Icon = cfg.icon;
              return (
                <motion.div key={n.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 24, scale: 0.98 }}
                  onClick={() => markAsRead(n.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    isUnread ? `${cfg.bg} ${cfg.border}` : 'bg-white border-surface-100 opacity-80'
                  } hover:shadow-card`}
                >
                  <div className={`w-10 h-10 rounded-xl ${isUnread ? 'bg-white/70' : 'bg-surface-100'} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${isUnread ? cfg.iconCls : 'text-surface-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-semibold ${isUnread ? 'text-surface-900' : 'text-surface-600'}`}>{n.title}</p>
                        <p className="text-sm text-surface-500 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {isUnread && <span className="w-2 h-2 rounded-full bg-blood-600 flex-shrink-0 mt-1" />}
                        <button onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="p-1 rounded hover:bg-surface-200 text-surface-300 hover:text-surface-600 transition opacity-0 group-hover:opacity-100">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-surface-400">{timeAgo(n.created_at || n.timestamp)}</span>
                      {(n.urgent || n.type === 'emergency') && <span className="badge badge-danger text-[10px]">Emergency</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
