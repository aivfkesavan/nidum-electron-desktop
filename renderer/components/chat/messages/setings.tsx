import { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Info from "@/components/common/info";
import WebEnable from "./web-enable";

type props = {
  project_id: string
}

function Setings({ project_id }: props) {
  const [voices, setVoices] = useState(() => {
    const synth = window.speechSynthesis
    const allVoices = synth.getVoices()
    return allVoices.filter(voice => voice.lang.startsWith('en-')) || []
  })

  const projectdetails = useConvoStore(s => s.projects[project_id] || null)
  const editProject = useConvoStore(s => s.editProject)

  const updateContext = useContextStore(s => s.updateContext)
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

  const onChange = (key: string, val: number | string | boolean) => {
    editProject(project_id, {
      [key]: val
    })
  }

  return (
    <Dialog>
      <DialogTrigger className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input">
        <MdSettings className="text-xl text-white/60" />
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mb-2 font-medium text-primary" autoFocus tabIndex={0}>
            Settings
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h6 className="mb-2 text-base text-primary">Chat Settings</h6>

            <div className="mb-2">
              <p className="df mb-0.5 text-xs">
                <span className="opacity-70">Temperature</span>
                <Info details="Controls the randomness of the model's responses. Lower values (e.g., 0.1) make the output more deterministic and focused, while higher values (e.g., 1.0) make it more random and creative." />
              </p>
              <input
                min={0}
                max={1}
                step={0.1}
                type="number"
                className="no-number-arrows px-2 py-1 text-[13px] bg-secondary/70 resize-none"
                value={projectdetails?.temperature || ""}
                onChange={e => onChange("temperature", e.target.valueAsNumber)}
              />
            </div>

            <div className="mb-2">
              <p className="df mb-0.5 text-xs">
                <span className="opacity-70">Max Tokens</span>
                <Info details="The maximum number of tokens the model can generate in a single response. Limiting this helps manage response length and resource usage." />
              </p>
              <input
                min={1}
                step={1}
                type="number"
                className="no-number-arrows px-2 py-1 text-[13px] bg-secondary/70 resize-none"
                value={projectdetails?.max_tokens || ""}
                onChange={e => onChange("max_tokens", e.target.valueAsNumber)}
              />
            </div>

            <div className="mb-2">
              <p className="df mb-0.5 text-xs">
                <span className="opacity-70">Repeat Penalty</span>
                <Info details="A parameter that discourages the model from repeating the same text. A higher penalty value reduces repetition, making responses more varied." />
              </p>
              <input
                min={-2}
                max={2}
                step={.1}
                type="number"
                className="no-number-arrows px-2 py-1 text-[13px] bg-secondary/70 resize-none"
                value={projectdetails?.frequency_penalty || projectdetails?.frequency_penalty === 0 ? projectdetails?.frequency_penalty : ""}
                onChange={e => onChange("frequency_penalty", e.target.valueAsNumber)}
              />
            </div>

            <div className="mb-2">
              <p className="df mb-0.5 text-xs">
                <span className="opacity-70">Top P Sampling</span>
                <Info details="Adjusts the probability threshold for token sampling. Setting this to 1 means the model considers all possible tokens, while lower values limit the selection to more likely tokens, improving coherence." />
              </p>

              <input
                min={0}
                max={1}
                step={.1}
                type="number"
                className="no-number-arrows px-2 py-1 text-[13px] bg-secondary/70 resize-none"
                value={projectdetails?.top_p || ""}
                onChange={e => onChange("top_p", e.target.valueAsNumber)}
              />
            </div>

            <div className="mb-2">
              <p className="df mb-0.5 text-xs">
                <span className="opacity-70">Token Limit</span>
                <Info details="A Token Limit in a Large Language Model (LLM) refers to the maximum number of tokens (words or characters) the model can process in a single interaction. Staying within this limit ensures optimal performance and accurate responses." />
              </p>
              <input
                min={1}
                step={1}
                type="number"
                className="no-number-arrows px-2 py-1 text-[13px] bg-secondary/70 resize-none"
                value={projectdetails?.tokenLimit || ""}
                onChange={e => onChange("tokenLimit", e.target.valueAsNumber)}
              />
            </div>
          </div>

          <div className="md:pl-6 md:border-l">
            <h6 className="mb-0.5 text-base text-primary">General Settings</h6>

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
              <WebEnable />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Setings
