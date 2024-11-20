import { IoResizeOutline } from "react-icons/io5";

import useSystemPrompt from "./use-system-prompt";
import useUIStore from "../../../../store/ui";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../components/ui/accordion";
import Confirm from "./confirm";
import Model from "./model";

function SystemPrompt() {
  const { prompt, isDisabled, onSave, onBlur, onChange } = useSystemPrompt()
  const update = useUIStore(s => s.update)
  const open = useUIStore(s => s.open)

  const updateOpen = (e: any) => {
    e?.stopPropagation?.()
    update({ open: "big" })
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
              onBlur={onBlur}
            ></textarea>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {
        open === "big" &&
        <Model />
      }

      {
        open === "confirm" &&
        <Confirm onSave={onSave} />
      }
    </>
  )
}

export default SystemPrompt