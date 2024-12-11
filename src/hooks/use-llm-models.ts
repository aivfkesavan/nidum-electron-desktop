import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getHFModelDetails, getHFModelTree, getLLMModels, getLLamaDownloadedModels, modelTypeT, uploadHFModel, uploadModel } from "../actions/llms";
import { useToast } from "./use-toast";

export type llmT = "llm" | "llm2" | "groq" | "hf" | "hf-img-gen" | "sambanova-systems" | "anthropic" | "openai" | "nidum-decentralised" | "nidum-decentralised2" | ""

export function useLLMModels(llm: llmT) {
  return useQuery({
    queryKey: [`${llm}-models`],
    queryFn: () => getLLMModels(llm),
    enabled: !!llm,
    gcTime: Infinity,
  })
}

export function useHFModel(id: string) {
  return useQuery({
    queryKey: ["hf-model", id],
    queryFn: () => getHFModelDetails(id),
    enabled: !!id,
  })
}

export function useHFModelTree(id: string) {
  return useQuery({
    queryKey: ["hf-model-tree", id],
    queryFn: () => getHFModelTree(id),
    enabled: !!id,
  })
}

export function useLLamaDownloadedModels(type: modelTypeT) {
  return useQuery({
    queryKey: ["llama-models-downloaded", type],
    queryFn: () => getLLamaDownloadedModels(type),
    enabled: !!type,
  })
}

export function useUploadModel() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: uploadModel,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["llama-models-downloaded"] })
      toast({ title: "New Model added successfully" })
    },
    onError(err) {
      toast({ title: err?.message || "An error occurred. Please try again." })
    }
  })
}

export function useUploadHFModel() {
  return useMutation({
    mutationFn: uploadHFModel
  })
}
