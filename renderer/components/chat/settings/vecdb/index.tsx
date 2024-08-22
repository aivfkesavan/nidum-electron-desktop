import useContextStore from "@/store/context";

import SelectModel from "./select-model";
import Qdrant from "./qdrant";

type props = {
  onOpenChange: (v: boolean) => void
}

function VecDB({ onOpenChange }: props) {
  const vb_type = useContextStore(s => s.vb_type)

  return (
    <div>
      <SelectModel />

      {
        vb_type === "Qdrant" &&
        <Qdrant />
      }

      {/* {
        vb_type === "Nidum" &&
        <div className="mt-6 text-xs text-white/60">
          There is no configuration needed for this provider.
        </div>
      } */}
    </div>
  )
}

export default VecDB
