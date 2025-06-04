import { useQuery } from "@tanstack/react-query";
import type { CallForReportView } from "@/public /types/call";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenIcon, ListIcon } from "lucide-react";
import dayjs from "dayjs";
import Badge from "../Badge";
import { formatCallEndedReason } from "@/utils";
import { CALL_TYPE_TO_TEXT } from "@/utils/constants";

const TABS = [
  {
    label: "Overview",
    value: "overview",

    icon: <BookOpenIcon className="w-4 h-4" />,
  },
  {
    label: "Transcript",
    value: "transcript",
    icon: <ListIcon className="w-4 h-4" />,
  },
];
export default function CallReportView({ call_id }: { call_id: string }) {
  const getCalls = async (): Promise<CallForReportView> => {
    const res = await fetch(
      import.meta.env.VITE_SERVER_URL + "/calls/" + call_id
    );
    return res.json();
  };

  const { data: call, isLoading } = useQuery({
    queryKey: ["call_for_report_view"],
    queryFn: getCalls,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (call) {
    return (
      <div>
        <div className="p-6">
          {(() => {
            return (
              <div className="space-y-6">
                {/* Call Metadata Section */}
                <div className="">
                  <div className="grid grid-cols-4 gap-6 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Assistant
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {call.assistant.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium">
                          {call.assistant.name}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        Started At
                      </div>
                      <div className="font-medium">
                        {dayjs(call.created_at).format("D MMM YYYY, HH:mm:ss")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Duration</div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium">
                          {call.started_at && call.ended_at
                            ? `${dayjs(call.ended_at).diff(
                                dayjs(call.started_at),
                                "minute"
                              )}m ${
                                dayjs(call.ended_at).diff(
                                  dayjs(call.started_at),
                                  "second"
                                ) % 60
                              }s`
                            : "--m --s"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Cost</div>
                      <div className="font-medium">
                        ${call.cost ? call.cost.toFixed(2) : "0.00"}
                      </div>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div className="flex gap-2">
                    <Badge text={CALL_TYPE_TO_TEXT[call.type as keyof typeof CALL_TYPE_TO_TEXT]} bg_color="green" text_size="text-xs" padding="px-2 py-0.5"/>
                    <Badge text={"Successful"} bg_color="green" text_size="text-xs" padding="px-2 py-0.5"/>
                    {call.ended_reason && (
                      <Badge text={formatCallEndedReason(call.ended_reason)} bg_color="red" text_size="text-xs" padding="px-2 py-0.5"/>
                    )}
                  </div>
                </div>

                <Tabs defaultValue={TABS[0].value} className="w-full">
                  <TabsList className="w-full my-1">
                    {TABS.map((tab) => (
                      <TabsTrigger key={tab.value} value={tab.value}>
                        {tab.icon}
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent key={TABS[0].value} value={TABS[0].value}>
                    {/* Summary */}
                    <div className="flex flex-col gap-6">
                      <div>
                        {/* Audio Player */}
                        {call.recording_url && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">
                              Recording
                            </h3>
                            {/* <div className="bg-gray-50 p-4 rounded-lg">
                      <AudioPlayer audio_url={call.recording_url} />
                    </div> */}
                            <audio
                              src={call.recording_url}
                              controls
                              className="w-full rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          Call Summary
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-md text-sm">
                          <div className="">{call.summary}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent key={TABS[1].value} value={TABS[1].value}>
                    {/* Transcript */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                          Conversation Transcript
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {call.message
                          .filter((message) => message.role !== "system")
                          .map((message) => {
                            const is_bot = message.role !== "user";
                            const display_role = is_bot ? "Assistant" : "User";
                            const timestamp = message.start_timestamp
                              ? dayjs(message.start_timestamp).format(
                                  "HH:mm:ss"
                                )
                              : null;

                            return (
                              <div key={message.id} className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      {display_role.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900 text-base">
                                      {display_role}
                                    </span>
                                    {timestamp && (
                                      <span className="text-sm text-gray-500 ">
                                        {timestamp}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-700 leading-relaxed text-sm">
                                    {message.message}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }
}
