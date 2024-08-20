import { LuX } from "react-icons/lu";

import bytesToSize from "@utils/bytes-to-size";

type props = {
  size: number
  name: string
  model: string
  quantization_level: string
  updateModel: (v: string) => void
}

function ModelInfo({ size, name, model, quantization_level, updateModel }: props) {
  return (
    <>
      <div className="df mb-2 pl-2.5 pr-1.5 py-1 text-[13px] border border-input rounded">
        <p className="flex-1 truncate">{name}</p>
        <p className="text-[10px] text-white/80">{bytesToSize(size)}</p>
        <p className="px-1.5 py-0.5 text-[10px] text-white/90 border border-input/70 rounded-sm bg-input/70">{quantization_level}</p>

        <button
          className="p-1 text-white/50 hover:text-white hover:bg-red-500"
          onClick={() => updateModel(model)}
        >
          <LuX />
        </button>
      </div>
    </>
  )
}

export default ModelInfo
