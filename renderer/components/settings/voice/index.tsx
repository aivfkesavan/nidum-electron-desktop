import useContextStore from "@/store/context";

import SelectModel from "./select-model";

function Voice() {
  const tts_type = useContextStore(s => s.tts_type)

  return (
    <div>
      <div className="mb-0.5 text-xs text-gray-500">Text to Speech Provider</div>
      <SelectModel />

      {
        tts_type === "System native" &&
        <div className="mt-6 text-xs text-white/60">
          There is no configuration needed for this provider.
        </div>
      }
    </div>
  )
}

export default Voice
