
export enum ServiceStatus {
  GOOD = 'Good',
  WARNING = 'Warning',
  OVERDUE = 'Overdue'
}

export interface MaintenanceItem {
  id: number;
  component: string;
  recommendedRange: number | 'Master Service';
  lastServiceOdometer: number;
}

export interface MileageEntry {
  date: string;
  value: number;
}

export interface MaintenanceState {
  items: MaintenanceItem[];
  totalOdometer: number;
  history: MileageEntry[];
  licenseExpiry: string;
  taxExpiry: string;
  lastUpdated?: number; // Timestamp for version control
}

export interface AIAdvice {
  summary: string;
  urgentTasks: string[];
  maintenanceTips: string[];
}
