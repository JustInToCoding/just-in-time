export interface Project {
  id: string;
  name: string;
  state: 'active' | 'archived';
  budget: number | null;
}
