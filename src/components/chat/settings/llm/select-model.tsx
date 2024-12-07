import { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";
import { useParams } from "react-router-dom";

import useOnlineStatus from "../../../../hooks/use-online-status";
import useContextStore from "../../../../store/context";
import useDeviceStore from "../../../../store/device";
import useAuthStore from "../../../../store/auth";
import { useToast } from "../../../../hooks/use-toast";
import llmModels from "../../../../utils/llm-models";
import { cn } from "../../../../lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import OnlineStatus from "../../../common/online-status";

function SelectModel() {
  const { chat_id = "" } = useParams()
  const user_id = useAuthStore(s => s._id)

  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s?.data?.[user_id]?.model_type)

  const isNidumSharedPublic = useDeviceStore(s => s.isNidumSharedPublic)

  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const found: any = llmModels?.find(l => l.title === model_type) || null

  function onClk(e: any) {
    e?.preventDefault()
    if (isNidumSharedPublic && isOnline) return toast({ title: "Please disable the 'Go Public' feature before changing the server." })
    return setOpen(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="text-sm border"
        onClick={onClk}
        asChild
      >
        <div className="df gap-4 px-4 py-2.5 rounded-md cursor-pointer hover:bg-input/30">
          <div className="dc size-8 shrink-0 relative">
            <img
              className="w-8"
              src={found.logo}
              alt={found.title}
            />
            {
              found.title === "Local" &&
              <OnlineStatus className="absolute top-0 -right-2" />
            }
          </div>

          <div className="text-left">
            <p className="text-sm group-hover:underline">AI Server: {found.title}</p>
            <p className="text-xs text-white/70">{found?.para}</p>
          </div>

          <BiExpandAlt className="ml-auto rotate-[-45deg] shrink-0" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="sr-only">LLM model</DialogTitle>

        <div className="mt-3">
          {
            llmModels
              .filter((_, i) => !isOnline ? i === 1 : true) // || i === 4
              .map(l => (
                <div
                  key={l.id}
                  className={cn("df gap-4 mb-4 pl-8 -ml-6 last:mb-0 group cursor-pointer border-l-2 border-transparent hover:border-l-white", {
                    "border-white": l.title === model_type
                  })}
                  onClick={() => {
                    let payload: any = { model_type: l.title }
                    if (chat_id.endsWith("-imgGen")) {
                      payload.chat_id = ""
                    }
                    updateContext(payload)
                    setOpen(false)
                  }}
                >
                  <div className="dc size-8 relative">
                    <img
                      className="w-8"
                      src={l.logo}
                      alt={l.title}
                    />
                    {
                      l.title === "Local" &&
                      <OnlineStatus className="absolute top-0 -right-2" />
                    }
                  </div>

                  <div className="">
                    <p className="text-sm group-hover:underline">{l.title}</p>
                    <p className="text-xs text-white/70">{l.para}</p>
                  </div>
                </div>
              ))
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SelectModel
