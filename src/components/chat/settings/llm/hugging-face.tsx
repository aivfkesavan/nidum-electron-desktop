import { FormProvider, useForm } from "react-hook-form";

import { useLLMModels } from "../../../../hooks/use-llm-models";
import useContextStore from "../../../../store/context";

import ControlledSelect from "../common/controlled-select";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";

function HuggingFace() {
  const updateContext = useContextStore(s => s.updateContext)
  // const hfImgGenModel = useContextStore(s => s.hfImgGenModel)
  const hfApiKey = useContextStore(s => s.hfApiKey)
  const hfModel = useContextStore(s => s.hfModel)

  // const { isLoading: isLoading2, data: models2 } = useLLMModels("hf-img-gen")
  const { isLoading, data: models } = useLLMModels("hf")

  const methods = useForm({
    defaultValues: {
      // hfImgGenModel,
      hfApiKey,
      hfModel,
    }
  })
  const isDirty = methods?.formState?.isDirty

  function onSave(data: any) {
    updateContext(data)
  }

  if (isLoading) { // || isLoading2
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <ControlledInput
          name="hfApiKey"
          label="Hugging Face Token"
          placeholder="hf_zxTDTUKUCXRYWgk-gjhdh-dhtxet"
        />

        <ControlledSelect
          name="hfModel"
          label="Chat Model"
          list={models}
        />

        {/* <div className="mb-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Image Generation Model</label>

        <Select value={details.hfImgGenModel} onValueChange={v => onChange({ hfImgGenModel: v })}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Model" />
          </SelectTrigger>

          <SelectContent>
            {
              models2.map(m => (
                <SelectItem
                  value={m.id}
                  key={m.id}
                >
                  {m.name}
                </SelectItem>
              ))
            }

            <SelectItem value="-">
              Not Selected
            </SelectItem>
          </SelectContent>
        </Select>
      </div> */}

        <div className="mb-12 text-xs text-white/60">
          Click here to sign up for a Hugging Face account: <a href="https://huggingface.co/join?ref=nidum.ai" className="text-white/90 hover:underline" target="_blank">https://huggingface.co/join</a>
        </div>

        {isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default HuggingFace
