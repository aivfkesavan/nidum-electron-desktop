import { useState } from "react";
import { MdDownloadDone, MdOutlineFileDownload } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { useOllamaModels } from "@hooks/use-ollama";
import { useDownloads } from "@components/chat/download-manager/provider";
import useContextStore from "@store/context";
import { useToast } from "@components/ui/use-toast";
import useUIStore from "@store/ui";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const models = [
  {
    name: "mistral",
    size: "4.10 GB",
    id: "mistral",
  },
  {
    name: "gemma2",
    size: "5.40 GB",
    id: "gemma2",
  },
  {
    name: "phi3",
    size: "2.20 GB",
    id: "phi3",
  },
  {
    name: "llama3.1",
    size: "4.70 GB",
    id: "llama3.1",
  },
  {
    name: "nidumai:Q8_0",
    size: "2.70 GB",
    id: "nidumai/nidum-limitless-gemma-2bQ8_0",
  },
  {
    name: "nidumai:F16",
    size: "5.00 GB",
    id: "nidumai/nidum-limitless-gemma-2b:F16F16",
  },
  {
    name: "codegemma",
    size: "5.00 GB",
    id: "codegemma",
  },
  {
    name: "zephyr",
    size: "4.10 GB",
    id: "zephyr",
  },
  {
    name: "dolphin-mistral",
    size: "4.10 GB",
    id: "dolphin-mistral",
  },
]

function Ollama() {
  const { downloads, downloadModel } = useDownloads()
  const ollamaModel = useContextStore(s => s.ollamaModel)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)
  const updateContext = useContextStore(s => s.updateContext)
  const close = useUIStore(s => s.close)
  const { toast } = useToast()

  const { data: downloaded, isLoading } = useOllamaModels(ollamaUrl)
  const queryClient = useQueryClient()

  const [selected, setSelected] = useState(ollamaModel || "")

  async function download(name: string) {
    downloadModel({
      name,
      ollamaUrl,
      initiater: "llm",
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
      },
      onError() { },
    })
  }

  function onSave() {
    if (downloaded?.some(d => d?.name?.includes(selected))) {
      updateContext({ ollamaModel: selected })
      close()
    } else {
      toast({
        title: "Model not downloaded yet",
        description: "Please download model to select"
      })
    }
  }

  return (
    <>
      <RadioGroup value={selected} onValueChange={setSelected} className="grid grid-cols-2 gap-4 my-4">
        {
          models.map(m => (
            <div
              key={m.name}
              className="p-4 text-xs border rounded-md"
            >
              <div className="df mb-2">
                <RadioGroupItem value={m.name} id={m.name} />
                <Label htmlFor={m.name} className="mr-auto cursor-pointer">{m.name}</Label>
                {
                  downloaded?.some(d => d?.name?.includes(m.name))
                    ? <MdDownloadDone title="Model downloaded" />
                    :
                    downloads[m.name] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m.name]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => download(m.id)}
                        disabled={isLoading}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>

              <div className="text-[10px] text-white/70">
                <p>Size: {m.size}</p>
              </div>
            </div>
          ))
        }
      </RadioGroup>

      <div className="df justify-between mt-12 mb-4">
        <button
          onClick={close}
          className="w-20 py-1.5 text-[13px] text-white/70 border hover:text-white hover:bg-input"
        >
          Cancel
        </button>

        <button
          className="w-20 py-1.5 text-[13px] bg-black/60 hover:bg-input"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </>
  )
}

export default Ollama
