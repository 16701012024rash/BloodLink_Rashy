import React from 'react';

export const StatCard = ({ icon: Icon, label, value, highlight = false, badgeText }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-surface-200 shadow-sm hover:shadow-card transition-all duration-200 flex items-center space-x-4">
      {/* Circular icon container with soft red background */}
      <div className="w-13 h-13 rounded-2xl bg-blood-100 flex items-center justify-center shrink-0 text-blood-800">
        <Icon className="w-6 h-6 stroke-[2]" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-slate-500 block truncate">
          {label}
        </span>
        <div className="flex items-center space-x-2 mt-0.5">
          <span className={`text-lg sm:text-xl font-bold truncate ${highlight ? 'text-blood-800' : 'text-slate-900'}`}>
            {value}
          </span>
          {badgeText && (
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800">
              {badgeText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
