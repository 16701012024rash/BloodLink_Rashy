import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  Droplet, 
  CheckCircle2, 
  Calendar, 
  Trash2, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotification();
  const [filter, setFilter] = useState('all'); // all, unread, emergency

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'emergency') return n.type === 'emergency' || n.urgent;
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-blood-50 text-blood-800 text-[11px] font-bold px-3 py-1 rounded-full mb-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Real-Time Notifications</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Notification Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Stay alerted on matching emergency cases, donor responses, and donation eligibility.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center space-x-1.5 bg-white border border-surface-300 hover:bg-surface-100 text-slate-700 px-4 py-2 rounded-full text-xs font-bold transition shadow-xs self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 text-blood-800" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === 'all'
                ? 'bg-blood-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-surface-100'
            }`}
          >
            All Notifications ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === 'unread'
                ? 'bg-blood-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-surface-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('emergency')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              filter === 'emergency'
                ? 'bg-blood-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-surface-100'
            }`}
          >
            🚨 Emergency Alerts
          </button>
        </div>

        {/* Notification Cards List */}
        <div className="space-y-3">
          {filteredNotifs.length > 0 ? (
            filteredNotifs.map(n => {
              const isEmergency = n.type === 'emergency' || n.urgent;
              const isMatch = n.type === 'match';

              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-5 rounded-3xl border transition-all duration-200 flex items-start justify-between gap-4 cursor-pointer ${
                    !n.read
                      ? 'bg-white border-blood-200 shadow-md ring-1 ring-blood-100'
                      : 'bg-white/80 border-surface-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon container */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        isEmergency
                          ? 'bg-red-100 text-red-600 animate-pulse'
                          : isMatch
                          ? 'bg-blood-100 text-blood-800'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {isEmergency ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : isMatch ? (
                        <Droplet className="w-5 h-5 fill-current" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-blood-600" />
                        )}
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                        {n.message}
                      </p>

                      <div className="flex items-center space-x-3 mt-2 text-[10px] text-slate-400">
                        <span>{n.timestamp}</span>
                        {n.actionUrl && (
                          <>
                            <span>•</span>
                            <Link
                              to={n.actionUrl}
                              className="text-blood-800 font-bold hover:underline flex items-center space-x-0.5"
                            >
                              <span>View Details</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-full hover:bg-red-50 transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-surface-200">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No notifications</h3>
              <p className="text-xs text-slate-400 mt-1">You are all caught up on alerts and updates.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
