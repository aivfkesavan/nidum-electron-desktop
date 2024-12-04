import { useState } from "react";
import { BiExpandAlt } from "react-icons/bi";

import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";
import { cn } from "../../../../lib/utils";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";

import groq from '../../../../assets/imgs/groq.png';
import logo from '../../../../assets/imgs/logo.png';

type listT = {
  id: string
  title: "Groq" | "System native"
  logo: string
  para: string
}

const list: listT[] = [
  {
    id: "1",
    logo: logo,
    title: "System native",
    para: "Uses your browser's built in STT service if supported."
  },
  {
    id: "2",
    logo: groq,
    title: "Groq",
    para: "The fastest STT inferencing from Groq LPU"
  },
]

function SelectModel() {
  const user_id = useAuthStore(s => s._id)
  const updateContext = useContextStore(s => s.updateContext)
  const stt_type = useContextStore(s => s?.data?.[user_id]?.stt_type)

  const [open, setOpen] = useState(false)

  const found = list?.find(l => l.title === stt_type) || null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm border" asChild>
        <div className="df gap-4 px-4 py-2.5 rounded-md cursor-pointer hover:bg-input/30">
          <div className="dc size-8 shrink-0">
            <img className="w-8" src={found?.logo} alt="" />
          </div>

          <div className="text-left">
            <p className="text-sm group-hover:underline">{found?.title}</p>
            <p className="text-xs text-white/70">{found?.para}</p>
          </div>

          <BiExpandAlt className="ml-auto rotate-[-45deg] shrink-0" />
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle className="sr-only">Select transcriber</DialogTitle>

        <div className="mt-3">
          {
            list.map(l => (
              <div
                key={l.id}
                className={cn("df gap-4 mb-4 pl-8 -ml-6 last:mb-0 group cursor-pointer border-l-2 border-transparent hover:border-l-white", {
                  "border-white": l.title === stt_type
                })}
                onClick={() => {
                  updateContext({ stt_type: l.title })
                  setOpen(false)
                }}
              >
                <div className="dc size-8">
                  <img
                    className="w-8"
                    src={l.logo}
                    alt={l.title}
                  />
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
