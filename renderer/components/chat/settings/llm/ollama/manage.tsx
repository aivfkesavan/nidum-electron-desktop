import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";
import { useDownloads } from "@components/chat/download-manager/provider";
import useContextStore from "@store/context";
import { useToast } from "@components/ui/use-toast";

import DeleteModel from "./delete-model";
import ModelInfo from "./model-info";
import useUIStore from "@store/ui";

type props = {
  filterFn: (m: any) => boolean;
}

function Manage({ filterFn }: props) {
  const [modelName, setModelName] = useState("")
  const [model, setModel] = useState("")
  const closeModel = useUIStore(s => s.close)
  const { toast } = useToast()

  const { downloadModel } = useDownloads()
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: () => getOllamaTags(ollamaUrl),
    enabled: !!ollamaUrl,
  })

  const updateModel = (v: string = "") => setModel(v)

  function startDownloading() {
    const found = data?.find(d => d?.model === modelName)
    if (found) return toast({ title: "Model already downloaded" })

    setModelName("")
    downloadModel({
      name: modelName,
      ollamaUrl,
      initiater: "llm",
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
      },
      onError() { },
    })
    closeModel()
  }

  return (
    <>
      <h6 className="mb-0.5 text-[11px] text-white/70">Available Models</h6>
      <div className="mini-scroll-bar p-2 pr-4 -mr-4 mb-8 max-h-40 overflow-y-auto rounded border">
        {
          !isLoading &&
          data
            ?.filter(filterFn)
            ?.map(m => (
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