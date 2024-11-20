import { nanoid } from "nanoid";

import useContextStore from '../../../store/context';
import useConvoStore from "../../../store/conversations";
import useUIStore from "../../../store/ui";

import Message from '../../../assets/svg/message.svg?react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "../../../components/ui/tooltip";

function Create() {
  const updateModal = useUIStore(s => s.update)

  const project_id = useContextStore(s => s.project_id)
  const updateContext = useContextStore(s => s.updateContext)
  const addChat = useConvoStore(s => s.addChat)

  const onClk = () => {
    if (project_id) {
      const id = nanoid(10)
      addChat(project_id, { id, title: "New Chat" })
      updateContext({ chat_id: id })
      return
    }

    updateModal({ open: "project" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="non-draggable ml-auto"
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
  )
}

export default Create
