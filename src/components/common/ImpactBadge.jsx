import React from 'react';
import { Heart, Award, Shield, Droplets } from 'lucide-react';

export const ImpactBadge = ({ title = 'Life Saver', subtitle = '', type = 'lifesaver' }) => {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      {/* Outer rosette badge */}
      <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-blood-700/60 p-1 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm bg-blood-50/50">
        <div className="w-13 h-13 rounded-full border border-blood-800 bg-gradient-to-br from-blood-700 to-blood-900 flex items-center justify-center text-white shadow-inner">
          {type === 'lifesaver' ? (
            <div className="relative flex items-center justify-center">
              <Heart className="w-6 h-6 fill-white text-white drop-shadow-sm" />
              <svg viewBox="0 0 24 24" className="w-4 h-4 absolute text-blood-900 fill-none stroke-current stroke-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l2-3 3 6 2-4 2 2h4" />
              </svg>
            </div>
          ) : (
            <Award className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      <span className="mt-2 text-xs font-bold text-slate-800 text-center tracking-tight">
        {title}
      </span>
      {subtitle && (
        <span className="text-[10px] text-slate-500 text-center">
          {subtitle}
        </span>
      )}
    </div>
  );
};
