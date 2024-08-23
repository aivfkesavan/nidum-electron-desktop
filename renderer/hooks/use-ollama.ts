import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";

export function useOllamaModels(ollamaUrl: string) {
  return useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: () => getOllamaTags(ollamaUrl),
    enabled: !!ollamaUrl,
  })
}
