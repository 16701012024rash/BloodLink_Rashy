import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  User, 
  History, 
  Droplet, 
  Calendar, 
  Settings,
  Bell,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardSidebar = ({ activeTab, setActiveTab }) => {
  const { currentUser, isDonor, isRequester } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutGrid,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
    },
    {
      id: 'history',
      label: isDonor ? 'Donation History' : 'Requests History',
      icon: History,
    },
    {
      id: 'requests',
      label: 'Blood Requests',
      icon: Droplet,
    },
    {
      id: 'appointments',
      label: 'My Appointments',
      icon: Calendar,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 bg-transparent">
      {/* Container matching screenshot */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-sm border border-surface-200 lg:min-h-[550px] flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:block">
            Menu Navigation
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-blood-800 text-white shadow-md shadow-blood-800/20 translate-x-1'
                      : 'text-slate-600 hover:text-blood-800 hover:bg-blood-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blood-800'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Small Bottom Info or Hotline */}
        <div className="hidden lg:block pt-6 border-t border-surface-200 mt-6 px-2">
          <div className="bg-blood-50 p-3.5 rounded-2xl border border-blood-100 text-center">
            <HeartHandshake className="w-6 h-6 text-blood-700 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-800">Need Urgent Help?</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Call 24/7 Coordinator Desk</p>
            <a
              href="tel:108"
              className="mt-2 inline-block bg-blood-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-full hover:bg-blood-900 transition"
            >
              Dial 108
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
