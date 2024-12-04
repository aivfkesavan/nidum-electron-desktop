import { useState } from "react";
import { MdOutlineFileDownload, MdOutlineDeleteOutline, MdInfoOutline } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";

import { useLLamaDownloadedModels } from "../../../../../hooks/use-llm-models";
import { useDownloads } from "../../../../common/download-manager";
import { useLLMModels } from "../../../../../hooks/use-llm-models";
import useContextStore from "../../../../../store/context";
import { useToast } from "../../../../../hooks/use-toast";
import useAuthStore from "../../../../../store/auth";

import { RadioGroup, RadioGroupItem } from "../../../../ui/radio-group";
import { Label } from "../../../../ui/label";
import DeleteModel from "./delete-model";
import Footer from "../../common/footer";

function Local() {
  const { downloads, downloadModel } = useDownloads()

  const user_id = useAuthStore(s => s._id)
  const llamaModel = useContextStore(s => s?.data?.[user_id]?.llamaModel)

  const updateContext = useContextStore(s => s.updateContext)

  const { toast } = useToast()

  const { data: downloaded, isLoading } = useLLamaDownloadedModels()
  const { data: models, isLoading: isLoading2 } = useLLMModels("llm2")

  const queryClient = useQueryClient()

  const [selected, setSelected] = useState(llamaModel || "")
  const [model, setModel] = useState("")

  const updateModel = (v: string = "") => setModel(v)

  async function download(fullData: any) {
    downloadModel({
      id: fullData.id,
      model: fullData.hf_link,
      lable: fullData.name,
      fileName: fullData.file_name,
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["llama-models-downloaded"] })
      },
      onError() { },
    })
  }

  function onSave() {
    if (downloaded?.some((d: any) => d?.fileName?.includes(selected))) {
      const visionModels = ["llava:7b"]
      const model_mode = visionModels.includes(selected) ? "vision" : ""
      updateContext({ llamaModel: selected, model_mode })

    } else {
      toast({
        title: "Model not downloaded yet",
        description: "Please download model to select"
      })
    }
  }

  function closeModel(id: string) {
    if (selected === id) {
      setSelected("")
      updateContext({ llamaModel: "" })
    }
    setModel("")
  }

  function onSelect(v: string) {
    setSelected(v)
    setTimeout(() => {
      const el = document.querySelector("#settings-cont")
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }, 10)
  }

  if (isLoading || isLoading2) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <RadioGroup value={selected} onValueChange={onSelect} className="my-4">
        {
          models?.map((m: any) => (
            <div
              key={m?.name}
              className="p-4 mb-2 text-xs border rounded-md"
            >
              <div className="df mb-2">
                <RadioGroupItem value={m?.file_name} id={m?.file_name} />
                <Label htmlFor={m?.file_name} className="cursor-pointer">
                  {m?.name}
                </Label>
                <a href={m?.info_url} target="_blank" className="mr-auto hover:text-blue-300">
                  <MdInfoOutline />
                </a>
                {
                  downloaded?.some((d: any) => d?.id === m?.id)
                    ? (
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => updateModel(m?.file_name)}
                      >
                        <MdOutlineDeleteOutline />
                      </button>
                    ) :
                    downloads[m?.id] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m?.id]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => download(m)}
                      // disabled={isLoading}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>

              <div className="text-[10px] text-white/80">
                <div className="df justify-between my-1.5">
                  <p>Size: {m?.size}</p>

                  <p className="w-fit px-2 py-0.5 rounded-full bg-input capitalize">{m?.category}</p>
                </div>

                <div className="text-[11px] text-white/60 line-clamp-2">
                  {m?.description}
                </div>
              </div>
            </div>
          ))
        }
      </RadioGroup>

      {
        llamaModel !== selected &&
        <Footer onSave={onSave} />
      }

      {
        model &&
        <DeleteModel
          id={model}
          closeModel={closeModel}
          cancelModel={updateModel}
        />
      }
    </>
  )
}

export default Local
