import { LuChevronRight } from "react-icons/lu";
import { useParams } from "react-router-dom";

import llmModels from "../../../utils/llm-models";
import { cn } from "../../../lib/utils";

import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import useOnlineStatus from "../../../hooks/use-online-status";
import useContextStore from "../../../store/context";
import useAuthStore from "../../../store/auth";
import usePlatform from "../../../hooks/use-platform";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import OnlineStatus from "../../common/online-status";

function ModelSelect() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  const isOnline = useOnlineStatus()
  const user_id = useAuthStore(s => s._id)

  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s?.data?.[user_id]?.model_type)

  const { chat_id = "" } = useParams()

  const handleModelSelect = (title: string) => {
    let payload: any = { model_type: title }
    if (chat_id.endsWith("-imgGen")) {
      payload.chat_id = ""
    }
    updateContext(payload)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`non-draggable df gap-px pl-28 [.open_&]:pl-0 mr-auto text-sm transition-all ${isFullScreen || platform === "windows" ? "-translate-x-20 [.open_&]:translate-x-0" : ""}`}
      >
        AI Server: {model_type} <LuChevronRight className="opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 min-w-48">
        {
          llmModels
            .filter((_, i) => !isOnline ? i === 1 : true) // || i === 4
            .map(model => (
              <DropdownMenuItem
                key={model.id}
                className={cn("p-2", {
                  "bg-input/50": model.title === model_type
                })}
                onClick={() => handleModelSelect(model.title)}
              >
                <div className="df">
                  <div className="dc size-8 relative mr-2">
                    <img
                      className="w-7"
                      src={model.logo}
                      alt={model.title}
                    />
                    {model.title === "Local" &&
                      <OnlineStatus className="absolute top-0 -right-0.5" />
                    }
                  </div>
                  <div>
                    <p className="text-sm">{model.title}</p>
                    <p className="text-[10px] text-white/70">{model.para}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelect