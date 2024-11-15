import { FormProvider, useForm } from "react-hook-form";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const groqApiKey = useContextStore(s => s.groqApiKey)
  const groqModel = useContextStore(s => s.groqModel)

  const { isLoading, data: models } = useLLMModels("groq")

  const methods = useForm({
    defaultValues: {
      groqApiKey,
      groqModel,
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
          name="groqApiKey"
          label="Groq API Key"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
        />

        <ControlledSelect
          name="groqModel"
          label="Model"
          list={models}
        />

        <div className="mb-12 text-xs text-white/60">
          Click here to sign up for a Groq account: <a href="https://console.groq.com/login?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Groq
