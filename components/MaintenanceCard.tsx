
import React from 'react';
import { MaintenanceItem } from '../types';

interface MaintenanceCardProps {
  item: MaintenanceItem;
  totalOdometer: number;
  onReset: (id: number) => void;
}

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ item, totalOdometer, onReset }) => {
  const isNumeric = typeof item.recommendedRange === 'number';
  const trip = totalOdometer - item.lastServiceOdometer;
  const progress = isNumeric ? Math.min(100, (trip / (item.recommendedRange as number)) * 100) : 0;
  
  let statusColor = 'text-zinc-400';
  let barColor = 'bg-zinc-600';
  let statusText = 'Normal';

  if (isNumeric) {
    const range = item.recommendedRange as number;
    if (trip >= range) {
      statusColor = 'text-red-600';
      barColor = 'bg-red-600';
      statusText = 'Overdue';
    } else if (trip >= range * 0.8) {
      statusColor = 'text-amber-500';
      barColor = 'bg-amber-500';
      statusText = 'Critical';
    }
  } else {
    statusText = 'Regular';
    statusColor = 'text-zinc-500';
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-red-900/50 transition-all shadow-xl group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <div className="max-w-[70%]">
          <h3 className="font-bold text-zinc-100 group-hover:text-red-500 transition-colors uppercase text-sm tracking-tight">
            {item.component}
          </h3>
          <p className="text-[10px] text-zinc-600 mt-1 font-bold uppercase tracking-widest">
            Interval: {isNumeric ? `${item.recommendedRange} km` : 'Service Check'}
          </p>
        </div>
        <div className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-black/50 ${statusColor} border border-zinc-800`}>
          {statusText}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest">
          <span className="text-zinc-600">Usage: <span className="mono text-zinc-300">{trip} km</span></span>
          {isNumeric && <span className={`${statusColor} mono`}>{Math.round(progress)}%</span>}
        </div>
        <div className="w-full bg-black rounded-full h-1.5 overflow-hidden border border-zinc-800">
          <div 
            className={`${barColor} h-full transition-all duration-700 ease-in-out`} 
            style={{ width: `${isNumeric ? progress : 100}%` }}
          />
        </div>
      </div>

      <button 
        onClick={() => onReset(item.id)}
        className="w-full py-2 bg-zinc-800 hover:bg-red-700 text-zinc-200 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95"
      >
        Log Service
      </button>
    </div>
  );
};
