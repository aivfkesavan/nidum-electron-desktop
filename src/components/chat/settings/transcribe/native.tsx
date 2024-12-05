import { useState } from "react";
import { MdDownloadDone, MdOutlineFileDownload } from "react-icons/md";

import { useDownloads } from "../../../../components/common/download-manager";
import useContextStore from "../../../../store/context";
import useOnlineStatus from "../../../../hooks/use-online-status";
import { useToast } from "../../../../hooks/use-toast";
import useAuthStore from "../../../../store/auth";

import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { Label } from "../../../../components/ui/label";

import Footer from "../common/footer";

const models = [
  {
    name: "Xenova/whisper-base.en",
    lable: "Whisper Base",
    size: "142 MB",
    required: "500 MB",
    description: "",
  },
  {
    name: "Xenova/whisper-small.en",
    lable: "Whisper Small",
    size: "466 MB",
    required: "4 GB",
    description: "",
  },
]

function Native() {
  const { downloads, downloadXenovaModels } = useDownloads() // downloadWhisperModel, 
  const user_id = useAuthStore(s => s._id)

  const downloaded = useContextStore(s => s?.data?.[user_id]?.nativeSttModelsDownloaded?.split(","))
  const nativeSttModel = useContextStore(s => s?.data?.[user_id]?.nativeSttModel)
  const updateContext = useContextStore(s => s.updateContext)

  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  const [selected, setSelected] = useState(nativeSttModel || "")

  function onSave() {
    if (downloaded.includes(selected)) {
      updateContext({
        nativeSttModel: selected,
        nativeSttModelsDownloaded: Array.from(new Set([...downloaded, selected])).filter(Boolean).join(",")
      })
    } else {
      toast({
        title: "Model not downloaded yet",
        description: "Please download model to select"
      })
    }
  }

  async function reset() {
    try {
      setSelected("")
      updateContext({ nativeSttModelsDownloaded: "", nativeSttModel: "" })
      toast({ title: "Speech to text setup reseted" })

    } catch (error) {
      console.log(error)
    }
  }

  function downloadIt(name: string) {
    downloadXenovaModels({
      name,
      initiater: "xenova",
      onSuccess() {
        updateContext({
          nativeSttModelsDownloaded: [...downloaded, name].join(","),
        })
      },
      onError() {
      }
    })
  }

  return (
    <>
      <RadioGroup value={selected} onValueChange={setSelected} className="mt-4">
        {
          models.map(m => (
            <div
              key={m.name}
              className="p-4 mb-4 text-xs border rounded-md"
            >
              <div className="df mb-2">
                <RadioGroupItem value={m.name} id={m.name} />
                <Label htmlFor={m.name} className="mr-auto cursor-pointer">{m.lable}</Label>
                {
                  downloaded.includes(m.name)
                    ? <MdDownloadDone title="Model downloaded" />
                    :
                    downloads[m.name] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m.name]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => {
                          if (!isOnline) {
                            toast({ title: "Kindly ensure an internet connection to continue." })
                          } else {
                            downloadIt(m.name)
                          }
                        }}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>

              <div className="text-[10px] text-white/70">
                <p>Size: {m.size}</p>
                <p>RAM Required: {m.required}</p>
                <p>Supported Language: English</p>
              </div>
            </div>
          ))
        }
      </RadioGroup>

      {
        nativeSttModel && downloaded.includes(selected) &&
        <div className="df mt-4">
          <p className="text-xs text-white/70">Note: If you face any problem, reset the setup</p>
          <button
            onClick={reset}
            className="px-3 text-xs bg-red-500/50 hover:bg-red-500"
          >
            Reset
          </button>
        </div>
      }

      {
        selected !== nativeSttModel &&
        <Footer onSave={onSave} />
      }
    </>
  )
}

export default Native
