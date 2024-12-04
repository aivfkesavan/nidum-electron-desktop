import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";

import SelectModel from "./select-model";
import Native from "./native";

function Voice() {
  const user_id = useAuthStore(s => s._id)
  const tts_type = useContextStore(s => s?.data?.[user_id]?.tts_type)

  return (
    <>
      <SelectModel />

      {
        tts_type === "System native" &&
        <Native />
      }
    </>
  )
}

export default Voice
