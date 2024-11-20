import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useConfig, useConfigMutaate } from "../../../hooks/use-config";
import { llmT, useLLMModels } from "../../../hooks/use-llm-models";

type configKeys =
  "groqApiKey" | "groqModel" |
  "hfApiKey" | "hfModel" |
  "sambaNovaApiKey" | "sambaNovaModel" |
  "anthropicApiKey" | "anthropicModel" |
  "openaiApiKey" | "openaiModel" |
  "sttGroqApiKey"

function useConfigData(model: llmT, values: configKeys[]) {
  const { isLoading: isLoading1, data: models } = useLLMModels(model)
  const { isLoading: isLoading2, data: config } = useConfig()

  const { mutate } = useConfigMutaate()

  const methods = useForm()

  useEffect(() => {
    if (config) {
      const formData = values.reduce((prev: any, curr) => {
        prev[curr] = config[curr]
        return prev
      }, {})
      methods.reset(formData)
    }
  }, [config])

  function onSave(data: any) {
    mutate(
      {
        _id: config?._id,
        ...data,
      },
      {
        onSuccess() {
          methods.reset(data)
        }
      }
    )
  }

  const isLoading = isLoading1 || isLoading2
  const isDirty = methods?.formState?.isDirty

  return {
    models,
    methods,
    isDirty,
    isLoading,
    onSave,
  }
}

export default useConfigData
