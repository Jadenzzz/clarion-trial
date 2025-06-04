import { Database } from 'database.types';

export type Call = Database['public']['Tables']['call']['Row'];
export type CallInsertDto = Database['public']['Tables']['call']['Insert'];
export type CallUpdateDto = Database['public']['Tables']['call']['Update'];
