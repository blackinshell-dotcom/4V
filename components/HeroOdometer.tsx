import React from 'react';

interface HeroOdometerProps {
  totalOdometer: number;
  isEditing: boolean;
  editValue: string;
  editDate: string;
  onEditChange: (val: string) => void;
  onDateChange: (val: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onStartEdit: () => void;
}

export const HeroOdometer: React.FC<HeroOdometerProps> = ({
  totalOdometer,
  isEditing,
  editValue,
  editDate,
  onEditChange,
  onDateChange,
  onEditSave,
  onEditCancel,
  onStartEdit,
}) => {
  // Helpers to convert format between ISO (YYYY-MM-DD) and Display (DD/MM/YYYY)
  const toDisplayDate = (iso: string) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const fromDisplayDate = (display: string) => {
    const parts = display.split('/');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m}-${d}`;
    }
    return display;
  };

  const handleDisplayDateChange = (val: string) => {
    // We pass the converted ISO date back to the parent state
    onDateChange(fromDisplayDate(val));
  };

  return (
    <div className="relative group flex-1 min-w-[360px] h-full">
      {/* Subtle Shadow/Glow */}
      <div className="absolute inset-0 bg-red-600/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full bg-[#030303] border border-zinc-900 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-zinc-800 flex flex-col justify-between overflow-hidden shadow-2xl">
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[12px] font-black uppercase tracking-tighter text-zinc-500 select-none">Global Odometer</h2>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-900 border border-zinc-800" />)}
            </div>
          </div>
          
          {isEditing ? (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter block mb-3">Calibration Entry (KM)</label>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => onEditChange(e.target.value)}
                    className="text-5xl font-black text-red-600 tracking-tighter mono bg-black/50 px-6 py-4 rounded-2xl border border-red-900/30 outline-none w-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:border-red-600 transition-all placeholder:text-zinc-800"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter block mb-3">Telemetry Timestamp (DD/MM/YYYY)</label>
                  <input
                    type="text"
                    placeholder="18/02/2026"
                    value={toDisplayDate(editDate)}
                    onChange={(e) => handleDisplayDateChange(e.target.value)}
                    className="text-xs font-bold text-zinc-300 mono bg-zinc-900/50 px-6 py-4 rounded-2xl border border-zinc-800 outline-none w-full focus:border-zinc-700 focus:bg-zinc-900 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={onEditSave} 
                  style={{ wordSpacing: '0.2em' }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-2xl shadow-xl shadow-red-950/20 transition-all active:scale-[0.98] font-black uppercase tracking-normal text-[10px]"
                >
                  Confirm Sync
                </button>
                <button 
                  onClick={onEditCancel} 
                  style={{ wordSpacing: '0.2em' }}
                  className="flex-1 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 py-4 rounded-2xl transition-all active:scale-[0.98] font-black uppercase tracking-normal text-[10px] border border-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="group/data">
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-7xl font-[1000] text-white tracking-tighter mono leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                  {totalOdometer.toLocaleString()}
                </span>
                <span className="text-xl font-black text-zinc-800 uppercase select-none tracking-tighter">KM</span>
              </div>
              
              <div className="flex flex-col gap-6">
                <button 
                  onClick={onStartEdit}
                  style={{ wordSpacing: '0.2em' }}
                  className="w-full md:w-fit px-8 py-4 bg-zinc-900/40 border border-red-600/30 rounded-2xl text-[10px] font-black uppercase tracking-normal hover:bg-red-600/10 hover:border-red-600 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group/btn"
                >
                  <span className="text-red-600 animate-glow-red">Update Reading</span>
                </button>
                
                <div className="flex items-center gap-2 px-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Master Telemetry Online</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-900/10 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};