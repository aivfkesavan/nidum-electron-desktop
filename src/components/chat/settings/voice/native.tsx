import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";
import useVoices from "./use-voices";

import ControlledSelect from "../common/controlled-select";
import Footer from "../common/footer";

function Native() {
  const voices = useVoices()

  const updateContext = useContextStore(s => s.updateContext)
  const user_id = useAuthStore(s => s._id)
  const voice = useContextStore(s => s?.data?.[user_id]?.voice)

  const methods = useForm({
    defaultValues: {
      voice,
    }
  })

  useEffect(() => {
    if (!voice && voices && voices?.[0]?.name) {
      const name = voices?.[0]?.name
      updateContext({ voice: name })
      methods.setValue("voice", name)
    }
  }, [voice, voices])

  function onSave(data: any) {
    updateContext(data)
    methods.reset(data)
  }

  const isDirty = methods?.formState?.isDirty

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        {
          voices &&
          <ControlledSelect
            name="voice"
            label="Voices"
            list={voices?.map(v => ({ id: v.name, name: v.name }))}
          />
        }

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Native
