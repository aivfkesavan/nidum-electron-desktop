import { FormProvider, useForm } from "react-hook-form";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function OpenAI() {
  const updateContext = useContextStore(s => s.updateContext)
  const openaiApiKey = useContextStore(s => s.openaiApiKey)
  const openaiModel = useContextStore(s => s.openaiModel)

  const { isLoading, data: models } = useLLMModels("openai")

  const methods = useForm({
    defaultValues: {
      openaiApiKey,
      openaiModel,
    }
  })
  const isDirty = methods?.formState?.isDirty

  function onSave(data: any) {
    updateContext(data)
  }

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledInput
          name="openaiApiKey"
          label="OpenAI API Key"
          placeholder="432v-vjhfuyfjhb-2387r-2387rh27n3r"
        />

        <ControlledSelect
          name="openaiModel"
          label="Model"
          list={models}
        />

        <div className="mb-12 text-xs text-white/60">
          Click here to sign up for a OpenAI account: <a href="https://platform.openai.com?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://platform.openai.com</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default OpenAI
