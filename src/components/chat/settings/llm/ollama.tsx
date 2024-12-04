import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";
import { useToast } from "../../../../components/ui/use-toast";
import { cn } from "../../../../lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import ControlledInput from "../common/controlled-input";
import Footer from "../common/footer";
import Copy from "../common/copy";

const list: any = {
  macos: {
    url: "curl -sS https://webi.sh/ollama | sh",
    txt: "Paste this into Terminal.app or a shell prompt, and press enter.",
  },
  linux: {
    url: "curl -sS https://webi.sh/ollama | sh",
    txt: "Paste this into a Linux shell prompt or terminal, and press enter.",
  },
  windows: {
    url: "curl.exe https://webi.ms/ollama | powershell",
    txt: "Paste this into a Command or cmd.exe prompt.",
  }
}

function Ollama() {
  const user_id = useAuthStore(s => s._id)

  const updateContext = useContextStore(s => s.updateContext)
  const ollamaModel = useContextStore(s => s?.data?.[user_id]?.ollamaModel)
  const ollamaUrl = useContextStore(s => s?.data?.[user_id]?.ollamaUrl)

  const methods = useForm({
    defaultValues: {
      ollamaUrl,
      ollamaModel,
    }
  })

  const [selected, setSelected] = useState("macos")
  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11434")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        let payload = {
          ollamaUrl: "http://localhost:11434",
          ollamaModel: "nidumai/nidum-limitless-gemma-2b",
        }
        methods.reset(payload)
        updateContext(payload)
        methods.clearErrors("root")
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })

      console.log(error)
    }
  }

  function onSave(data: any) {
    updateContext(data)
    methods.reset(data)
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSave)}>
        <div className="relative">
          <ControlledInput
            name="ollamaUrl"
            label="Ollama base url"
            placeholder="http://localhost:11434"
          />

          <button
            className="px-2 py-0.5 text-[10px] text-zinc-400 absolute top-0 right-0 border hover:text-zinc-200"
            onClick={checkAutoDetect}
            type="button"
          >
            Auto detect
          </button>
        </div>

        <ControlledInput
          name="ollamaModel"
          label="Model"
          placeholder="Model"
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="1" className=" border-0">
            <AccordionTrigger
              type="button"
              className="p-0 mt-4 text-sm text-zinc-400 font-medium"
            >
              Instructions
            </AccordionTrigger>

            <AccordionContent>
              <label className="block mt-4 text-xs text-white/60">{list?.[selected]?.txt}</label>
              <Copy val={list?.[selected]?.url} />

              <div className="df gap-3 mt-2">
                {
                  ["MacOS", "Linux", "Windows"].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setSelected(l.toLowerCase())}
                      className={cn("px-2 py-1 text-xs rounded-sm border", {
                        " bg-zinc-700": l.toLowerCase() === selected
                      })}
                    >
                      {l}
                    </button>
                  ))
                }
              </div>

              <div className="my-4 text-xs">
                <p className="mb-4 text-white/60">To get started,</p>
                <ul className="pl-5 list-decimal text-white/80">
                  <li className="mb-4">Open <span className="font-medium text-white">TWO Terminals</span></li>
                  <li className="mb-4 space-y-2">
                    <div>In the first, start the ollama server</div>
                    <Copy val="OLLAMA_ORIGINS='*' OLLAMA_HOST=localhost:11434 ollama serve" />
                  </li>

                  <li className="mb-4 space-y-2">
                    <div>In the second, run the ollama CLI (using the nidumai/nidum-limitless-gemma-2b model)</div>
                    <Copy val="ollama pull nidumai/nidum-limitless-gemma-2b" />
                    <Copy val="ollama run nidumai/nidum-limitless-gemma-2b" />
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {methods.formState?.isDirty && <Footer />}
      </form>
    </FormProvider>
  )
}

export default Ollama
