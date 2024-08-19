import useContextStore from "@/store/context";

import SelectModel from "./select-model";
import Groq from "./groq";

function Transcribe() {
  const sttType = useContextStore(s => s.stt_type)

  return (
    <div>
      <div className="mb-0.5 text-xs text-gray-500">Speech to Text Provider</div>
      <SelectModel />

      {
        sttType === "Groq" && <Groq />
      }
    </div>
  )
}

export default Transcribe
