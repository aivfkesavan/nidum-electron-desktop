import useContextStore from "@/store/context";

import SelectModel from "./select-model";
import Native from "./native";
import Groq from "./groq";

type props = {
  onOpenChange: (v: boolean) => void
}

function Transcribe() {
  const sttType = useContextStore(s => s.stt_type)

  return (
    <div>
      <div className="mb-0.5 text-xs text-gray-500">Speech to Text Provider</div>
      <SelectModel />

      {
        sttType === "Groq" && <Groq />
      }

      {
        sttType === "System native" && <Native />
      }
    </div>
  )
}

export default Transcribe