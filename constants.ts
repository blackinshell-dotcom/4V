
import { MaintenanceItem } from './types';

// Total Odometer from spreadsheet: 22845
// Calculation: lastServiceOdometer = Total - Trip
const TOTAL_ODO = 22845;
const CHAIN_TRIP = 257;
const GENERAL_TRIP = 759;

const CHAIN_LAST_SERVICE = TOTAL_ODO - CHAIN_TRIP; // 22588
const GENERAL_LAST_SERVICE = TOTAL_ODO - GENERAL_TRIP; // 22086

export const INITIAL_MAINTENANCE_DATA: MaintenanceItem[] = [
  { id: 1, component: 'Chain lubing', recommendedRange: 700, lastServiceOdometer: CHAIN_LAST_SERVICE },
  { id: 2, component: 'Chain Tension & Lubrication', recommendedRange: 700, lastServiceOdometer: CHAIN_LAST_SERVICE },
  { id: 3, component: 'Engine Oil', recommendedRange: 2000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 4, component: 'Oil Filter', recommendedRange: 2000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 5, component: 'Air Filter cleaning', recommendedRange: 4000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 6, component: 'Brake Pads (Front)', recommendedRange: 5000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 7, component: 'Carburetor / Fuel Injector Cleaning', recommendedRange: 5000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 8, component: 'Front Fork Oil', recommendedRange: 7000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 9, component: 'Rear Shock Oil', recommendedRange: 7000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 10, component: 'Brake Fluid (Front)', recommendedRange: 7000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 11, component: 'Brake Fluid (Rear)', recommendedRange: 7000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 12, component: 'Spark Plug', recommendedRange: 8000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 13, component: 'Brake Pads (Rear)', recommendedRange: 8000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 14, component: 'Clutch Cable / Lever', recommendedRange: 10000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 15, component: 'Throttle Cable / Lever', recommendedRange: 10000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 16, component: 'Air Filter Replace', recommendedRange: 12000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 17, component: 'Coolant', recommendedRange: 12000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 18, component: 'Wheel Bearings', recommendedRange: 12000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 19, component: 'Exhaust System Check', recommendedRange: 12000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 20, component: 'Battery', recommendedRange: 15000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 21, component: 'Suspension (Front)', recommendedRange: 16000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 22, component: 'Suspension (Rear)', recommendedRange: 16000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 23, component: 'Chain & Sprocket change', recommendedRange: 20000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 24, component: 'Rear Tyre', recommendedRange: 20000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 25, component: 'Steering Head Bearings', recommendedRange: 20000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 26, component: 'Front Tyre', recommendedRange: 25000, lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 27, component: 'Drive Chain Adjustment', recommendedRange: 'Master Service', lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 28, component: 'Body Bolts & Fasteners Check', recommendedRange: 'Master Service', lastServiceOdometer: GENERAL_LAST_SERVICE },
  { id: 29, component: 'Throttle & Clutch Lever Lubrication', recommendedRange: 'Master Service', lastServiceOdometer: GENERAL_LAST_SERVICE }
];

export const APP_THEME = {
  colors: {
    bg: 'bg-black',
    card: 'bg-zinc-900',
    primary: 'text-red-600',
    accent: 'bg-red-600',
    good: 'text-zinc-400',
    warning: 'text-amber-500',
    danger: 'text-red-500',
  }
};
