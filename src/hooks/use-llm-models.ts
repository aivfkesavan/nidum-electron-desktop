import { useQuery } from "@tanstack/react-query";

import { getLLMModels, getLLamaDownloadedModels } from "../actions/llms";

export type llmT = "llm" | "llm2" | "groq" | "hf" | "hf-img-gen" | "sambanova-systems" | "anthropic" | "openai" | "nidum-decentralised" | "nidum-decentralised2" | ""

export function useLLMModels(llm: llmT) {
  return useQuery({
    queryKey: [`${llm}-models`],
    queryFn: () => getLLMModels(llm),
    enabled: !!llm,
    gcTime: Infinity,
  })
}

export function useLLamaDownloadedModels() {
  return useQuery({
    queryKey: ["llama-models-downloaded"],
    queryFn: getLLamaDownloadedModels,
  })
}
