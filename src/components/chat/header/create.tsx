import { useChatMutate } from "../../../hooks/use-chat";
import useContextStore from '../../../store/context';
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

  const updateContext = useContextStore(s => s.updateContext)
  const project_id = useContextStore(s => s.project_id)

  const { mutate, isPending } = useChatMutate()

  const onClk = () => {
    if (project_id) {
      mutate(
        {
          project_id,
          title: "New Chat",
        },
        {
          onSuccess(res) {
            updateContext({ chat_id: res?._id })
          }
        }
      )
      return
    }

    updateModal({ open: "project" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={onClk}
          disabled={isPending}
          className="non-draggable ml-auto"
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
