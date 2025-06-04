export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      assistant: {
        Row: {
          id: string;
          created_at: string | null;
          updated_at: string | null;
          name: string;
          model: string;
          model_provider: string;
          voice_id: string;
          voice_provider: string;
          phone_number: string | null;
          vapi_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          name: string;
          model: string;
          model_provider: string;
          voice_id: string;
          voice_provider: string;
          phone_number?: string | null;
          vapi_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          name?: string;
          model?: string;
          model_provider?: string;
          voice_id?: string;
          voice_provider?: string;
          phone_number?: string | null;
          vapi_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      // Add other tables here as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
