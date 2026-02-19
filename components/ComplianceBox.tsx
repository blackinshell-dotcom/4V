
import React, { useState } from 'react';

interface ComplianceBoxProps {
  licenseExpiry: string;
  taxExpiry: string;
  onUpdateDates: (license: string, tax: string) => void;
}

export const ComplianceBox: React.FC<ComplianceBoxProps> = ({ licenseExpiry, taxExpiry, onUpdateDates }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const formatDateForDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}-${month}-${year}`;
  };

  const parseFormattedDate = (formattedDate: string) => {
    // Converts DD-MM-YYYY to YYYY-MM-DD
    const parts = formattedDate.split('-');
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m}-${d}`;
    }
    return formattedDate;
  };

  const [tempLicense, setTempLicense] = useState(formatDateForDisplay(licenseExpiry));
  const [tempTax, setTempTax] = useState(formatDateForDisplay(taxExpiry));

  const calculateDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (days: number) => {
    if (days < 0) return 'text-red-600';
    if (days < 30) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const handleSave = () => {
    onUpdateDates(parseFormattedDate(tempLicense), parseFormattedDate(tempTax));
    setIsEditing(false);
  };

  const licenseDays = calculateDaysLeft(licenseExpiry);
  const taxDays = calculateDaysLeft(taxExpiry);

  return (
    <div className="relative group flex-1 min-w-[320px] h-full">
      <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative h-full bg-[#030303] border border-zinc-900 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-zinc-800 flex flex-col justify-between overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[12px] font-black uppercase tracking-tighter text-white select-none">Compliance Monitor</h2>
            <button 
              onClick={() => {
                if (!isEditing) {
                  setTempLicense(formatDateForDisplay(licenseExpiry));
                  setTempTax(formatDateForDisplay(taxExpiry));
                }
                setIsEditing(!isEditing);
              }}
              className="text-[10px] font-black uppercase tracking-tighter text-zinc-500 hover:text-white transition-colors"
            >
              {isEditing ? 'Cancel' : 'Configure'}
            </button>
          </div>

          {isEditing ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter block mb-2">Driving License Expiry</label>
                  <input
                    type="text"
                    placeholder="21-05-2035"
                    value={tempLicense}
                    onChange={(e) => setTempLicense(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs p-3 rounded-xl outline-none focus:border-zinc-600 mono"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter block mb-2">Tax Token Expiry</label>
                  <input
                    type="text"
                    placeholder="30-07-2026"
                    value={tempTax}
                    onChange={(e) => setTempTax(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs p-3 rounded-xl outline-none focus:border-zinc-600 mono"
                  />
                </div>
              </div>
              <button 
                onClick={handleSave}
                className="w-full py-3 bg-zinc-100 text-black text-[10px] font-black uppercase tracking-tighter rounded-xl hover:bg-white active:scale-95 transition-all"
              >
                Sync Records
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-center justify-between group/item">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-zinc-400 uppercase tracking-tighter">Driving License</span>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight mt-1 mono">{formatDateForDisplay(licenseExpiry)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-black mono leading-none ${getStatusColor(licenseDays)}`}>
                    {licenseDays < 0 ? 'EXP' : licenseDays.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter mt-2">Days Left</span>
                </div>
              </div>

              <div className="flex items-center justify-between group/item">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-zinc-400 uppercase tracking-tighter">Tax Token</span>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight mt-1 mono">{formatDateForDisplay(taxExpiry)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-3xl font-black mono leading-none ${getStatusColor(taxDays)}`}>
                    {taxDays < 0 ? 'EXP' : taxDays.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-black text-zinc-700 uppercase tracking-tighter mt-2">Days Left</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${Math.min(licenseDays, taxDays) < 30 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-tighter">Legal Status Secure</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
