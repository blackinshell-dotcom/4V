
import React from 'react';

interface ThreatAlertBoxProps {
  alertCount: number;
}

export const ThreatAlertBox: React.FC<ThreatAlertBoxProps> = ({ alertCount }) => {
  const hasAlerts = alertCount > 0;
  const statusColor = hasAlerts ? 'text-red-500' : 'text-emerald-400';
  const glowColor = hasAlerts ? 'bg-red-500' : 'bg-emerald-500';
  const borderColor = hasAlerts ? 'border-red-900/30' : 'border-zinc-900';

  return (
    <div className="relative group flex-1 min-w-[360px] h-full">
      {/* Background Container */}
      <div className={`relative h-full bg-[#030303] border ${borderColor} rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 flex flex-col shadow-2xl overflow-hidden`}>
        
        {/* Top Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[11px] font-black uppercase tracking-tighter text-zinc-500 select-none">System Telemetry</h2>
            <span className={`text-[12px] font-black uppercase tracking-tighter ${statusColor} animate-pulse`}>
              {hasAlerts ? 'Critical Threat' : 'Nominal Status'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <div className={`w-2.5 h-2.5 rounded-full ${glowColor} shadow-[0_0_12px_rgba(16,185,129,0.5)] ${hasAlerts ? 'animate-ping' : 'animate-pulse'}`} />
            {/* Signal Bars Graphic */}
            <div className="flex gap-[3px] items-end h-4 opacity-20">
              <div className="w-[2px] h-1.5 bg-zinc-400 rounded-full" />
              <div className="w-[2px] h-3.5 bg-zinc-400 rounded-full" />
              <div className="w-[2px] h-2.5 bg-zinc-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Center Display Area */}
        <div className="flex items-center gap-8 py-4">
          {/* Dashed Gauge */}
          <div className="relative flex items-center justify-center w-28 h-28">
            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${hasAlerts ? 'border-red-900/40' : 'border-zinc-800/60'} animate-[spin_12s_linear_infinite]`} />
            <div className="flex items-center gap-1">
              {alertCount.toString().padStart(2, '0').split('').map((digit, i) => (
                <div key={i} className="relative flex flex-col items-center">
                  <span className={`text-5xl font-black mono tracking-tighter leading-none ${hasAlerts ? 'text-red-600' : 'text-zinc-800'}`}>
                    {digit}
                  </span>
                  {/* Digital dot indicator within digit */}
                  <div className={`w-1 h-1 rounded-full absolute top-1/2 -translate-y-1/2 opacity-40 ${hasAlerts ? 'bg-red-500' : 'bg-zinc-600'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Descriptive Text */}
          <div className="flex flex-col gap-1.5 flex-1">
            <h3 className="text-[13px] font-black text-zinc-200 uppercase tracking-tight leading-tight">
              {hasAlerts ? 'Immediate Action Required' : 'All Systems Verified'}
            </h3>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tight leading-relaxed">
              {hasAlerts 
                ? 'COMPONENTS EXCEEDED SAFETY THRESHOLDS. TELEMETRY DETECTED WEAR ANOMALIES.' 
                : 'MAINTENANCE INTERVALS WITHIN PROJECTED SAFETY ENVELOPES.'}
            </p>
          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-auto pt-8">
          <div className="h-[1px] w-full bg-zinc-900/60 mb-8" />
          
          <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl border ${hasAlerts ? 'border-red-600/20 bg-red-600/5' : 'border-zinc-800 bg-zinc-900/20'} transition-all`}>
            <div className={`p-1 rounded-full border ${hasAlerts ? 'border-red-500 text-red-500' : 'border-zinc-700 text-zinc-600'}`}>
              {hasAlerts ? (
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${hasAlerts ? 'text-red-500' : 'text-zinc-600'}`}>
              {hasAlerts ? 'Threat Detected' : 'Telemetry Secure'}
            </span>
          </div>
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-5">
           <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
             <path d="M40 0H30V2H38V10H40V0Z" fill="white"/>
           </svg>
        </div>
      </div>
    </div>
  );
};
