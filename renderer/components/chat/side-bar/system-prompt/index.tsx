import { useState } from "react";
import { IoResizeOutline } from "react-icons/io5";

import useSystemPrompt from "./use-system-prompt";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Model from "./model";

function SystemPrompt() {
  const { systemPrompt, onChange } = useSystemPrompt()
  const [open, setOpen] = useState(false)

  const updateOpen = (e: any) => {
    e?.stopPropagation?.()
    setOpen(p => !p)
  }

  return (
    <>
      <Accordion type="multiple" defaultValue={["1"]}>
        <AccordionItem value="1" className="border-none">
          <AccordionTrigger className="px-4 py-2 text-xs">
            System Prompt
            <span
              className="p-1 mr-1 ml-auto bg-input hover:bg-secondary rounded-full"
              onClick={updateOpen}
            >
              <IoResizeOutline />
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 py-2">
            <textarea
              className="p-2 mb-2 text-xs bg-input/50 resize-none"
              value={systemPrompt}
              onChange={e => onChange(e.target.value)}
            ></textarea>
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