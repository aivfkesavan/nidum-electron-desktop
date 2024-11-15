import { FormProvider, useForm } from "react-hook-form";

import useContextStore from "../../../../store/context";

import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function Groq() {
  const updateContext = useContextStore(s => s.updateContext)
  const sttGroqApiKey = useContextStore(s => s.sttGroqApiKey)

  const methods = useForm({
    defaultValues: {
      sttGroqApiKey,
    }
  })
  const isDirty = methods?.formState?.isDirty

  function onSave(data: any) {
    updateContext(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledInput
          name="sttGroqApiKey"
          label="Groq api key"
          placeholder="gsk_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
        />

        <div className="mt-6 text-xs text-white/60">
          Click here to sign up for a Groq developer account: <a href="https://console.groq.com/login" className=" text-white/90 hover:underline" target="_blank">https://console.groq.com/login</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Groq
