import { FormProvider } from "react-hook-form";

import useConfigData from "../use-config-data";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function Anthropic() {
  const { methods, models, isLoading, isDirty, onSave } = useConfigData("anthropic", ["anthropicApiKey", "anthropicModel"])

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledInput
          name="anthropicApiKey"
          label="Anthropic API Key"
          placeholder="432v-vjhfuyfjhb-2387r-2387rh27n3r"
        />

        <ControlledSelect
          name="anthropicModel"
          label="Model"
          list={models}
        />

        <div className="mb-12 text-xs text-white/60">
          Click here to sign up for a Anthropic account: <a href="https://console.anthropic.com/login?ref=nidum.ai" className=" text-white/90 hover:underline" target="_blank">https://console.anthropic.com/login</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Anthropic
