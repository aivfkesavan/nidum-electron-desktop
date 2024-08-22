import { useEffect, useState } from "react";

import useContextStore from "@/store/context";

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
  const [voices, setVoices] = useState(() => {
    const synth = window.speechSynthesis
    const allVoices = synth.getVoices()
    return allVoices.filter(voice => voice.lang.startsWith('en-')) || []
  })

  const updateContext = useContextStore(s => s.updateContext)
  const webEnabled = useContextStore(s => s.webEnabled)
  const model_type = useContextStore(s => s.model_type)
  const voice = useContextStore(s => s.voice)

  useEffect(() => {
    setTimeout(() => {
      const synth = window.speechSynthesis
      const allVoices = synth.getVoices()
      const filtered = allVoices.filter(voice => voice.lang.startsWith('en-')) || []
      if (filtered.length > 0) {
        setVoices(filtered)
      }
    }, 300);
  }, [])

  return (
    <div className="">
      <div className="mb-2">
        <label className="mb-0.5 text-xs opacity-70">Server</label>

        <Select value={model_type} onValueChange={v => updateContext({ model_type: v as any })}>
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

        <Select value={voice} onValueChange={v => updateContext({ voice: v as any })}>
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

      <div className="df mb-2">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Web Search</label>
        <Switch
          checked={webEnabled}
          onCheckedChange={val => updateContext({ webEnabled: val })}
          title="Enable web search"
        />
      </div>
    </div>
  )
}

export default General
