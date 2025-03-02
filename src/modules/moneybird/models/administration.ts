export interface Administration {
  id: string;
  name: string;
  language: string;
  currency: string;
  country: string;
  time_zone: string;
  access: 'owner' | 'user' | 'accountant_company' | 'employee'; // owner and employee are not certain
  suspended: boolean;
  period_locked_until: number | null; // number is not certain
}
