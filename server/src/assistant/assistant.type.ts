import { Database } from '../supabase/database.types';

export type Assistant = Database['public']['Tables']['assistant']['Row'];
export type CreateAssistantDto = Database['public']['Tables']['assistant']['Insert'];
export type UpdateAssistantDto = Database['public']['Tables']['assistant']['Update']; 