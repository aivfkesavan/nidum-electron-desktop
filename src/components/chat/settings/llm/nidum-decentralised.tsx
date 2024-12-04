import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";

import ControlledSelect from "../common/controlled-select";
import Footer from "../common/footer";

function NidumDecentralised() {
  const user_id = useAuthStore(s => s._id)

  const nidumDecentralisedModel = useContextStore(s => s?.data?.[user_id]?.nidumDecentralisedModel)
  const updateContext = useContextStore(s => s.updateContext)

  const { data: nidumCentralised, isLoading } = useLLMModels("nidum-decentralised2")

  const methods = useForm({
    defaultValues: {
      nidumDecentralisedModel,
    }
  })

  useEffect(() => {
    if (!nidumDecentralisedModel && nidumCentralised?.models) {
      const model = nidumCentralised?.models?.[0]
      const selectedModel = model?.id
      const model_mode = model?.model_mode || ""
      updateContext({
        nidumDecentralisedModel: selectedModel,
        model_mode,
      })
      methods.reset({
        nidumDecentralisedModel: selectedModel,
      })
    }
  }, [nidumDecentralisedModel, nidumCentralised?.models])

  function onSave(data: any) {
    const model_mode = nidumCentralised?.models?.find((d: any) => d?.id === data?.nidumDecentralisedModel)?.model_mode || ""

    updateContext({
      nidumDecentralisedModel: data?.nidumDecentralisedModel,
      model_mode,
    })
    methods.reset({
      nidumDecentralisedModel: data?.nidumDecentralisedModel,
    })
  }

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledSelect
          name="nidumDecentralisedModel"
          label="Model"
          list={nidumCentralised?.models}
        />

        <div className="text-xs text-zinc-400/90">
          Nidum AI: Decentralized, diverse, unrestricted AI, powered by Nidum AI.
        </div>

        {methods?.formState?.isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default NidumDecentralised
