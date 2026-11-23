import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Heart, FileText, Bell, User, Settings,
  Droplet, ShieldCheck, Clock, AlertTriangle, Plus,
  CheckCircle2, XCircle, Activity, Award, MapPin, Phone, Mail,
  Edit3, Save, X, ChevronRight, Loader2, ToggleLeft, ToggleRight, Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBloodRequest } from '../context/BloodRequestContext';
import { useNotification } from '../context/NotificationContext';
import {
  Tabs, StatDisplay, BloodBadge, EmptyState, SkeletonCard,
  ProgressBar, Alert, LiveDot
} from '../components/ui/index.jsx';
import { RequestCard } from '../components/cards/RequestCard';
import { isSupabaseConfigured } from '../services/supabaseClient';

const DASH_TABS = [
  { id: 'overview',  label: 'Overview',         icon: LayoutDashboard },
  { id: 'donor',     label: 'Donor Activity',   icon: Heart },
  { id: 'requests',  label: 'Blood Requests',   icon: Droplet },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile',   label: 'My Profile',       icon: User },
  { id: 'settings',  label: 'Settings',         icon: Settings },
];

/* ════════════════════════════════════════════
   OVERVIEW TAB
   ════════════════════════════════════════════ */
const OverviewTab = ({ user, stats, requests, notifications, onToggleAvailability }) => {
  const isMyReq = (r) => (user?.id && r.requester_id === user.id) || (user?.email && (r.requesterEmail === user.email || r.requester?.email === user.email));
  const myActiveRequests = requests.filter(r => isMyReq(r) && (r.status === 'Pending' || r.request_status === 'Pending'));
  const unreadNotifs = notifications.filter(n => !n.read && !n.is_read).length;
  const profilePct = [user?.full_name || user?.name, user?.email, user?.phone, user?.bloodGroup, user?.city].filter(Boolean).length * 20;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-navy-300 text-sm mb-1">Welcome back,</p>
            <h2 className="text-2xl font-black">{user?.full_name || user?.name || 'User'} 👋</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {user?.isDonor && <span className="badge bg-blood-800/40 border border-blood-600/30 text-blood-300 text-xs"><Heart className="w-3 h-3 fill-current" />Active Donor</span>}
              {user?.isAdmin && <span className="badge bg-warning-500/20 border border-warning-500/30 text-warning-300 text-xs"><ShieldCheck className="w-3 h-3" />Administrator</span>}
              <LiveDot status={isSupabaseConfigured ? 'live' : 'sandbox'} label={isSupabaseConfigured ? 'Cloud Connected' : 'Sandbox Mode'} />
            </div>
          </div>
          {user?.isDonor && (
            <button onClick={onToggleAvailability} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              user.isAvailable ? 'bg-success-500/20 border-success-500/30 text-success-300 hover:bg-success-500/30' : 'bg-surface-500/20 border-surface-500/30 text-surface-400 hover:bg-surface-500/30'
            }`}>
              {user.isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {user.isAvailable ? 'Available' : 'Unavailable'}
            </button>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatDisplay label="Total Donors" value={stats.totalDonors} icon={Heart} color="blood" sublabel="Registered" />
        <StatDisplay label="Active Requests" value={stats.activeRequests} icon={Activity} color={stats.activeRequests > 0 ? 'danger' : 'default'} sublabel="Pending matches" />
        <StatDisplay label="Lives Impacted" value={stats.fulfilledRequests} icon={CheckCircle2} color="success" sublabel="Requests fulfilled" />
        <StatDisplay label="Notifications" value={unreadNotifs} icon={Bell} color={unreadNotifs > 0 ? 'warning' : 'default'} sublabel="Unread alerts" />
      </div>

      {/* Profile completion */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-surface-900">Profile Completion</h3>
          <span className="text-sm font-black text-blood-800 num-display">{profilePct}%</span>
        </div>
        <ProgressBar value={profilePct} color={profilePct === 100 ? 'success' : 'blood'} size="md" />
        {profilePct < 100 && (
          <p className="text-xs text-surface-400 mt-2">Complete your profile to increase donor match priority.</p>
        )}
      </div>

      {/* My active requests */}
      {myActiveRequests.length > 0 && (
        <div>
          <h3 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blood-500 animate-pulse" />My Active Requests
          </h3>
          <div className="space-y-3">
            {myActiveRequests.slice(0, 2).map(r => <RequestCard key={r.id} request={r} />)}
          </div>
        </div>
      )}

      {/* Donor info (if donor) */}
      {user?.isDonor && user?.donorProfile && (
        <div className="card p-5">
          <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2"><Heart className="w-4 h-4 text-blood-700" />Donor Profile</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Blood Group', value: <BloodBadge group={user.bloodGroup} size="sm" /> },
              { label: 'Total Donations', value: user.donorProfile.total_donations ?? 0 },
              { label: 'Lives Impacted', value: user.donorProfile.lives_impacted ?? 0 },
              { label: 'Verification', value: user.donorProfile.verification_status === 'verified' ? '✓ Verified' : 'Pending' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-black text-surface-900 num-display flex justify-center">{s.value}</div>
                <div className="text-xs text-surface-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   DONOR ACTIVITY TAB
   ════════════════════════════════════════════ */
const DonorTab = ({ user, requests, onAccept, onDecline, onToggleAvailability }) => {
  // Show active requests from other users
  const isMine = (r) => (user?.id && r.requester_id === user.id) || (user?.email && (r.requesterEmail === user.email || r.requester?.email === user.email));
  const incomingRequests = requests.filter(r => (r.status === 'Pending' || r.request_status === 'Pending') && !isMine(r));

  if (!user?.isDonor) {
    return (
      <div className="card p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blood-50 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-blood-600" />
        </div>
        <h3 className="font-bold text-surface-900 mb-2">You're not registered as a donor yet</h3>
        <p className="text-sm text-surface-500 mb-5">Register as a donor to start receiving emergency blood requests and save lives in your community.</p>
        <Link to="/dashboard?tab=profile" className="btn btn-md btn-primary inline-flex">
          <Heart className="w-4 h-4 fill-current" />Register as Donor
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Availability toggle card */}
      <div className={`card p-5 ${user.isAvailable ? 'border-success-200' : 'border-surface-200'}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-surface-900">Donor Availability</h3>
            <p className="text-sm text-surface-500 mt-0.5">
              {user.isAvailable ? 'You\'re currently available to receive donation requests.' : 'You\'re currently unavailable. Toggle to receive requests.'}
            </p>
          </div>
          <button onClick={onToggleAvailability}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              user.isAvailable ? 'bg-success-500 text-white hover:bg-success-600 shadow-glow-green' : 'bg-surface-200 text-surface-600 hover:bg-surface-300'
            }`}>
            {user.isAvailable ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            {user.isAvailable ? 'Available' : 'Unavailable'}
          </button>
        </div>
      </div>

      {/* Verification */}
      <div className={`card p-4 flex items-center gap-3 ${user.donorProfile?.verification_status === 'verified' ? 'border-success-200 bg-success-50' : 'border-warning-200 bg-warning-50'}`}>
        {user.donorProfile?.verification_status === 'verified' ? (
          <><ShieldCheck className="w-5 h-5 text-success-600 flex-shrink-0" /><div><p className="text-sm font-semibold text-success-800">Identity Verified</p><p className="text-xs text-success-600">Your donor profile is verified and prioritized in search results.</p></div></>
        ) : (
          <><AlertTriangle className="w-5 h-5 text-warning-600 flex-shrink-0" /><div><p className="text-sm font-semibold text-warning-800">Verification Pending</p><p className="text-xs text-warning-600">Upload your ID/medical documents in Profile to get verified.</p></div></>
        )}
      </div>

      {/* Incoming requests */}
      <div>
        <h3 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
          Incoming Requests
          {incomingRequests.length > 0 && <span className="badge badge-danger text-xs">{incomingRequests.length} new</span>}
        </h3>
        {incomingRequests.length === 0 ? (
          <EmptyState icon={Heart} title="No incoming requests" description="When a blood request matches your blood group and location, it will appear here." />
        ) : (
          <div className="space-y-3">
            {incomingRequests.map(r => (
              <RequestCard key={r.id} request={r} showActions
                onAccept={(id) => onAccept(id, { id: user.id, name: user.name || user.full_name, bloodGroup: user.bloodGroup, phone: user.phone })}
                onDecline={(id) => onDecline(id, user.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   BLOOD REQUESTS TAB
   ════════════════════════════════════════════ */
const RequestsTab = ({ user, requests, onCancel }) => {
  const [filter, setFilter] = useState('active');
  const isMine = (r) => (user?.id && r.requester_id === user.id) || (user?.email && (r.requesterEmail === user.email || r.requester?.email === user.email));
  const myRequests = requests.filter(isMine);
  const active = myRequests.filter(r => r.status === 'Pending' || r.request_status === 'Pending' || r.status?.includes('In Progress'));
  const completed = myRequests.filter(r => r.status === 'Completed' || r.request_status === 'Fulfilled');
  const cancelled = myRequests.filter(r => r.status === 'Cancelled');

  const displayed = filter === 'active' ? active : filter === 'completed' ? completed : cancelled;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-2">
          {[{ id: 'active', label: `Active (${active.length})` }, { id: 'completed', label: `Completed (${completed.length})` }, { id: 'cancelled', label: `Cancelled (${cancelled.length})` }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}>{f.label}</button>
          ))}
        </div>
        <Link to="/emergency-request" className="btn btn-md btn-primary">
          <Plus className="w-4 h-4" />New Request
        </Link>
      </div>

      {displayed.length === 0 ? (
        <EmptyState icon={Droplet} title={`No ${filter} requests`}
          description={filter === 'active' ? 'Your active blood requests will appear here.' : `No ${filter} requests found.`}
          action={filter === 'active' && <Link to="/emergency-request" className="btn btn-md btn-primary"><Plus className="w-4 h-4" />Create Request</Link>} />
      ) : (
        <div className="space-y-3">
          {displayed.map(r => (
            <RequestCard key={r.id} request={r} showActions={filter === 'active'} onCancel={filter === 'active' ? onCancel : undefined} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   PROFILE TAB
   ════════════════════════════════════════════ */
const ProfileTab = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.full_name || user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    state: user?.state || '',
    bloodGroup: user?.bloodGroup || '',
    locality: user?.locality || '',
    pincode: user?.pincode || '',
  });

  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-crimson flex items-center justify-center text-white font-black text-2xl shadow-blood">
              {(user?.full_name || user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-surface-900">{user?.full_name || user?.name}</h2>
              <p className="text-sm text-surface-500">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {user?.isDonor && <BloodBadge group={user.bloodGroup} size="sm" />}
                {user?.donorProfile?.verification_status === 'verified' && <span className="badge badge-success text-xs"><ShieldCheck className="w-3 h-3" />Verified</span>}
              </div>
            </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn btn-sm btn-secondary"><Edit3 className="w-4 h-4" />Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)} className="btn btn-sm btn-ghost"><X className="w-4 h-4" />Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn btn-sm btn-primary">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form fields */}
      <div className="card p-6 space-y-5">
        <h3 className="font-bold text-surface-900">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
            { label: 'Phone Number', key: 'phone', placeholder: '+91 98765 43210' },
            { label: 'City', key: 'city', placeholder: 'New Delhi' },
            { label: 'State', key: 'state', placeholder: 'Delhi' },
            { label: 'Locality / Area', key: 'locality', placeholder: 'Connaught Place' },
            { label: 'PIN Code', key: 'pincode', placeholder: '110001' },
          ].map(f => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              {editing ? (
                <input value={form[f.key]} onChange={e => setF(f.key, e.target.value)} placeholder={f.placeholder} className="input" />
              ) : (
                <div className="px-3.5 py-2.5 text-sm bg-surface-50 rounded-lg border border-surface-200 text-surface-800">
                  {form[f.key] || <span className="text-surface-400 italic">Not set</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Blood Group */}
        <div>
          <label className="label">Blood Group</label>
          {editing ? (
            <div className="grid grid-cols-4 gap-2">
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                <button key={bg} type="button" onClick={() => setF('bloodGroup', bg)}
                  className={`py-2.5 rounded-xl text-sm font-black transition-all ${form.bloodGroup === bg ? 'bg-blood-800 text-white shadow-blood' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}>
                  {bg}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {form.bloodGroup ? <BloodBadge group={form.bloodGroup} size="md" /> : <span className="text-surface-400 text-sm italic">Not set</span>}
            </div>
          )}
        </div>
      </div>

      {/* Email (read-only) */}
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-surface-400" />
          <div>
            <p className="text-xs text-surface-400 font-semibold uppercase tracking-wide">Email (Account)</p>
            <p className="text-sm font-medium text-surface-800">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   NOTIFICATIONS TAB
   ════════════════════════════════════════════ */
