import useContextStore from "@/store/context";

type props = {
  onOpenChange: (v: boolean) => void
}

function Rag({ onOpenChange }: props) {
  const updateContext = useContextStore(s => s.updateContext)
  const ragRetrieval = useContextStore(s => s.ragRetrieval)

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs">RAG Retrieval Limit</label>

        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows text-sm px-2 py-1.5 bg-transparent border"
          placeholder="10"
          value={ragRetrieval}
          onChange={e => updateContext({ ragRetrieval: e.target.valueAsNumber })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Text Chunk Size</label>

        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows text-sm px-2 py-1.5 bg-transparent border"
          placeholder="100"
          defaultValue={100}
        // value={ragRetrieval}
        // onChange={e => updateContext({ ragRetrieval: e.target.valueAsNumber })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs">Text Chunk Overlap</label>

        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows text-sm px-2 py-1.5 bg-transparent border"
          placeholder="20"
          defaultValue={20}
        // value={ragRetrieval}
        // onChange={e => updateContext({ ragRetrieval: e.target.valueAsNumber })}
        />
      </div>
    </div>
  )
}

export default Rag
