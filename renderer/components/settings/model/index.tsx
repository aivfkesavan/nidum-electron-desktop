import useContextStore from "@/store/context";

import SelectModel from "./select-model";
import Ollama from "./ollama";
// import Nidum from "./nidum";
import Groq from "./groq";

function Model() {
  const modelType = useContextStore(s => s.model_type)

  return (
    <div>
      <SelectModel />

      {
        modelType === "Ollama" && <Ollama />
      }

      {
        modelType === "Groq" && <Groq />
      }

      {/* {
        modelType === "Nidum" && <Nidum />
      } */}
    </div>
  )
}

export default Model
