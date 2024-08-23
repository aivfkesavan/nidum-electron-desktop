import { useState } from "react";
import { MdDownloadDone, MdOutlineFileDownload } from "react-icons/md";

import { useDownloads } from "@components/chat/download-manager/provider";
import useContextStore from "@store/context";
import { useToast } from "@components/ui/use-toast";
import useUIStore from "@store/ui";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const models = [
  { name: "tiny", size: "75 MB", required: "390 MB" },
  { name: "tiny.en", size: "75 MB", required: "390 MB" },
  { name: "base", size: "142 MB", required: "500 MB" },
  { name: "base.en", size: "142 MB", required: "500 MB" },
  { name: "small", size: "466 MB", required: "1.0 GB" },
  { name: "small.en", size: "466 MB", required: "1.0 GB" },
  { name: "medium", size: "1.5 GB", required: "2.6 GB" },
  { name: "medium.en", size: "1.5 GB", required: "2.6 GB" },
  { name: "large-v1", size: "2.9 GB", required: "4.7 GB" },
  { name: "large-v2", size: "2.9 GB", required: "4.7 GB" },
  { name: "large-v3", size: "2.9 GB", required: "4.7 GB" },
]

function Native() {
  const { downloads, downloadWhisperModel } = useDownloads()
  const downloaded = useContextStore(s => s?.nativeSttModelsDownloaded?.split(","))
  const nativeSttModel = useContextStore(s => s.nativeSttModel)
  const updateContext = useContextStore(s => s.updateContext)
  const close = useUIStore(s => s.close)
  const { toast } = useToast()

  const [selected, setSelected] = useState(nativeSttModel || "")

  async function download(model: string) {
    downloadWhisperModel({
      model,
      onSuccess() {
        updateContext({
          nativeSttModelsDownloaded: [...downloaded, model].join(","),
        })
      },
      onError() { },
    })
  }

  function onSave() {
    if (downloaded.includes(selected)) {
      updateContext({
        nativeSttModel: selected,
        nativeSttModelsDownloaded: Array.from(new Set([...downloaded, selected])).filter(Boolean).join(",")
      })
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
      <RadioGroup value={selected} onValueChange={setSelected} className="grid grid-cols-2 gap-4 mt-4">
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
                  downloaded.includes(m.name)
                    ? <MdDownloadDone title="Model downloaded" />
                    :
                    downloads[m.name] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[m.name]?.title === "Whisper" ? <span className="loader-2 block size-3 border"></span> : `${downloads[m.name]?.progress}%`}
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => download(m.name)}
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

      <button onClick={() => updateContext({ nativeSttModelsDownloaded: "", nativeSttModel: "" })}>
        clear
      </button>
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

export default Native
