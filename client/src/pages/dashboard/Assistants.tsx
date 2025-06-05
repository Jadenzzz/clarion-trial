import { useQuery } from "@tanstack/react-query";
import type { Assistant } from "@/public /types/assistant";
import { useState } from "react";
import AssistantCard from "@/components/components_basic/assistants/AssistantCard";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";

import AssistantCallSlideover from "@/components/components_basic/assistants/AssistantCallSlideover";
import Loader from "@/components/components_basic/Loader";

const getAssistants = async (): Promise<Assistant[]> => {
  const res = await fetch(
    import.meta.env.VITE_SERVER_URL + "/assistants?stats=true"
  );
  return res.json();
};

function Assistants() {
  const [selected_assistant_id, setSelectedAssistantId] = useState<
    string | null
  >(null);

  const { data: assistants, isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: getAssistants,
  });

  // const handleStartCall = (assistant_id: string) => {
  //   VapiService.start(assistant_id, () => {
  //     setSelectedAssistantId(assistant_id);
  //   });
  // };

  // const handleEndCall = () => {
  //   setSelectedAssistantId(null);
  //   VapiService.stop(() => {
  //     setSelectedAssistantId(null);
  //   });
  //   queryClient.invalidateQueries({ queryKey: ["calls"] });
  // };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full mx-auto overflow-auto ">
      {/* <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-normal">Assistants</h1>
        <Button>
          <PlusIcon className="w-4 h-4" />
          New Assistant
        </Button>
      </div> */}
      <div className="grid grid-cols-4 gap-8  px-1">
        {assistants?.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            onCall={() => setSelectedAssistantId(assistant.vapi_id)}
            onEndCall={() => setSelectedAssistantId(null)}
            is_on_call={
              !!selected_assistant_id &&
              selected_assistant_id === assistant.vapi_id
            }
            disabled={
              !!selected_assistant_id &&
              selected_assistant_id !== assistant.vapi_id
            }
          />
        ))}
        {selected_assistant_id && (
          <AssistantCallSlideover
            assistant_id={selected_assistant_id}

            onClose={() => setSelectedAssistantId(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Assistants;
