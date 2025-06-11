export interface ProjectHistoryEntry {
  project_name: string;
  start_date: string | null;
  end_date: string | null;
  doors_per_hour: number | null;
  total_doors: number | null;
  survey_rate: number | null;
  total_hours: number | null;
}

export interface Employee {
  id: string;
  full_name: string;
  position: string;
  location: string;
  phone: string;
  email: string;
  notes: string;
  status: string;
  blacklisted: boolean;
  start_date: string;
  end_date?: string;
  // 👇 Add this line
  projects?: ProjectHistoryEntry[];
}