const NotificationsTab = ({ notifications, markAsRead, markAllAsRead, userId }) => {
  const unread = notifications.filter(n => !n.read && !n.is_read).length;
  const typeClasses = {
    emergency: 'bg-blood-50 border-blood-200',
    match: 'bg-blue-50 border-blue-200',
    update: 'bg-surface-50 border-surface-200',
    reminder: 'bg-warning-50 border-warning-200',
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-surface-900">Recent Notifications</h3>
        {unread > 0 && <button onClick={() => markAllAsRead(userId)} className="btn btn-sm btn-secondary text-xs">Mark all read</button>}
      </div>
      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="Your notifications will appear here." />
      ) : (
        <div className="space-y-2">
          {notifications.slice(0, 15).map(n => {
            const isUnread = !n.read && !n.is_read;
            return (
              <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-card ${isUnread ? typeClasses[n.type] || typeClasses.update : 'bg-white border-surface-100'}`}>
                <div className="flex items-start gap-3">
                  {isUnread && <span className="w-2 h-2 rounded-full bg-blood-600 mt-1.5 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isUnread ? 'text-surface-900' : 'text-surface-600'}`}>{n.title}</p>
                    <p className="text-xs text-surface-500 mt-0.5 leading-snug">{n.message}</p>
                    <p className="text-xs text-surface-400 mt-1">{n.timestamp || n.created_at}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   SETTINGS TAB
   ════════════════════════════════════════════ */
const SettingsTab = ({ user }) => {
  return (
    <div className="space-y-5">
      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-surface-900">Notification Preferences</h3>
        {[
          { label: 'Emergency blood requests', desc: 'Get notified when a critical request matches your blood group' },
          { label: 'Donor responses', desc: 'Updates when donors respond to your requests' },
          { label: 'Appointment reminders', desc: '24-hour reminder before donation appointments' },
          { label: 'Platform updates', desc: 'BloodLink announcements and new features' },
        ].map(setting => (
          <div key={setting.label} className="flex items-center justify-between gap-4 py-2 border-b border-surface-100 last:border-0">
            <div>
              <p className="text-sm font-semibold text-surface-800">{setting.label}</p>
              <p className="text-xs text-surface-400">{setting.desc}</p>
            </div>
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blood-700 border-surface-300 focus:ring-blood-700 cursor-pointer" />
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h3 className="font-bold text-surface-900 mb-3">Account</h3>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-surface-50 text-sm text-surface-700 font-medium border border-surface-200 transition">Change Password</button>
          <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-danger-50 text-sm text-danger-700 font-medium border border-danger-200 transition">Deactivate Account</button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   MAIN DASHBOARD
   ════════════════════════════════════════════ */
export const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentUser, toggleDonorAvailability, updateProfile } = useAuth();
  const { requests, stats, acceptRequest, declineRequest, cancelRequest } = useBloodRequest();
  const { notifications, markAsRead, markAllAsRead } = useNotification();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (t) => setSearchParams({ tab: t });

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="container-app py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-crimson flex items-center justify-center text-white font-black text-lg shadow-blood">
              {(currentUser?.name || currentUser?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900">My Dashboard</h1>
              <p className="text-xs text-surface-500">{currentUser?.email}</p>
            </div>
          </div>
          <Tabs tabs={DASH_TABS} active={activeTab} onChange={setTab} />
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {activeTab === 'overview' && (
              <OverviewTab user={currentUser} stats={stats} requests={requests} notifications={notifications} onToggleAvailability={toggleDonorAvailability} />
            )}
            {activeTab === 'donor' && (
              <DonorTab user={currentUser} requests={requests} onAccept={acceptRequest} onDecline={declineRequest} onToggleAvailability={toggleDonorAvailability} />
            )}
            {activeTab === 'requests' && (
              <RequestsTab user={currentUser} requests={requests} onCancel={cancelRequest} />
            )}
            {activeTab === 'notifications' && (
              <NotificationsTab notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead} userId={currentUser?.id} />
            )}
            {activeTab === 'profile' && (
              <ProfileTab user={currentUser} onUpdate={updateProfile} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab user={currentUser} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDashboard;
