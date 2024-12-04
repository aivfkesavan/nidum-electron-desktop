import { useLocation, useNavigate, useParams } from "react-router-dom";

import useUIStore from "../../../store/ui";

import Message from '../../../assets/svg/message.svg?react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

function Create() {
  const { project_id = "" } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const updateModal = useUIStore(s => s.update)

  const onClk = () => {
    if (project_id) {
      if (pathname !== `/p/${project_id}`) {
        navigate(`/p/${project_id}`)
      }
      return
    }

    updateModal({ open: "project" })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={onClk}
          className="non-draggable ml-auto active:scale-105"
        >
          <Message />
        </TooltipTrigger>

        <TooltipContent side="left" className="text-[10px]">
          Create new {project_id ? "chat" : "project"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Create
