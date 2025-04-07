export interface User {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  email: string;
  email_validated: boolean;
  language: string;
  time_zone: string;
  user_type: string;
  permissions: string[];
}
