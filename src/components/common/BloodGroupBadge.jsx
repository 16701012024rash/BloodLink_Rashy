import React from 'react';

export const BloodGroupBadge = ({ group, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-extrabold',
    xl: 'w-16 h-16 text-xl font-black'
  };

  const isNegative = group && group.includes('-');

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl shrink-0 transition-transform hover:scale-105 shadow-sm border ${
        isNegative 
          ? 'bg-gradient-to-br from-blood-800 to-blood-900 text-white border-blood-700' 
          : 'bg-blood-50 text-blood-800 border-blood-200'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      title={`Blood Group: ${group}`}
    >
      <span className="tracking-tight">{group}</span>
    </div>
  );
};
