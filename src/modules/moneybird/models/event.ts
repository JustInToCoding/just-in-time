export interface Event {
  administration_id: number;
  user_id: number;
  action: string;
  link_entity_id: string | null;
  link_entity_type: string | null;
  data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
