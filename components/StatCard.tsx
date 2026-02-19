
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass = 'text-red-500' }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-lg transition-all hover:border-zinc-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-zinc-800 ${colorClass}`}>
          {icon}
        </div>
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={`text-2xl font-bold mono ${colorClass}`}>
        {value}
      </div>
    </div>
  );
};
