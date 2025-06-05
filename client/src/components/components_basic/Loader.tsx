import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500/30" />
        <Loader2 className="w-16 h-16 animate-spin text-purple-600/30 absolute top-0 left-0 -rotate-45" />
        <Loader2 className="w-16 h-16 animate-spin text-blue-500/30 absolute top-0 left-0 rotate-45" />
      </div>
    </div>
  );
}