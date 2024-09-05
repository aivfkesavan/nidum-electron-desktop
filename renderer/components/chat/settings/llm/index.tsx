import useContextStore from "@/store/context";

import SelectModel from "./select-model";
import HuggingFace from "./hugging-face";
import Ollama from "./ollama";
// import Nidum from "./nidum";
import Groq from "./groq";

function Model() {
  const modelType = useContextStore(s => s.model_type)

  return (
    <>
      <SelectModel />

      {
        modelType === "Ollama" && <Ollama />
      }

      {
        modelType === "Groq" && <Groq />
      }

      {
        modelType === "Hugging Face" && <HuggingFace />
      }

      {/* {
        modelType === "Nidum" && <Nidum />
      } */}
    </>
  )
}

export default Model
