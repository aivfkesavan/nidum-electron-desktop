import { FormProvider, useForm } from "react-hook-form";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function SambavaNova() {
  const updateContext = useContextStore(s => s.updateContext)
  const sambaNovaApiKey = useContextStore(s => s.sambaNovaApiKey)
  const sambaNovaModel = useContextStore(s => s.sambaNovaModel)

  const { isLoading, data: models } = useLLMModels("sambanova-systems")

  const methods = useForm({
    defaultValues: {
      sambaNovaApiKey,
      sambaNovaModel,
    }
  })
  const isDirty = methods?.formState?.isDirty

  function onSave(data: any) {
    updateContext(data)
    methods.reset(data)
  }

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledInput
          name="sambaNovaApiKey"
          label="SambaNova API Key"
          placeholder="432v-vjhfuyfjhb-2387r-2387rh27n3r"
        />

        <ControlledSelect
          name="sambaNovaModel"
          label="Model"
          list={models}
        />

        <div className="mb-12 text-xs text-white/60">
          Click here to sign up for a SambaNova Systems account: <a href="https://cloud.sambanova.ai?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://cloud.sambanova.ai</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default SambavaNova
