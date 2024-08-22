import useContextStore from "@/store/context";
import ModelSelect from "@components/chat/settings/model/ollama/model-select";
import { useToast } from "@components/ui/use-toast";

function Configurations() {
  const updateContext = useContextStore(s => s.updateContext)
  const embeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const embeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)

  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11434")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        updateContext({
          ollamEmbeddingUrl: "http://localhost:11434",
          ollamaEmbeddingModel: "",
        })
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })

      console.log(error)
    }
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
          value={embeddingUrl}
          onChange={e => updateContext({ ollamEmbeddingUrl: e.target.value })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Embedding Model</label>

        <ModelSelect
          ollamaUrl={embeddingUrl}
          val={embeddingModel}
          onChange={v => updateContext({ ollamaEmbeddingModel: v })}
          filterFn={m => m?.details?.family?.includes("bert")}
        />
      </div>
    </>
  )
}

export default Configurations
