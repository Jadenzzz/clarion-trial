import Slideover from "@/components/components_basic/Slideover";
import { Button } from "@/components/ui/button";
import VapiService from "@/lib/vapi/vapi.service";
import { useQueryClient } from "@tanstack/react-query";
import { BotIcon, PhoneCall, PhoneOff, UserIcon, X } from "lucide-react";
import { useState, useEffect } from "react";

interface Message {
  role: "bot" | "user";
  content: string;
  timestamp?: string;
}

export default function AssistantCallSlideover({
  assistant_id,
  onClose,
}: {
  assistant_id: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const [call_duration, setCallDuration] = useState<string>("00:00");
  const [call_status, setCallStatus] = useState<
    "in-progress" | "active" | "ended" | null
  >(null);
  const query_client = useQueryClient();

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (call_status === "in-progress") {
      const start_time = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - start_time;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setCallDuration(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [call_status]);

  // Set up message handling
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "transcript") {
        if (message.transcriptType === "final" && (message.role === "assistant" || message.role === "user")) {
          setMessages((prev) => [
            ...prev,
            {
              role: message.role === "user" ? "user" : "bot",
              content: message.transcript,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      } else if (message.type === "conversation-update") {
        if (message.conversation && Array.isArray(message.conversation)) {
          const formatted_messages = message.conversation
            .filter(
              (msg: any) =>
                (msg.content && msg.content.trim() !== "") &&
                (msg.role === "assistant" || msg.role === "user")
            )
            .map((msg: any) => ({
              role: msg.role === "user" ? "user" : "bot",
              content: msg.content,
              timestamp: new Date(
                msg.timestamp || Date.now()
              ).toLocaleTimeString(),
            }));

          setMessages(formatted_messages);
        }
      }
    };

    VapiService.setMessageHandler(handleMessage);

    return () => {
      VapiService.removeMessageHandler();
    };
  }, []);

  // Set up call event handlers
  useEffect(() => {
    const handleCallStart = () => {
      setCallStatus("in-progress");
    };

    const handleCallEnd = () => {
      setCallStatus("ended");
    };

    VapiService.setCallStartHandler(handleCallStart);
    VapiService.setCallEndHandler(handleCallEnd);

    return () => {
      VapiService.removeCallHandlers();
    };
  }, []);

  const handleStartCall = () => {
    setCallStatus("in-progress");
    setMessages([]); // Clear previous messages
    VapiService.start(assistant_id);
  };

  const handleEndCall = () => {
    VapiService.stop();
    query_client.invalidateQueries({ queryKey: ["calls"] });
  };

  return (
    <Slideover
      open={true}
      onClose={() => {
        if (call_status !== "in-progress") {
          onClose();
        }
      }}
      hide_header
      small={true}
    >
      <div className="flex flex-col h-full ">
        {/* Header */}
        <div className="flex flex-col gap-2 p-4 border-b ">
          <h1 className="text-xl font-semibold">Live Transcript</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                call_status === "in-progress"
                  ? "bg-green-500"
                  : call_status === "ended"
                  ? "bg-red-500"
                  : "bg-yellow-500"
              }`}
            ></div>
            <span className="text-sm text-gray-300">
              {call_status === "in-progress"
                ? "Call In Progress"
                : call_status === "ended"
                ? "Call Ended"
                : "Connecting..."}
            </span>
            <span className="text-sm text-gray-400 ml-auto">
              {call_duration}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* Avatar */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200     `}
              >
                {message.role === "bot" ? (
                  <BotIcon className="w-4 h-4 " />
                ) : (
                  <UserIcon className="w-4 h-4 " />
                )}
              </div>

              {/* Message content */}
              <div className="flex-1">
                <div
                  className={`rounded-lg p-3  bg-gray-50 border border-gray-200`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                {/* {message.timestamp && (
                  <span className="text-xs text-gray-500 mt-1 block">
                    {message.timestamp}
                  </span>
                )} */}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Waiting for conversation to start...</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-2 border-t border-gray-700">
          <div className="flex gap-2">
            {!call_status ? (
              <Button
                onClick={handleStartCall}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 mr-1" />
                Start Call
              </Button>
            ) : call_status === "in-progress" ? (
              <Button
                onClick={handleEndCall}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4 mr-1" />
                End Call
              </Button>
            ) : (
              <Button
                onClick={() => {
                  onClose();
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </Slideover>
  );
}
