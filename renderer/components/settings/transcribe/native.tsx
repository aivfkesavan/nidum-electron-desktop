import { useState } from "react";

import useContextStore from "@store/context";
import constants from "@utils/constants";

import { Progress } from "@/components/ui/progress";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const models = ["medium.en", "tiny", "tiny.en", "base", "base.en", "small", "small.en", "medium", "large-v1", "large-v2", "large-v3"]

function Native() {
  const downloaded = useContextStore(s => s?.nativeSttModelsDownloaded?.split(","))
  const nativeSttModel = useContextStore(s => s.nativeSttModel)
  const updateContext = useContextStore(s => s.updateContext)

  const [downloadimg, setDownloading] = useState<any>(null)
  const [selected, setSelected] = useState(nativeSttModel || "")

  async function download() {
    try {
      const response = await fetch(`${constants.backendUrl}/whisper/${selected}`)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n\n')

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))
            console.log('Progress:', data)
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
  }

  return (
    <div>

      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="py-0 h-6 text-xs text-white/80 bg-input/80 rounded rounded-b-none border-0 focus:ring-0">
          <SelectValue placeholder="Server" />
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

      {
        !downloaded.includes(selected) && !downloadimg &&
        <button className="" onClick={download}>
          Download
        </button>
      }

      <div>
        <Progress value={33} />
        <div className="df justify-between text-xs text-white/60">
          <p>Soem vhkda </p>
          <p>0%</p>
        </div>
      </div>
    </div>
  )
}

export default Native
