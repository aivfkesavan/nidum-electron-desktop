import { useState } from "react";

import useContextStore from "@/store/context";

import { useToast } from "@components/ui/use-toast";
import ModelSelect from "../../common/model-select";
import Footer from "../../common/footer";

function Configurations() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)

  const [details, setDetails] = useState({
    ollamaEmbeddingModel,
    ollamEmbeddingUrl,
  })

  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11434")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        let payload = {
          ollamEmbeddingUrl: "http://localhost:11434",
          ollamaEmbeddingModel: "",
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
          <label htmlFor="" className="text-xs opacity-70">Ollama Embedding url</label>

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
          placeholder="http://localhost:11434"
          value={details.ollamEmbeddingUrl}
          onChange={e => onChange({ ollamEmbeddingUrl: e.target.value })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Embedding Model</label>

        <ModelSelect
          ollamaUrl={ollamEmbeddingUrl}
          val={details.ollamaEmbeddingModel}
          onChange={v => onChange({ ollamaEmbeddingModel: v })}
          filterFn={m => m?.details?.family?.includes("bert")}
        />
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Configurations
