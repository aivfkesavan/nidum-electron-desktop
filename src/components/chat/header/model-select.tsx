import { LuChevronRight } from "react-icons/lu";

import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import { useSharedServers } from "../../../hooks/use-user";
import useContextStore from "../../../store/context";
import usePlatform from "../../../hooks/use-platform";
import llmModels from "../../../utils/llm-models";
import { cn } from "../../../lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../components/ui/dropdown-menu";
import OllmaStatusCheck from "../../../components/common/ollma-status-check";

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

  const firstModel = llmModels[0]
  const otherModels = llmModels.slice(1)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`non-draggable df gap-px pl-28 [.open_&]:pl-0 text-sm transition-all ${isFullScreen || platform === "windows" ? "-translate-x-20 [.open_&]:translate-x-0" : ""}`}
      >
        AI Server: {model_type} <LuChevronRight className="opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-1 min-w-48">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="p-2">
            <div className="df">
              <div className="dc size-8 relative mr-2">
                <img
                  className="w-7"
                  src={firstModel?.logo}
                  alt={firstModel?.title}
                />
                {model_type === "Local" &&
                  <OllmaStatusCheck className="absolute top-0 -right-0.5" />
                }
              </div>

              <div>
                <p className="text-sm">Local</p>
                <p className="text-[10px] text-white/70">{firstModel?.para}</p>
              </div>
            </div>
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={5}>
              <DropdownMenuItem
                className={cn("px-2 py-1.5", {
                  "bg-input/50": firstModel?.title === model_type
                })}
                onClick={() => handleModelSelect(firstModel?.title || "")}
              >
                Local Server
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="pb-0 text-xs text-zinc-500">Invited list</DropdownMenuLabel>
                {
                  !isLoading &&
                  data?.invites?.map((invite: any) => (
                    <DropdownMenuSub key={invite._id}>
                      <DropdownMenuSubTrigger className="px-2 py-1.5">
                        {invite?.email}
                      </DropdownMenuSubTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuSubContent sideOffset={5}>
                          {invite?.devices?.map((device: any) => (
                            <DropdownMenuItem
                              key={device?._id}
                              className={cn("px-2 py-1.5", {
                                // "bg-input/50": model.title === model_type
                              })}
                            >
                              {device?.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  ))
                }
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        {otherModels.map(model => (
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
              </div>
              <div>
                <p className="text-sm">{model.title}</p>
                <p className="text-[10px] text-white/70">{model.para}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelect