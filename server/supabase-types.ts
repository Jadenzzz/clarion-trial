export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assistant: {
        Row: {
          created_at: string | null
          id: string
          model: string
          model_provider: string
          name: string
          phone_number: string | null
          updated_at: string | null
          vapi_id: string | null
          voice_id: string
          voice_provider: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          model: string
          model_provider: string
          name: string
          phone_number?: string | null
          updated_at?: string | null
          vapi_id?: string | null
          voice_id: string
          voice_provider: string
        }
        Update: {
          created_at?: string | null
          id?: string
          model?: string
          model_provider?: string
          name?: string
          phone_number?: string | null
          updated_at?: string | null
          vapi_id?: string | null
          voice_id?: string
          voice_provider?: string
        }
        Relationships: []
      }
      call: {
        Row: {
          assistant_id: string | null
          cost: number | null
          created_at: string | null
          ended_at: string | null
          ended_reason: string | null
          id: string
          phone_call_transport: string | null
          phone_number: string | null
          phone_number_id: string | null
          recording_url: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["call_status"] | null
          summary: string | null
          transcript: string | null
          type: string | null
          updated_at: string | null
          vapi_id: string | null
        }
        Insert: {
          assistant_id?: string | null
          cost?: number | null
          created_at?: string | null
          ended_at?: string | null
          ended_reason?: string | null
          id?: string
          phone_call_transport?: string | null
          phone_number?: string | null
          phone_number_id?: string | null
          recording_url?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: string | null
          transcript?: string | null
          type?: string | null
          updated_at?: string | null
          vapi_id?: string | null
        }
        Update: {
          assistant_id?: string | null
          cost?: number | null
          created_at?: string | null
          ended_at?: string | null
          ended_reason?: string | null
          id?: string
          phone_call_transport?: string | null
          phone_number?: string | null
          phone_number_id?: string | null
          recording_url?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["call_status"] | null
          summary?: string | null
          transcript?: string | null
          type?: string | null
          updated_at?: string | null
          vapi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_call_assistant"
            columns: ["assistant_id"]
            isOneToOne: false
            referencedRelation: "assistant"
            referencedColumns: ["id"]
          },
        ]
      }
      message: {
        Row: {
          call_id: string
          created_at: string | null
          end_timestamp: number | null
          id: string
          message: string
          role: string
          start_timestamp: number | null
          updated_at: string | null
        }
        Insert: {
          call_id: string
          created_at?: string | null
          end_timestamp?: number | null
          id?: string
          message: string
          role: string
          start_timestamp?: number | null
          updated_at?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string | null
          end_timestamp?: number | null
          id?: string
          message?: string
          role?: string
          start_timestamp?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "call"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      call_status:
        | "scheduled"
        | "queued"
        | "ringing"
        | "in-progress"
        | "forwarding"
        | "ended"
      call_type: "inboundPhoneCall" | "outboundPhoneCall" | "webCall"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      call_status: [
        "scheduled",
        "queued",
        "ringing",
        "in-progress",
        "forwarding",
        "ended",
      ],
      call_type: ["inboundPhoneCall", "outboundPhoneCall", "webCall"],
    },
  },
} as const
