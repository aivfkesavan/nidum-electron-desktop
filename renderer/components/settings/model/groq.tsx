import useContextStore from "@/store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const apiKey = useContextStore(s => s.groqApiKey)
  const model = useContextStore(s => s.groqModel)

  return (
    <div>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Groq api key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={apiKey}
          onChange={e => updateContext({ groqApiKey: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="" className="mb-0.5 text-xs">Model</label>

        <Select value={model} onValueChange={v => updateContext({ groqModel: v })}>
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

      <div className="mt-6 text-xs text-white/60">
        Click here to sign up for a Groq developer account: <a href="https://console.groq.com/login" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
      </div>
    </div>
  )
}

export default Groq
