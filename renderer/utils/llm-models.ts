import type { llm_modelsT } from "@store/context";

type listT = {
  id: string
  title: llm_modelsT
  logo: string
  para: string
}

const llmModels: listT[] = [
  {
    id: "1",
    logo: "/logo.png",
    title: "Ollama",
    para: "Run AI models locally on your machine"
  },
  {
    id: "2",
    logo: "/groq.png",
    title: "Groq",
    para: "The fastest LLM inferencing from Groq's LPUs"
  },
  {
    id: "3",
    logo: "/hugging-face.png",
    title: "Hugging Face",
    para: "The fastest LLM inferencing from Hugging Face's LPUs"
  },
  // {
  //   id: "3",
  //   logo: "/logo.png",
  //   title: "Nidum",
  //   para: "Best uncensored inferencing for Agents and Tools"
  // },
]

export default llmModels