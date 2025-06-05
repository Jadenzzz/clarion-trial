export type Assistant = {
  id: string;
  vapi_id: string;
  name: string;
  model: string;
  model_provider: string;
  voice_id: string;
  voice_provider: string;
};

export type AssistantStats = {
  total_calls: number;
  avg_call_duration: number;
  success_rate: number;
};

export type AssistantWithStats = Assistant & AssistantStats;
