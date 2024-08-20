import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";
import useContextStore from "@store/context";
import ModelInfo from "./model-info";
import DeleteModel from "./delete-model";

// const models = [
//   {
//     label: "nidum-2b",
//     value: "nidum_ai_2b",
//   },
//   {
//     label: "llama3.1-8b",
//     value: "llama3.1",
//   },
//   {
//     label: "gemma2-2b",
//     value: "gemma2:2b",
//   },
//   {
//     label: "mistral-7b",
//     value: "mistral",
//   },
//   {
//     label: "other",
//     value: "other",
//   },
// ]

function Manage() {
  const [model, setModel] = useState("")
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const { data, isLoading } = useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: getOllamaTags,
  })

  const updateModel = (v: string = "") => setModel(v)

  return (
    <>
      <div className="mb-4">
        <h6 className="mb-0.5 text-[11px] text-white/70">Available Models</h6>

        {
          !isLoading && data?.map(m => (
            <ModelInfo
              key={m?.model}
              size={m?.size}
              name={m?.name}
              model={m?.model}
              quantization_level={m?.details?.quantization_level}
              updateModel={updateModel}
            />
          ))
        }
      </div>

      {
        model &&
        <DeleteModel
          id={model}
          closeModel={updateModel}
        />
      }
    </>
  )
}

export default Manage
