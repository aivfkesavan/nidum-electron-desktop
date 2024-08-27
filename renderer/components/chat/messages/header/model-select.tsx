import { useState } from "react";
import { LuChevronRight } from "react-icons/lu";

import useContextStore from "@/store/context";
import { cn } from "@lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import OllmaStatusCheck from "@components/common/ollma-status-check";

type listT = {
  id: string
  title: "Groq" | "Ollama" | "Nidum"
  logo: string
  para: string
}

const list: listT[] = [
  {
    id: "1",
    logo: "/logo.png",
    title: "Ollama",
    para: "Run LLMs locally on your machine"
  },
  {
    id: "2",
    logo: "/groq.png",
    title: "Groq",
    para: "The fastest LLM inferencing from Groq's LPUs"
  },
]

function ModelSelect() {
  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="pl-28 [.open_&]:pl-0 df gap-px text-sm transition-all">
        {model_type === "Ollama" ? "Local Server" : model_type} <LuChevronRight className="opacity-50" />
      </PopoverTrigger>

      <PopoverContent className="p-1 space-y-1 data-[state=open]:duration-300 data-[state=closed]:duration-300">
        {
          list.map(l => (
            <div
              key={l.id}
              className={cn("df p-2 cursor-pointer rounded hover:bg-input/40", {
                "bg-input/50": l.title === model_type
              })}
              onClick={() => {
                updateContext({ model_type: l.title })
                setOpen(false)
              }}
            >
              <div className="dc size-8 relative">
                <img
                  className="w-7"
                  // className={cn({
                  //   "invert h-8 -mt-1": l.title === "Ollama",
                  //   "w-7": l.title !== "Ollama"
                  // })}
                  src={l.logo}
                  alt={l.title}
                />
                {
                  model_type === "Ollama" && l.title === "Ollama" &&
                  <OllmaStatusCheck ollamaUrl={ollamaUrl} className="absolute top-0 -right-0.5" />
                }
              </div>

              <div className="">
                <p className="text-sm group-hover:underline">{l.title === "Ollama" ? "Local Server" : l.title}</p>
                <p className="text-[10px] text-white/70">{l.para}</p>
              </div>
            </div>
          ))
        }
      </PopoverContent>
    </Popover>
  )
}

export default ModelSelect
