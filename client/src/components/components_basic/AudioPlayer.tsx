import { GRADIENT_BG_HOVER } from "@/utils/constants";
import WavesurferPlayer from "@wavesurfer/react";
import { Pause, Play } from "lucide-react";
import { useState } from "react";

export default function AudioPlayer({ audio_url }: { audio_url: string }) {
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    if (wavesurfer) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (wavesurfer as any).playPause();
    }
  };

  return (
    <div>
      <div className="">
        <WavesurferPlayer
          height={100}
          waveColor="gray"
          url={audio_url}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
      <button
        onClick={onPlayPause}
        className={`flex items-center justify-center w-8 h-8 ${GRADIENT_BG_HOVER} text-white rounded-lg transition-color cursor-pointer mt-2`}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}
