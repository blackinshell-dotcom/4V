
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MaintenanceItem, MileageEntry } from '../types';

interface MaintenanceMatrixProps {
  items: MaintenanceItem[];
  totalOdometer: number;
  onReset: (id: number) => void;
  onManualTripUpdate?: (id: number, trip: number) => void;
  onManualIntervalUpdate?: (id: number, interval: number) => void;
  history: MileageEntry[];
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export const MaintenanceMatrix: React.FC<MaintenanceMatrixProps> = ({ 
  items, 
  totalOdometer, 
  onReset, 
  onManualTripUpdate,
  onManualIntervalUpdate,
  history, 
  selectedYear, 
  onYearChange 
}) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  const [editingTripId, setEditingTripId] = useState<number | null>(null);
  const [editTripVal, setEditTripVal] = useState("");
  
  const [editingIntervalId, setEditingIntervalId] = useState<number | null>(null);
  const [editIntervalVal, setEditIntervalVal] = useState("");
  
  const tripInputRef = useRef<HTMLInputElement>(null);
  const intervalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTripId !== null && tripInputRef.current) {
      tripInputRef.current.focus();
      tripInputRef.current.select();
    }
  }, [editingTripId]);

  useEffect(() => {
    if (editingIntervalId !== null && intervalInputRef.current) {
      intervalInputRef.current.focus();
      intervalInputRef.current.select();
    }
  }, [editingIntervalId]);

  const handleStartTripEdit = (id: number, currentTrip: number) => {
    setEditingTripId(id);
    setEditTripVal(currentTrip.toString());
  };

  const handleSaveTripEdit = () => {
    if (editingTripId !== null && onManualTripUpdate) {
      const newVal = parseInt(editTripVal);
      if (!isNaN(newVal) && newVal >= 0) {
        onManualTripUpdate(editingTripId, newVal);
      }
    }
    setEditingTripId(null);
  };

  const handleStartIntervalEdit = (id: number, currentInterval: number | 'Master Service') => {
    if (typeof currentInterval === 'string') return;
    setEditingIntervalId(id);
    setEditIntervalVal(currentInterval.toString());
  };

  const handleSaveIntervalEdit = () => {
    if (editingIntervalId !== null && onManualIntervalUpdate) {
      const newVal = parseInt(editIntervalVal);
      if (!isNaN(newVal) && newVal > 0) {
        onManualIntervalUpdate(editingIntervalId, newVal);
      }
    }
    setEditingIntervalId(null);
  };

  const annualTotal = useMemo(() => {
    const yearEntries = history
      .filter(h => h.date.startsWith(selectedYear.toString()))
      .sort((a, b) => a.date.localeCompare(b.date));
      
    if (yearEntries.length === 0) return 0;
    
    const previousEntries = history
      .filter(h => h.date < `${selectedYear}-01-01`)
      .sort((a, b) => b.date.localeCompare(a.date));
      
    const baseline = previousEntries.length > 0 ? previousEntries[0].value : yearEntries[0].value;
    const lastValue = yearEntries[yearEntries.length - 1].value;
    
    return Math.max(0, lastValue - baseline);
  }, [history, selectedYear]);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthStr = (i + 1).toString().padStart(2, '0');
    const monthYear = `${selectedYear}-${monthStr}`;
    
    const entriesInMonth = history
      .filter(h => h.date.startsWith(monthYear))
      .sort((a, b) => a.date.localeCompare(b.date));
      
    const previousEntries = history
      .filter(h => h.date < `${monthYear}-01`)
      .sort((a, b) => b.date.localeCompare(a.date));
      
    if (entriesInMonth.length === 0) return 0;
    
    const startVal = previousEntries.length > 0 ? previousEntries[0].value : entriesInMonth[0].value;
    const endVal = entriesInMonth[entriesInMonth.length - 1].value;
    
    return Math.max(0, endVal - startVal);
  });

  const maxVal = Math.max(...monthlyData, 100);
  const rangeSteps = [0, 25, 50, 75, 100].map(p => Math.round(maxVal * (p/100)));
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const years = Array.from({ length: 11 }, (_, i) => 2026 + i); 

  return (
    <div className="space-y-10">
      {/* Odometer Chart Section */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex flex-col">
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">
              <span className="text-white">TOTAL KM IN {selectedYear} - </span>
              <span className="text-red-600 mono animate-glow-red whitespace-nowrap">{annualTotal} KM</span>
            </h2>
            <p className="text-[11px] text-zinc-600 font-black uppercase tracking-tighter mt-3">Telemetry Archive: {selectedYear}</p>
          </div>
          
          <div className="relative w-full md:w-auto z-[110]">
            <button 
              onClick={() => setShowYearPicker(!showYearPicker)}
              className="w-full md:w-auto px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white font-black text-[10px] tracking-tighter uppercase hover:border-red-600 transition-all flex items-center justify-between md:justify-center gap-3 active:scale-95 shadow-xl"
            >
              YEAR: {selectedYear}
              <svg className={`w-3 h-3 transition-transform duration-300 ${showYearPicker ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showYearPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowYearPicker(false)} />
                <div className="absolute left-0 md:right-0 mt-3 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[120] max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 divide-y divide-zinc-800">
                    {years.map(y => (
                      <button
                        key={y}
                        onClick={() => {
                          onYearChange(y);
                          setShowYearPicker(false);
                        }}
                        className={`px-6 py-4 text-[10px] font-black tracking-tighter uppercase text-left transition-colors ${
                          selectedYear === y ? 'bg-red-600 text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Chart Wrapper */}
        <div className="overflow-x-auto pb-6 -mx-2 px-2 scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-zinc-900">
          <div className="flex gap-4 md:gap-8 items-end h-80 relative min-w-[700px] mt-6">
            {/* Y-Axis Labels */}
            <div className="flex flex-col justify-between h-full pr-6 border-r border-zinc-900 text-[10px] font-black text-zinc-700 mono text-right min-w-[60px] pb-10">
               {rangeSteps.slice().reverse().map((step, i) => (
                 <div key={i} className="flex items-center justify-end gap-3">
                   <span>{step}</span>
                   <span className="w-2 h-[1px] bg-zinc-900"></span>
                 </div>
               ))}
            </div>

            {/* Bars Area */}
            <div className="flex-grow flex items-end gap-3 md:gap-5 h-full pb-10">
              {monthlyData.map((val, idx) => {
                const height = val > 0 ? (val / maxVal) * 100 : 1;
                const isCurrentMonth = new Date().getMonth() === idx && new Date().getFullYear() === selectedYear;
                
                return (
                  <div key={idx} className="flex-1 group relative h-full flex flex-col justify-end">
                    {/* The Bar Wrapper - Controls height for both label and bar */}
                    <div className="relative w-full flex flex-col justify-end" style={{ height: `${height}%` }}>
                      {/* Value Label - Positioned relative to the bar top */}
                      {val > 0 && (
                        <div className="absolute bottom-full mb-2 left-0 right-0 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                          <span className="text-[11px] font-black text-white mono whitespace-nowrap tracking-tighter">
                            {val}
                          </span>
                        </div>
                      )}
                      
                      {/* The Bar */}
                      <div 
                        className={`w-full h-full rounded-t-sm transition-all duration-1000 ease-out border-t-2 border-x border-red-500/30 ${
                          val > 0 
                            ? 'bg-red-600/40 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.1)]'
                            : 'bg-zinc-900/20 border-transparent'
                        }`}
                      />
                    </div>
                    
                    {/* Month Label */}
                    <div className={`absolute top-full mt-6 left-0 right-0 text-[11px] font-black text-center tracking-tighter transition-colors uppercase whitespace-nowrap ${
                      isCurrentMonth ? 'text-red-500 underline underline-offset-8 decoration-2' : 'text-zinc-600 group-hover:text-white'
                    }`}>
                      {months[idx]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex justify-center mt-4">
          <div className="flex gap-1">
            <div className="w-8 h-1 rounded-full bg-zinc-900 overflow-hidden">
               <div className="h-full bg-red-600 animate-[shimmer_2s_infinite]" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Components Table Section */}
      <div className="overflow-x-auto rounded-[2.5rem] border border-zinc-900 bg-[#050505] shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-transparent text-[11px] uppercase tracking-tighter text-zinc-500 border-b border-red-600/50">
              <th className="px-10 py-10 font-black">Component</th>
              <th className="px-10 py-10 font-black">Interval (Edit)</th>
              <th className="px-10 py-10 font-black">Current (Edit)</th>
              <th className="px-10 py-10 font-black">Status</th>
              <th className="px-10 py-10 font-black text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/40">
            {items.map((item) => {
              const isNumeric = typeof item.recommendedRange === 'number';
              const trip = totalOdometer - item.lastServiceOdometer;
              const progress = isNumeric ? Math.min(100, (trip / (item.recommendedRange as number)) * 100) : 0;
              
              const isOverdue = isNumeric && progress >= 80;
              const currentValColor = isOverdue ? 'text-red-500' : 'text-emerald-400';
              const progressValColor = isOverdue ? 'text-red-500' : 'text-zinc-400';
              const barColor = isOverdue 
                ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' 
                : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';

              return (
                <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors group">
                  <td className="px-10 py-8">
                    <span className="text-[13px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-tight whitespace-nowrap">
                      {item.component}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    {editingIntervalId === item.id ? (
                      <input
                        ref={intervalInputRef}
                        type="number"
                        value={editIntervalVal}
                        onChange={(e) => setEditIntervalVal(e.target.value)}
                        onBlur={handleSaveIntervalEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveIntervalEdit();
                          if (e.key === 'Escape') setEditingIntervalId(null);
                        }}
                        className="w-24 bg-zinc-900 border border-red-600 text-sm mono text-white px-2 py-1 rounded focus:outline-none"
                      />
                    ) : (
                      <button 
                        onClick={() => handleStartIntervalEdit(item.id, item.recommendedRange)}
                        className={`text-sm mono font-black px-2 py-1 rounded hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800 text-zinc-100 whitespace-nowrap`}
                      >
                        {isNumeric ? `${item.recommendedRange} km` : 'MASTER'}
                      </button>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    {editingTripId === item.id ? (
                      <input
                        ref={tripInputRef}
                        type="number"
                        value={editTripVal}
                        onChange={(e) => setEditTripVal(e.target.value)}
                        onBlur={handleSaveTripEdit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTripEdit();
                          if (e.key === 'Escape') setEditingTripId(null);
                        }}
                        className="w-24 bg-zinc-900 border border-red-600 text-sm mono text-white px-2 py-1 rounded focus:outline-none"
                      />
                    ) : (
                      <button 
                        onClick={() => handleStartTripEdit(item.id, trip)}
                        className={`text-sm mono font-black px-2 py-1 rounded hover:bg-zinc-900/50 transition-colors border border-transparent hover:border-zinc-800 whitespace-nowrap ${currentValColor}`}
                      >
                        {trip} km
                      </button>
                    )}
                  </td>
                  <td className="px-10 py-8 w-64">
                    {isNumeric ? (
                      <div className="flex items-center gap-5">
                        <div className="flex-grow bg-black rounded-full h-[6px] overflow-hidden border border-zinc-900">
                          <div 
                            className={`${barColor} h-full transition-all duration-1000 ease-out`} 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className={`text-[11px] mono font-black w-10 text-right ${progressValColor}`}>{Math.round(progress)}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter whitespace-nowrap">Service Cycle</span>
                      </div>
                    )}
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button 
                      onClick={() => onReset(item.id)}
                      className="text-[9px] font-black uppercase tracking-widest px-5 py-2.5 bg-zinc-900 hover:bg-red-700 hover:text-white text-zinc-600 rounded-xl transition-all active:scale-95 border border-zinc-800 hover:border-red-600 shadow-lg whitespace-nowrap"
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #09090b;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
};
