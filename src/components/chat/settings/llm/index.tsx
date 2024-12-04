import useContextStore from "../../../../store/context";

import NidumDecentralised from "./nidum-decentralised";
import SelectModel from "./select-model";
import HuggingFace from "./hugging-face";
import NidumShared from "./nidum-shared";
import SambavaNova from "./sambanova";
import Anthropic from "./anthropic";
import Ollama from "./ollama";
import OpenAI from "./openai";
import Local from "./local";
import Groq from "./groq";
import useAuthStore from "../../../../store/auth";

function Model() {
  const user_id = useAuthStore(s => s._id)
  const modelType = useContextStore(s => s?.data?.[user_id]?.model_type)

  return (
    <>
      <SelectModel />

      {
        modelType === "Local" && <Local />
      }

      {
        modelType === "Nidum Shared" && <NidumShared />
      }

      {
        modelType === "Nidum Decentralized" && <NidumDecentralised />
      }

      {
        modelType === "Groq" && <Groq />
      }

      {
        modelType === "Hugging Face" && <HuggingFace />
      }

      {
        modelType === "SambaNova Systems" && <SambavaNova />
      }

      {
        modelType === "Anthropic" && <Anthropic />
      }

      {
        modelType === "OpenAI" && <OpenAI />
      }

      {
        modelType === "Ollama" && <Ollama />
      }
    </>
  )
}

export default Model
