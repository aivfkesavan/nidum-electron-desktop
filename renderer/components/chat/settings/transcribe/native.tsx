import { useState } from "react";

import useContextStore from "@store/context";
import constants from "@utils/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const models = ["medium.en", "tiny", "tiny.en", "base", "base.en", "small", "small.en", "medium", "large-v1", "large-v2", "large-v3"]
const modelSizes = {
  "tiny": 78643200,
  "tiny.en": 78643200,
  "base": 148897792,
  "base.en": 148897792,
  "small": 488636416,
  "small.en": 488636416,
  "medium": 1572864000,
  "medium.en": 1572864000,
  "large-v1": 3113851904,
  "large-v2": 3113851904,
  "large-v3": 3113851904
}

function Native() {
  const downloaded = useContextStore(s => s?.nativeSttModelsDownloaded?.split(","))
  const nativeSttModel = useContextStore(s => s.nativeSttModel)
  const updateContext = useContextStore(s => s.updateContext)

  const [downloading, setDownloading] = useState<any>(null)
  const [selected, setSelected] = useState(nativeSttModel || "")

  async function download() {
    try {
      console.log(downloaded, selected)
      const response = await fetch(`${constants.backendUrl}/whisper/download`, {
        method: "POST",
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selected }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          console.log("at done")
          setDownloading(null)
          updateContext({
            nativeSttModelsDownloaded: [...downloaded, selected].join(","),
            nativeSttModel: selected,
          })
          break
        }

        const chunk = decoder?.decode(value)
        const lines = chunk?.split('\n\n')

        lines?.forEach(line => {
          if (line.startsWith('data: ')) {
            const data = JSON?.parse(line?.slice(6))
            console.log(data)
            if (data) {
              setDownloading(data)
            }
          }
        })
      }

    } catch (error) {
      console.log(error)
    }
  }

  function onChange(model: string) {
    if (downloaded.includes(model)) {
      updateContext({ nativeSttModel: model })
    }
    setSelected(model)
    setDownloading(null)
  }

  return (
    <>
      <div className="mb-6 mt-4">
        <label htmlFor="" className="text-xs opacity-70">Whisper Model</label>

        <Select value={selected} onValueChange={onChange}>
          <SelectTrigger className="h-9 px-2 py-1.5 text-sm bg-transparent border focus:ring-0">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>

          <SelectContent className="[&_svg]:hidden min-w-[100px]">
            {
              models.map(m => (
                <SelectItem
                  className="h-6 px-2 text-xs"
                  value={m}
                  key={m}
                >
                  {m}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {
        !downloaded.includes(selected) && !downloading &&
        <div className="df flex-wrap">
          <p className="text-xs text-white/60">This model downloaded yet. do you like to download it?</p>

          <button
            className="px-2.5 py-1 text-xs bg-input hover:bg-input/70"
            onClick={download}
          >
            Download
          </button>
        </div>
      }

      {
        downloading &&
        <div className="df justify-between text-xs text-white/60">
          <p>{downloading?.name}</p>
          <p>{modelSizes[downloading?.name] ? Math.round((downloading?.progress / modelSizes[downloading?.name]) * 100) || 0 : 0}%</p>
        </div>
      }
    </>
  )
}

export default Native
