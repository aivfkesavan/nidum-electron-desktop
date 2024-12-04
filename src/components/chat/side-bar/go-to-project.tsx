import { TbArrowBackUp } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

function GoToProject() {
  const navigate = useNavigate()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="p-0.5 absolute top-1.5 right-3 text-white/60 transition-colors hover:bg-secondary"
          onClick={() => navigate("/")}
        >
          <TbArrowBackUp className="text-base" />
        </TooltipTrigger>

        <TooltipContent side="right" className="text-[10px]">
          Go to projects
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GoToProject
