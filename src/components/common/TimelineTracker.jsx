import React from 'react';

export const TimelineTracker = ({ milestones = [] }) => {
  return (
    <div className="w-full py-4 overflow-x-auto">
      <div className="min-w-[500px] relative px-6 py-6">
        {/* Connecting Axis Line */}
        <div className="absolute top-1/2 left-4 right-8 h-0.5 bg-blood-800 -translate-y-1/2" />
        
        {/* Right Arrowhead */}
        <div className="absolute top-1/2 right-4 -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-blood-800" />

        {/* Milestones */}
        <div className="relative flex justify-between items-center z-10">
          {milestones.map((item, index) => {
            const isAbove = index % 2 === 0;
            return (
              <div key={index} className="flex flex-col items-center relative group">
                {/* Text Above */}
                <div
                  className={`text-center mb-3 h-10 flex flex-col justify-end transition-transform group-hover:-translate-y-0.5 ${
                    isAbove ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-800 leading-tight block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-blood-800 font-semibold block">
                    {item.date}
                  </span>
                </div>

                {/* Node Circle on Line */}
                <div className="w-4 h-4 rounded-full bg-blood-800 border-2 border-white shadow-sm ring-2 ring-blood-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Text Below */}
                <div
                  className={`text-center mt-3 h-10 flex flex-col justify-start transition-transform group-hover:translate-y-0.5 ${
                    !isAbove ? 'opacity-100' : 'opacity-0 select-none pointer-events-none'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-800 leading-tight block">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-blood-800 font-semibold block">
                    {item.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
