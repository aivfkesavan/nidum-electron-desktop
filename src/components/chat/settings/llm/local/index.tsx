import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useLLamaDownloadedModels } from "../../../../../hooks/use-llm-models";
import { useDownloads } from "../../../../common/download-manager";
import { useLLMModels } from "../../../../../hooks/use-llm-models";
import useOnlineStatus from "../../../../../hooks/use-online-status";
import useContextStore from "../../../../../store/context";
import { useToast } from "../../../../../hooks/use-toast";
import useAuthStore from "../../../../../store/auth";

import { RadioGroup } from "../../../../ui/radio-group";
import UploadLocalLlm from "../../../modals/upload-local-llm";
import DeleteModel from "./delete-model";
import Footer from "../../common/footer";
import Card from "./card";

function Local() {
  const { downloads, downloadModel } = useDownloads()
  const isOnline = useOnlineStatus()

  const user_id = useAuthStore(s => s._id)
  const llamaModel = useContextStore(s => s?.data?.[user_id]?.llamaModel)

  const updateContext = useContextStore(s => s.updateContext)

  const { toast } = useToast()

  const { data: downloaded, isLoading } = useLLamaDownloadedModels("downloaded")
  const { data: uploaded, isLoading: isLoading3 } = useLLamaDownloadedModels("uploaded")
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
        description: "Please download the required model to proceed."
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
      <UploadLocalLlm />

      <RadioGroup value={selected} onValueChange={onSelect} className="my-4">
        {
          models?.map((m: any) => (
            <Card
              key={m?.id}
              name={m?.name}
              fileName={m?.file_name}
              info_url={m?.info_url}
              size={m?.size}
              category={m?.category}
              description={m?.description}
              progress={downloads[m?.id]?.progress ?? false}
              isDownloaded={downloaded && downloaded?.some((d: any) => d?.id === m?.id)}
              updateModel={updateModel}
              onDownload={() => {
                if (!isOnline) {
                  toast({ title: "Please ensure your device is connected to the internet to proceed." })
                } else {
                  download(m)
                }
              }}
            />
          ))
        }

        {
          uploaded?.map((m: any) => (
            <Card
              key={m?.id}
              name={m?.name}
              fileName={m?.fileName}
              size={m?.size}
              category={m?.download_link ? "Hugging Face Model" : "Local Model"}
              description={m?.description}
              progress={downloads[m?.id]?.progress ?? false}
              isDownloaded={downloaded && downloaded?.some((d: any) => d?.id === m?.id)}
              updateModel={updateModel}
              onDownload={() => { }}
            />
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
