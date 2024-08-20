import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";
import useContextStore from "@store/context";
import useModelStore from "@store/model";

import DeleteModel from "./delete-model";
import ModelInfo from "./model-info";

function Manage() {
  const [modelName, setModelName] = useState("")
  const [model, setModel] = useState("")

  const updateContext = useModelStore(s => s.updateContext)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const { data, isLoading } = useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: getOllamaTags,
  })

  const updateModel = (v: string = "") => setModel(v)

  function startDownloading() {
    setModelName("")
    updateContext({ is_downloading: true, name: modelName })
  }

  return (
    <>
      <h6 className="mb-0.5 text-[11px] text-white/70">Available Models</h6>
      <div className="mini-scroll-bar p-2 pr-4 -mr-4 mb-8 max-h-40 overflow-y-auto rounded border">

        {
          !isLoading && data?.map(m => (
            <ModelInfo
              key={m?.model}
              size={m?.size}
              name={m?.name}
              model={m?.model}
              quantization_level={m?.details?.quantization_level}
              updateModel={updateModel}
            />
          ))
        }
      </div>

      <h6 className="mb-0.5 text-[11px] text-white/70">Kindly enter your Ollama model ID here to proceed with the download</h6>
      <div className="df mb-4">
        <input
          type="text"
          className="text-sm px-3 py-1.5 bg-transparent border"
          placeholder="nidum_ai_2b"
          value={modelName}
          onChange={e => setModelName(e.target.value)}
        />

        <button
          disabled={!modelName}
          onClick={startDownloading}
          className="py-2 px-3 text-xs text-white bg-[#141414] hover:bg-input"
        >
          Download
        </button>
      </div>

      {
        model &&
        <DeleteModel
          id={model}
          closeModel={updateModel}
        />
      }
    </>
  )
}

export default Manage
