import { FormProvider } from "react-hook-form";

import useConfigData from "../use-config-data";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function Groq() {
  const { methods, models, isLoading, isDirty, onSave } = useConfigData("groq", ["groqApiKey", "groqModel"])

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
