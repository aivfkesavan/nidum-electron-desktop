import { useState } from "react";
import useContextStore from "@store/context";

import { useToast } from "@components/ui/use-toast";
import ModelSelect from "../../common/model-select";
import Footer from "../../common/footer";

function Configurations() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaModel = useContextStore(s => s.ollamaModel)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const [details, setDetails] = useState({
    ollamaModel,
    ollamaUrl,
  })

  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11490")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        let payload = {
          ollamaUrl: "http://localhost:11490",
          ollamaModel: "",
        }
        setDetails(payload)
        updateContext(payload)
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })

      console.log(error)
    }
  }

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
      <div className="mb-4">
        <div className="df justify-between mb-0.5">
          <label htmlFor="" className="text-xs opacity-70">Ollama base url</label>

          <button
            className="px-2 py-0.5 text-xs bg-input hover:bg-input/50"
            onClick={checkAutoDetect}
          >
            Auto detect
          </button>
        </div>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="http://localhost:11490"
          value={details.ollamaUrl}
          onChange={e => onChange({ ollamaUrl: e.target.value })}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="" className="text-xs opacity-70">Ollama Model Name</label>

        <ModelSelect
          ollamaUrl={ollamaUrl}
          val={details.ollamaModel}
          onChange={v => onChange({ ollamaModel: v })}
          filterFn={m => !m?.details?.family?.includes("bert")}
        />
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Configurations
