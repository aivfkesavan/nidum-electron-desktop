import useContextStore from "@/store/context";
import Copy from "../copy";

function Ollama() {
  const updateContext = useContextStore(s => s.updateContext)
  const embeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const embeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)

  return (
    <div>
      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Embedding URL</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="http://localhost:11434"
          value={embeddingUrl}
          onChange={e => updateContext({ ollamEmbeddingUrl: e.target.value })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Embedding Model</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="mxbai-embed-large"
          value={embeddingModel}
          onChange={e => updateContext({ ollamaEmbeddingModel: e.target.value })}
        />
      </div>

      <div className="mt-8 text-sm">
        <p className="mb-4 text-white/60">To get started,</p>
        <ul className="pl-5 list-decimal text-white/80">
          <li className="mb-4">Open <span className="font-medium text-white">TWO Terminals</span></li>
          <li className="mb-4 space-y-2">
            <div>In the first, start the ollama server</div>
            <Copy val="OLLAMA_ORIGINS='*' OLLAMA_HOST=localhost:11434 ollama serve" />
          </li>
          <li className="mb-4 space-y-2">
            <div>In the second, run the ollama CLI (using the mxbai-embed-large model)</div>
            <Copy val="ollama pull mxbai-embed-large" />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Ollama
