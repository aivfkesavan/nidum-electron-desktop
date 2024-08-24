import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useOllamaModels } from "@hooks/use-ollama";
import { useDownloads } from "@components/chat/download-manager/provider";
import useContextStore from "@store/context";
import { useToast } from "@components/ui/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DeleteModel from "./delete-model";
import ModelInfo from "./model-info";
import useUIStore from "@store/ui";

type props = {
  filterFn: (m: any) => boolean;
}

const trendingModels = [
  {
    name: "mistral",
    size: "4.10 GB",
    quantizisation: "",
  },
  {
    name: "gemma2",
    size: "5.40 GB",
    quantizisation: "",
  },
  {
    name: "phi3",
    size: "2.20 GB",
    quantizisation: "",
  },
  {
    name: "llama3.1",
    size: "4.70 GB",
    quantizisation: "",
  },
  {
    name: "nidumai/nidum-limitless-gemma-2b",
    size: "2.70 GB",
    quantizisation: "Q8_0",
  },
  {
    name: "nidumai/nidum-limitless-gemma-2b:F16",
    size: "5.00 GB",
    quantizisation: "F16",
  },
  {
    name: "codegemma",
    size: "5.00 GB",
    quantizisation: "",
  },
  {
    name: "zephyr",
    size: "4.10 GB",
    quantizisation: "",
  },
  {
    name: "dolphin-mistral",
    size: "4.10 GB",
    quantizisation: "",
  },
]

function Manage({ filterFn }: props) {
  const [modelName, setModelName] = useState("")
  const [model, setModel] = useState("")
  const closeModel = useUIStore(s => s.close)
  const { toast } = useToast()

  const { downloadModel } = useDownloads()
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const queryClient = useQueryClient()
  const { data, isLoading } = useOllamaModels(ollamaUrl)

  const filtered = isLoading ? [] : trendingModels?.filter(m => !data?.some(d => d.name?.includes(m?.name)))
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
      {
        !isLoading && data?.length > 0 &&
        <div className="mini-scroll-bar p-2 pr-4 -mr-4 mb-8 max-h-40 overflow-y-auto rounded border">
          {
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
      }

      {
        !isLoading && data?.length === 0 &&
        <div className="text-xs text-white/60">No model available</div>
      }

      <h6 className="mb-0.5 text-[11px] text-white/70">Kindly enter your Ollama model ID here to proceed with the download</h6>
      <div className="df mb-4">
        {
          filtered.length > 0 &&
          <Select value={modelName} onValueChange={setModelName}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Model" />
            </SelectTrigger>

            <SelectContent>
              {
                filtered.map(m => (
                  <SelectItem
                    value={m.name}
                    key={m.name}
                    className="pl-2 [&_svg]:hidden"
                  >
                    {m.name} <span className="ml-2 text-xs text-white/60">{`(${m.size})`}</span>
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        }

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
