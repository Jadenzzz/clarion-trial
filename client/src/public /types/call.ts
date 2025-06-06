export type Call = {
  id: string;
  vapi_id: string;
  assistant_id: string;
  ended_reason: string | null;
  summary: string | null;
  transcript: string | null;
  type: string;
  recording_url: string | null;
  updated_at: Date;
  created_at: Date;
  assistant: { name: string };
  cost: number;
  ended_at: Date | null;
  started_at: Date | null;
  phone_number: string | null;
  phone_number_id: string | null;
};

export type Message = {
  id: string;
  role: string;
  message: string;
  start_timestamp: number;
  end_timestmap: number | null;
};

export type Stats = {
  total_count: number;
  yesterday_total_count: number;
  success_rate: number;
  yesterday_success_rate: number;
  avg_duration: number;
  yesterday_avg_duration: number;
  assistant_count: number;
};

export type CallForReportView = Call & { message: Message[] };
