import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";

import SelectModel from "./select-model";
import Native from "./native";
import Groq from "./groq";

function Transcribe() {
  const user_id = useAuthStore(s => s._id)
  const sttType = useContextStore(s => s?.data?.[user_id]?.stt_type)

  return (
    <>
      {/* <div className="mb-0.5 text-xs text-gray-500">Speech to Text Provider</div> */}
      <SelectModel />

      {
        sttType === "Groq" && <Groq />
      }

      {
        sttType === "System native" && <Native />
      }
    </>
  )
}

export default Transcribe
