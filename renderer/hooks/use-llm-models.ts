import { useQuery } from "@tanstack/react-query";

import { getLLMModels } from "@actions/llms";

type llmT = "llm" | "groq" | "hf" | "hf-img-gen" | "sambanova-systems" | "anthropic" | "openai"

export function useLLMModels(llm: llmT) {
  return useQuery({
    queryKey: [`${llm}-models`],
    queryFn: () => getLLMModels(llm)
  })
}
