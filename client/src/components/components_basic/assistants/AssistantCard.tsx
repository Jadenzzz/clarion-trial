import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Assistant } from "@/public /types/assistant";
import { GRADIENT_BG, GRADIENT_BG_HOVER } from "@/utils/constants";
import { PhoneCallIcon } from "lucide-react";
import Badge from "../Badge";

export default function AssistantCard({
  assistant,
  onCall,
  onEndCall,
  is_on_call,
  disabled,
}: {
  assistant: Assistant;
  onCall: (assistant_id: string) => void;
  onEndCall: () => void;
  is_on_call: boolean;
  disabled: boolean;
}) {
  return (
    <Card key={assistant.id} className="shadow-sm">
      <CardContent className="px-4  flex flex-col gap-4 items-center">
        <div className="flex flex-row justify-start gap-3 w-full">
          <div
            className={`w-14 h-14 rounded-full ${GRADIENT_BG} flex items-center justify-center `}
          >
            <div className="text-2xl text-white">
              {assistant.name.charAt(0)}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold ">{assistant.name}</div>
            <div className="flex flex-row gap-2">
              <Badge
                text={assistant.model}
                bg_color="gray"
                padding="px-3 py-[2px]"
                text_size="text-xs"
              />
              <Badge
                text={"active"}
                bg_color="green"
                padding="px-3 py-[2px]"
                text_size="text-xs"
              />
            </div>
          </div>
        </div>

        {/*Stats*/}
        <div className="flex flex-row justify-between w-full ">
          <div className="flex flex-col items-center gap-1">
            <div className="text-lg font-bold text-gray-800">89</div>
            <div className="text-xs text-gray-500">Total Calls</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-lg font-bold text-gray-800">3m 18s</div>
            <div className="text-xs text-gray-500">Avg Duration</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-lg font-bold text-green-600">97%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>

        <Button
          disabled={disabled}
          onClick={() => {
            if (is_on_call) {
              onEndCall();
            } else {
              onCall(assistant.vapi_id);
            }
          }}
          className={`${GRADIENT_BG_HOVER} w-full ${
            !disabled ? "cursor-pointer" : "cursor-not-allowed"
          }`}
        >
          <PhoneCallIcon className="w-4 h-4 mr-1" />
          {is_on_call ? "Calling..." : `Call ${assistant.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}
