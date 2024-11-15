import { FormProvider, useForm } from "react-hook-form";

import useContextStore from "../../../../store/context";
import useVoices from "./use-voices";

import ControlledSelect from "../common/controlled-select";
import Footer from "../common/footer";

function Native() {
  const voices = useVoices()

  const updateContext = useContextStore(s => s.updateContext)
  const voice = useContextStore(s => s.voice)

  const methods = useForm({
    defaultValues: {
      voice,
    }
  })
  const isDirty = methods?.formState?.isDirty

  function onSave(data: any) {
    updateContext(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledSelect
          name="voice"
          label="Voice"
          list={voices?.map(v => ({ id: v.name, name: v.name }))}
        />

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Native
