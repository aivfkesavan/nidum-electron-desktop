import { useState } from "react";
import { nanoid } from "nanoid";

import useConvoStore from "@/store/conversations";
import useContextStore from '@/store/context';

import Message from '@/assets/svg/message.svg';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "@/components/ui/tooltip";
import Model from "@/components/project/model";

function Create() {
  const [open, setOpen] = useState(false)

  const project_id = useContextStore(s => s.project_id)
  const updateContext = useContextStore(s => s.updateContext)
  const addChat = useConvoStore(s => s.addChat)

  const onClk = () => {
    if (project_id) {
      const id = nanoid(10)
      addChat(project_id, { id, title: "New Chat", file_id: null })
      updateContext({ chat_id: id })
      return
    }

    setOpen(true)
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className="ml-auto"
            onClick={onClk}
          >
            <Message />
          </TooltipTrigger>

          <TooltipPortal>
            <TooltipContent side="left" className="text-[10px]">
              Create new {project_id ? "chat" : "project"}
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      </TooltipProvider>

      <Model
        open={open}
        closeModel={() => setOpen(false)}
      />
    </>
  )
}

export default Create