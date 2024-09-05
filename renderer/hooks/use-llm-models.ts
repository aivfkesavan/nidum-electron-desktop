import { useQuery } from "@tanstack/react-query";

import { getLLMModels } from "@actions/llms";

type llmT = "llm" | "groq" | "hf"

export function useLLMModels(llm: llmT) {
  return useQuery({
    queryKey: [`${llm}-models`],
    queryFn: () => getLLMModels(llm)
  })
}
