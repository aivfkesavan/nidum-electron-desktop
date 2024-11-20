import { useState } from "react";
import { IoResizeOutline, IoCheckmarkOutline } from "react-icons/io5";

import useSystemPrompt from "./use-system-prompt";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import Model from "./model";

function SystemPrompt() {
  const { prompt, isDisabled, isDirty, onSave, onChange } = useSystemPrompt()
  const [open, setOpen] = useState(false)

  const updateOpen = (e: any) => {
    e?.stopPropagation?.()
    setOpen(p => !p)
  }

  if (isDisabled) {
    return (
      <div className="px-4 py-2 text-xs border-t">
        Image Generator
      </div>
    )
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={["1"]}>
        <AccordionItem value="1" className="border-none">
          <AccordionTrigger className="px-4 py-2 text-xs">
            System Prompt
            {
              !isDisabled &&
              <span
                className="p-1 mr-1 ml-auto bg-input hover:bg-secondary rounded-full"
                onClick={updateOpen}
              >
                <IoResizeOutline />
              </span>
            }
          </AccordionTrigger>

          <AccordionContent className="px-4 py-2 relative">
            <textarea
              className="p-2 mb-2 text-xs bg-input/50 resize-none"
              value={prompt}
              onChange={e => onChange(e.target.value)}
              disabled={isDisabled}
            ></textarea>

            {
              isDirty &&
              <button
                onClick={onSave}
                disabled={isDisabled}
                className="p-0.5 absolute bottom-4 right-4 bg-green-600"
              >
                <IoCheckmarkOutline />
              </button>
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {
        open &&
        <Model
          closeModel={() => updateOpen("")}
        />
      }
    </>
  )
}

export default SystemPrompt