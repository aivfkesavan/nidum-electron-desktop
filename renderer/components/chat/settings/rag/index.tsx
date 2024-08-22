import { useState } from "react";
import useContextStore from "@/store/context";
import Footer from "../common/footer";

function Rag() {
  const updateContext = useContextStore(s => s.updateContext)
  const ragRetrieval = useContextStore(s => s.ragRetrieval)

  const [details, setDetails] = useState({
    ragRetrieval,
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
      <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs">RAG Retrieval Limit</label>

        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows text-sm px-2 py-1.5 bg-transparent border"
          placeholder="10"
          value={details.ragRetrieval}
          onChange={e => onChange({ ragRetrieval: e.target.valueAsNumber })}
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
        // value={details.ragRetrieval}
        // onChange={e => onChange({ ragRetrieval: e.target.valueAsNumber })}
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
        // value={details.ragRetrieval}
        // onChange={e => onChange({ ragRetrieval: e.target.valueAsNumber })}
        />
      </div>

      <Footer onSave={onSave} />
    </>
  )
}

export default Rag
