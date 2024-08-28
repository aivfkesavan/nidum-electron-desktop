import { useState } from "react";
import useContextStore from "@/store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "../common/footer";

const models = [
  {
    name: "Llama Guard 3 8B",
    id: "llama-guard-3-8b",
  },
  {
    name: "Meta Llama 3 70B",
    id: "llama3-70b-8192",
  },
  {
    name: "Meta Llama 3 8B",
    id: "llama3-8b-8192",
  },
  {
    name: "Mixtral 8x7B",
    id: "mixtral-8x7b-32768",
  },
  {
    name: "Gemma 7B",
    id: "gemma-7b-it",
  },
  {
    name: "Gemma 2 9B",
    id: "gemma2-9b-it",
  },
  {
    name: "Whisper",
    id: "whisper-large-v3",
  },
]

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const groqApiKey = useContextStore(s => s.groqApiKey)
  const groqModel = useContextStore(s => s.groqModel)

  const [details, setDetails] = useState({
    groqApiKey,
    groqModel,
  })

  function onChange(payload: Record<string, any>) {
    setDetails(pr => ({
      ...pr,
      ...payload,
    }))
  }

  function onSave() {
    updateContext(details)
  }

  return (
    <>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Groq api key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={details.groqApiKey}
          onChange={e => onChange({ groqApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Model</label>

        <Select value={details.groqModel} onValueChange={v => onChange({ groqModel: v })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Model" />
          </SelectTrigger>

          <SelectContent>
            {
              models.map(m => (
                <SelectItem
                  value={m.id}
                  key={m.id}
                >
                  {m.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div className="mb-12 text-xs text-white/60">
        Click here to sign up for a Groq developer account: <a href="https://console.groq.com/login?ref=ragdrive.com" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Groq
