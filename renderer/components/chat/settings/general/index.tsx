import { useState } from "react";

import useContextStore from "@/store/context";
import useVoices from "./use-voices";

import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type props = {
  onOpenChange: (v: boolean) => void
}

function General({ onOpenChange }: props) {
  const voices = useVoices()

  const updateContext = useContextStore(s => s.updateContext)
  const webEnabled = useContextStore(s => s.webEnabled)
  const model_type = useContextStore(s => s.model_type)
  const voice = useContextStore(s => s.voice)

  const [details, setDetails] = useState({
    webEnabled,
    model_type,
    voice,
  })

  function onChange(payload: Record<string, any>) {
    setDetails(pr => ({
      ...pr,
      ...payload,
    }))
  }

  function onSubmit() {
    updateContext(details)
    onOpenChange(false)
  }

  return (
    <>
      <div className="mb-2">
        <label className="mb-0.5 text-xs opacity-70">Server</label>

        <Select value={details.model_type} onValueChange={v => onChange({ model_type: v })}>
          <SelectTrigger className="w-full h-8 text-sm">
            <SelectValue placeholder="Server" />
          </SelectTrigger>

          <SelectContent>
            {/* <SelectItem value="Nidum">Nidum</SelectItem> */}
            <SelectItem value="Ollama">Ollama</SelectItem>
            <SelectItem value="Groq">Groq</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <label className="mb-0.5 text-xs opacity-70">Voice</label>

        <Select value={details.voice} onValueChange={v => onChange({ voice: v })}>
          <SelectTrigger className="w-full h-8 text-sm">
            <SelectValue placeholder="Voice" />
          </SelectTrigger>

          <SelectContent>
            {
              voices.map(v => (
                <SelectItem
                  key={v.name}
                  value={v.name}
                >
                  {v.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div className="df mb-12">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Web Search</label>
        <Switch
          checked={details.webEnabled}
          onCheckedChange={val => onChange({ webEnabled: val })}
          title="Enable web search"
        />
      </div>

      <div className="df justify-between">
        <button
          onClick={() => onOpenChange(false)}
          className="w-20 py-1.5 text-[13px] text-white/70 border hover:text-white hover:bg-input"
        >
          Cancel
        </button>

        <button
          className="w-20 py-1.5 text-[13px] bg-black/60 hover:bg-input"
          onClick={onSubmit}
        >
          Save
        </button>
      </div>
    </>
  )
}

export default General
