import { useState } from "react";

import { useLLMModels } from "@hooks/use-llm-models";
import useContextStore from "@/store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Footer from "../common/footer";

function HuggingFace() {
  const updateContext = useContextStore(s => s.updateContext)
  const hfApiKey = useContextStore(s => s.hfApiKey)
  const hfModel = useContextStore(s => s.hfModel)

  const { isLoading, data: models } = useLLMModels("hf")

  const [details, setDetails] = useState({
    hfApiKey,
    hfModel,
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

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Hugging Face api key</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="hf_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
          value={details.hfApiKey}
          onChange={e => onChange({ hfApiKey: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Model</label>

        <Select value={details.hfModel} onValueChange={v => onChange({ hfModel: v })}>
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

      <Footer onSave={onSave} />
    </>
  )
}

export default HuggingFace
