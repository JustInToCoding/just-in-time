import { Event } from './event';
import { Project } from './project';

interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  company_name: string;
}

interface User {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: string;
  administration_id: number;
  contact_id: string | null;
  project_id: string | null;
  user_id: string;
  started_at: string;
  ended_at: string;
  description: string;
  paused_duration: number | null;
  billable: boolean;
  created_at: string;
  updated_at: string;
  contact: Contact | null;
  detail: any;
  user: User;
  project: Project | null;
  events: Event[];
  notes: any[];
}
