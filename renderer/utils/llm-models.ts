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
    id: "4",
    logo: "/sambanova.png",
    title: "SambaNova Systems",
    para: "Inference API from SambaNova Systems"
  },
  {
    id: "2",
    logo: "/groq.png",
    title: "Groq",
    para: "Fastest LLM inferencing from Groq's LPUs"
  },
  {
    id: "3",
    logo: "/hugging-face.png",
    title: "Hugging Face",
    para: "Inference API from Hugging Face (Serverless)"
  },
  {
    id: "6",
    logo: "/openai.png",
    title: "OpenAI",
    para: "Inference API from OpenAI"
  },
  {
    id: "5",
    logo: "/anthropic.png",
    title: "Anthropic",
    para: "Inference API from Anthropic"
  },
  // {
  //   id: "3",
  //   logo: "/logo.png",
  //   title: "Nidum",
  //   para: "Best uncensored inferencing for Agents and Tools"
  // },
]

export default llmModels