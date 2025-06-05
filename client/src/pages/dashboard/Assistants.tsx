import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AssistantWithStats } from "@/public /types/assistant";
import { useState } from "react";
import AssistantCard from "@/components/components_basic/assistants/AssistantCard";

import AssistantCallSlideover from "@/components/components_basic/assistants/AssistantCallSlideover";
import Loader from "@/components/components_basic/Loader";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const getAssistants = async (): Promise<AssistantWithStats[]> => {
  const res = await fetch(import.meta.env.VITE_SERVER_URL + "/assistants");
  return res.json();
};

function Assistants() {
  const query_client = useQueryClient();
  const [selected_assistant_id, setSelectedAssistantId] = useState<
    string | null
  >(null);
  const [syncing, setSyncing] = useState(false);

  const { data: assistants, isLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: getAssistants,
  });

  const syncAssistants = async () => {
    const res = await fetch(
      import.meta.env.VITE_SERVER_URL + "/vapi/assistants"
    );
    return res.json();
  };

  const { mutate: handleSyncAssistants } = useMutation({
    mutationFn: syncAssistants,
    onMutate: () => {
      setSyncing(true);
    },
    onSuccess: () => {
      toast.success("Assistants synced successfully");
      query_client.invalidateQueries({ queryKey: ["assistants"] });
      setSyncing(false);
    },
    onError: () => {
      toast.error("Failed to sync assistants");
      setSyncing(false);
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full mx-auto overflow-auto ">
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-2xl font-semibold">Assistants</h1>
        <Button onClick={() => handleSyncAssistants()} disabled={syncing}>
          <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          Sync Assistants
        </Button>
      </div>
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
