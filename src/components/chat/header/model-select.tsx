import { LuChevronRight } from "react-icons/lu";

import llmModels, { listT } from "../../../utils/llm-models";
import { cn } from "../../../lib/utils";

import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import { useSharedServers } from "../../../hooks/use-user";
import useContextStore from "../../../store/context";
import usePlatform from "../../../hooks/use-platform";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "../../../components/ui/dropdown-menu";
import OnlineStatus from "../../common/online-status";

function Title(model: listT) {
  return (
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
  )
}

function ModelSelect() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  const { data, isLoading } = useSharedServers()

  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)
  const chat_id = useContextStore(s => s.chat_id)

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
        className={`non-draggable df gap-px pl-28 [.open_&]:pl-0 text-sm transition-all ${isFullScreen || platform === "windows" ? "-translate-x-20 [.open_&]:translate-x-0" : ""}`}
      >
        AI Server: {model_type} <LuChevronRight className="opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 min-w-48">
        {llmModels.map(model => {
          if (!model?.hasSub) {
            return (
              <DropdownMenuItem
                key={model.id}
                className={cn("p-2", {
                  "bg-input/50": model.title === model_type
                })}
                onClick={() => handleModelSelect(model.title)}
              >
                <Title {...model} />
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuSub key={model.id}>
              <DropdownMenuSubTrigger className="p-2">
                <Title {...model} />
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent sideOffset={5}>
                  {
                    !isLoading &&
                    data?.invites?.map((invite: any) => (
                      <DropdownMenuSub key={invite._id}>
                        <DropdownMenuSubTrigger className="df px-2 py-1.5 text-xs">
                          <OnlineStatus isOnline={invite?.isServerOn} />
                          {invite?.email}
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                          <DropdownMenuSubContent sideOffset={5}>
                            {invite?.devices?.map((device: any) => (
                              <DropdownMenuItem
                                key={device?._id}
                                className={cn("df px-2 py-1.5 text-xs", {
                                  // "bg-input/50": model.title === model_type
                                })}
                              >
                                <OnlineStatus isOnline={device?.isServerOn} />
                                {device?.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    ))
                  }
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelect