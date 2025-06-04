import Vapi from "@vapi-ai/web";

class VapiService {
  private static instance: VapiService;
  private vapi: Vapi;
  private message_handler: ((message: any) => void) | null = null;
  private call_start_handler: (() => void) | null = null;
  private call_end_handler: (() => void) | null = null;

  private constructor() {
    this.vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

    this.vapi.on("speech-start", () => {
      console.log("Speech has started");
    });

    this.vapi.on("speech-end", () => {
      console.log("Speech has ended");
    });

    this.vapi.on("call-start", () => {
      console.log("Call has started");
      if (this.call_start_handler) {
        this.call_start_handler();
      }
    });

    this.vapi.on("call-end", () => {
      console.log("Call has ended");
      if (this.call_end_handler) {
        this.call_end_handler();
      }
    });

    this.vapi.on("volume-level", (volume) => {
      console.log(`Assistant volume level: ${volume}`);
    });

    this.vapi.on("message", (message) => {
      console.log("Raw Vapi message:", message);
      if (this.message_handler) {
        this.message_handler(message);
      }
    });

    this.vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });
  }

  public static getInstance(): VapiService {
    if (!VapiService.instance) {
      VapiService.instance = new VapiService();
    }
    return VapiService.instance;
  }

  public setMessageHandler(handler: (message: any) => void) {
    this.message_handler = handler;
  }

  public setCallStartHandler(handler: () => void) {
    this.call_start_handler = handler;
  }

  public setCallEndHandler(handler: () => void) {
    this.call_end_handler = handler;
  }

  public removeMessageHandler() {
    this.message_handler = null;
  }

  public removeCallHandlers() {
    this.call_start_handler = null;
    this.call_end_handler = null;
  }

  public start(assistant_id: string, action?: () => void) {
    try {
      this.vapi.start(assistant_id);
      console.log("Call started with assistant:", assistant_id);
      action?.();
    } catch (error) {
      console.error("Error starting Vapi call:", error);
    }
  }

  public stop(action?: () => void) {
    this.vapi.stop();
    console.log("Call stopped");
    action?.();
  }
}

export default VapiService.getInstance();
