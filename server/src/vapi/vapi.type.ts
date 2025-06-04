// Webhook payload interfaces based on Vapi documentation
export interface VapiWebhookPayload {
  message: VapiMessage;
}

export interface VapiMessage {
  type:
    | 'function-call'
    | 'assistant-request'
    | 'status-update'
    | 'end-of-call-report'
    | 'hang';
  call: VapiCallObject;
}

export interface VapiFunctionCallMessage extends VapiMessage {
  type: 'function-call';
  functionCall: {
    name: string;
    parameters: string; // JSON string
  };
}

export interface VapiAssistantRequestMessage extends VapiMessage {
  type: 'assistant-request';
}

export interface VapiStatusUpdateMessage extends VapiMessage {
  type: 'status-update';
  status: 'in-progress' | 'forwarding' | 'ended';
}

export interface VapiCallAnalysis {
  summary: string;
  successEvaluration: boolean;
}

export interface VapiEndOfCallReportMessage extends VapiMessage {
  type: 'end-of-call-report';
  endedReason: string;
  recordingUrl?: string;
  summary?: string;
  transcript?: string;
  messages?: Array<{
    role: 'assistant' | 'user';
    message: string;
    time: number;
    endTime: number;
  }>;
  startedAt?: string;
  endedAt?: string;
  call: VapiCallObject;
  analysis: VapiCallAnalysis | undefined;
  cost?: number;
}

export interface VapiHangMessage extends VapiMessage {
  type: 'hang';
}

// Response interfaces
export interface VapiFunctionCallResponse {
  result: string;
}

export interface VapiAssistantResponse {
  assistantId?: string;
  assistant?: any;
  error?: string;
}

export interface VapiCallObject {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: 'inboundPhoneCall' | 'outboundPhoneCall' | 'webCall';
  phoneCallProvider: 'twilio' | 'vonage' | 'vapi';
  phoneCallTransport: 'sip' | 'pstn';
  status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended';
  endedReason?:
    | 'assistant-ended'
    | 'assistant-not-found'
    | 'assistant-not-invalid'
    | 'assistant-not-provided'
    | 'assistant-request-failed'
    | 'assistant-request-returned-error'
    | 'assistant-request-returned-unsupported-message'
    | 'assistant-request-returned-invalid-assistant'
    | 'assistant-request-returned-no-assistant'
    | 'assistant-request-returned-forwarding-phone-number'
    | 'assistant-request-timeout'
    | 'customer-busy'
    | 'customer-ended-call'
    | 'customer-did-not-answer'
    | 'customer-did-not-give-microphone-permission'
    | 'assistant-said-end-call-phrase'
    | 'assistant-forwarded-call'
    | 'assistant-join-timeout'
    | 'customer-not-found'
    | 'call-start-error-unknown'
    | 'vonage-disconnected'
    | 'vonage-failed-to-connect-call'
    | 'phone-call-provider-bypass-enabled-but-no-call-received'
    | 'vapifault-phone-call-worker-setup-socket-error'
    | 'vapifault-phone-call-worker-worker-setup-socket-timeout'
    | 'vapifault-phone-call-worker-could-not-find-call'
    | 'vapifault-transport-never-connected'
    | 'vapifault-web-call-user-media-failed'
    | 'pipeline-error-openai-voice-failed'
    | 'pipeline-error-azure-voice-failed'
    | 'pipeline-error-elevenlabs-voice-failed'
    | 'pipeline-error-playht-voice-failed'
    | 'pipeline-error-deepgram-transcriber-failed'
    | 'pipeline-error-gladia-transcriber-failed'
    | 'pipeline-error-openai-llm-failed'
    | 'pipeline-error-azure-openai-llm-failed'
    | 'pipeline-error-together-ai-llm-failed'
    | 'pipeline-error-anyscale-llm-failed'
    | 'pipeline-error-openrouter-llm-failed'
    | 'pipeline-error-perplexity-ai-llm-failed'
    | 'pipeline-error-deepinfra-llm-failed'
    | 'pipeline-error-runpod-llm-failed'
    | 'pipeline-error-custom-llm-failed'
    | 'pipeline-no-available-model'
    | 'worker-shutdown'
    | 'unknown-error'
    | 'vonage-rejected'
    | 'customer-did-not-connect-in-time'
    | 'twilio-failed-to-connect-call'
    | 'silence-timed-out'
    | 'phone-call-provider-closed-websocket'
    | 'pipeline-error-lmnt-voice-failed'
    | 'pipeline-error-cartesia-voice-failed';
  phoneNumber?: {
    twilioPhoneNumber?: string;
    twilioAccountSid?: string;
    vonagePhoneNumber?: string;
    vonageApplicationId?: string;
  };
  customer?: {
    number?: string;
    sipUri?: string;
    name?: string;
  };
  assistantId?: string;
  assistant?: any;
  squadId?: string;
  squad?: any;
  phoneNumberId?: string;
  costs?: Array<{
    type: string;
    cost: number;
    description: string;
  }>;
  cost?: number;
  messages?: Array<{
    role: 'assistant' | 'user' | 'system' | 'function';
    message?: string;
    time: number;
    endTime?: number;
    secondsFromStart: number;
  }>;
  recordingUrl?: string;
  summary?: string;
  transcript?: string;
  stereoRecordingUrl?: string;
  artifact?: any;
  analysis?: any;
  monitor?: any;
  startedAt?: string;
  endedAt?: string;
}
