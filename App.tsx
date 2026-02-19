import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { INITIAL_MAINTENANCE_DATA } from './constants';
import { MaintenanceItem, MileageEntry, MaintenanceState } from './types';
import { MaintenanceMatrix } from './components/MaintenanceMatrix';
import { HeroOdometer } from './components/HeroOdometer';
import { ThreatAlertBox } from './components/ThreatAlertBox';
import { ComplianceBox } from './components/ComplianceBox';

const STATE_API = "/api/state";

const App: React.FC = () => {
  // --- Core State ---
  const [totalOdometer, setTotalOdometer] = useState<number>(22845);
  const [items, setItems] = useState<MaintenanceItem[]>(INITIAL_MAINTENANCE_DATA);
  const [licenseExpiry, setLicenseExpiry] = useState('2035-05-21');
  const [taxExpiry, setTaxExpiry] = useState('2026-07-30');
  const [history, setHistory] = useState<MileageEntry[]>([
    { date: '2025-12-31', value: 22797 }, 
    { date: '2026-01-15', value: 22845 }, 
  ]);

  // --- UI & Undo State ---
  const [snapshots, setSnapshots] = useState<MaintenanceState[]>([]);
  const [isUpdatingOdo, setIsUpdatingOdo] = useState(false);
  const [newOdoInput, setNewOdoInput] = useState('22845');
  const [newDateInput, setNewDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  const stateRef = useRef<MaintenanceState>({ totalOdometer, items, history, licenseExpiry, taxExpiry });

  // ---- Sync control refs ----
  const lastServerSyncRef = useRef<string | null>(null);
  const isApplyingRemoteRef = useRef(false);

  useEffect(() => {
    stateRef.current = { totalOdometer, items, history, licenseExpiry, taxExpiry };
  }, [totalOdometer, items, history, licenseExpiry, taxExpiry]);

  const pushStateToServer = useCallback(async (state: MaintenanceState) => {
    try {
      const updated_at = new Date().toISOString();

      await fetch(STATE_API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ state, updated_at }),
      });

      lastServerSyncRef.current = updated_at;
    } catch (e) {
      console.error("Push failed", e);
    }
  }, []);

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem('moto_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as MaintenanceState;
        setTotalOdometer(parsed.totalOdometer);
        setItems(parsed.items);
        setHistory(parsed.history);
        setLicenseExpiry(parsed.licenseExpiry);
        setTaxExpiry(parsed.taxExpiry);
      } catch (e) {
        console.error("Failed to load local state", e);
      }
    }
  }, []);

  useEffect(() => {
    const state = { totalOdometer, items, history, licenseExpiry, taxExpiry };
    localStorage.setItem('moto_state', JSON.stringify(state));

    if (!isApplyingRemoteRef.current) {
      pushStateToServer(state);
    }
  }, [totalOdometer, items, history, licenseExpiry, taxExpiry, pushStateToServer]);

  // --- Auto refresh pull (polling) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(STATE_API);
        const data = await res.json();

        if (!data?.record) return;

        const serverUpdatedAt = data.record.updated_at;

        if (serverUpdatedAt && serverUpdatedAt !== lastServerSyncRef.current) {
          isApplyingRemoteRef.current = true;

          const remote = data.record.state as MaintenanceState;

          setTotalOdometer(remote.totalOdometer);
          setItems(remote.items);
          setHistory(remote.history);
          setLicenseExpiry(remote.licenseExpiry);
          setTaxExpiry(remote.taxExpiry);

          lastServerSyncRef.current = serverUpdatedAt;

          setTimeout(() => {
            isApplyingRemoteRef.current = false;
          }, 0);
        }
      } catch (e) {
        console.error("Pull failed", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // --- Undo Logic ---
  const saveSnapshot = () => {
    setSnapshots(prev => [stateRef.current, ...prev].slice(0, 10));
  };

  const handleUndo = () => {
    if (snapshots.length === 0) return;
    const [lastState, ...remainingSnapshots] = snapshots;
    
    setTotalOdometer(lastState.totalOdometer);
    setItems(lastState.items);
    setHistory(lastState.history);
    setLicenseExpiry(lastState.licenseExpiry);
    setTaxExpiry(lastState.taxExpiry);
    setSnapshots(remainingSnapshots);
  };

  const handleUpdateOdometer = () => {
    const val = parseInt(newOdoInput);
    if (!isNaN(val)) {
      saveSnapshot();
      const nextHistory = [...history, { date: newDateInput, value: val }];
      setTotalOdometer(val);
      setHistory(nextHistory);
      setIsUpdatingOdo(false);
    }
  };

  const handleResetItem = (id: number) => {
    saveSnapshot();
    const nextItems = items.map(item => item.id === id ? { ...item, lastServiceOdometer: totalOdometer } : item);
    setItems(nextItems);
  };

  const alertCount = useMemo(() => {
    return items.reduce((count, item) => {
      if (typeof item.recommendedRange === 'number') {
        const trip = totalOdometer - item.lastServiceOdometer;
        return trip >= item.recommendedRange * 0.8 ? count + 1 : count;
      }
      return count;
    }, 0);
  }, [items, totalOdometer]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20 selection:bg-red-600 selection:text-white">
      <header className="bg-black/80 backdrop-blur-xl border-b border-zinc-900 sticky top-0 z-50 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase leading-none">
              Racing DNA <span className="text-red-600 animate-glow-red">Unleashed</span>
            </h1>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-normal mt-1">
              Local Storage Mode
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {snapshots.length > 0 && (
              <button 
                onClick={handleUndo}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-95 group"
                title="Undo last action"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Undo</span>
              </button>
            )}
            
            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600">
              <span className="text-[9px] font-black uppercase tracking-widest">Offline Secure</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <HeroOdometer 
            totalOdometer={totalOdometer}
            isEditing={isUpdatingOdo}
            editValue={newOdoInput}
            editDate={newDateInput}
            onEditChange={setNewOdoInput}
            onDateChange={setNewDateInput}
            onEditSave={handleUpdateOdometer}
            onEditCancel={() => setIsUpdatingOdo(false)}
            onStartEdit={() => {
              setNewOdoInput(totalOdometer.toString());
              setIsUpdatingOdo(true);
            }}
          />
          <ThreatAlertBox alertCount={alertCount} />
          <ComplianceBox licenseExpiry={licenseExpiry} taxExpiry={taxExpiry} onUpdateDates={(l, t) => {
            saveSnapshot();
            setLicenseExpiry(l);
            setTaxExpiry(t);
          }} />
        </div>

        <MaintenanceMatrix 
          items={items}
          totalOdometer={totalOdometer}
          onReset={handleResetItem}
          onManualTripUpdate={(id, trip) => {
            saveSnapshot();
            const nextItems = items.map(item => item.id === id ? { ...item, lastServiceOdometer: totalOdometer - trip } : item);
            setItems(nextItems);
          }}
          onManualIntervalUpdate={(id, interval) => {
            saveSnapshot();
            const nextItems = items.map(item => item.id === id ? { ...item, recommendedRange: interval } : item);
            setItems(nextItems);
          }}
          history={history}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      </main>
    </div>
  );
};

export default App;
