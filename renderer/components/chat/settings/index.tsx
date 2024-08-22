import { useState } from "react";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { HiCubeTransparent } from "react-icons/hi2";
import { GoProjectRoadmap } from "react-icons/go";
import { RiVoiceprintFill } from "react-icons/ri";
// import { BsTextParagraph } from "react-icons/bs";
// import { LuDatabase } from "react-icons/lu";
import { FaLinode } from "react-icons/fa";

import useSttValidCheck from "@/hooks/use-stt-valid-check";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import SettingIcon from '@/assets/svg/settings.svg';

// import VecDB from "./vecdb";
// import Rag from "./rag";
import Transcribe from "./transcribe";
import Embedder from "./embedder";
import General from "./general";
import Model from "./model";
import Voice from "./voice";
import Chat from "./chat";

const list = [
  {
    id: "1",
    title: "General",
    logo: <SettingIcon className=" stroke-white" />,
    child: General,
  },
  {
    id: "2",
    title: "Project",
    logo: <GoProjectRoadmap className="text-base" />,
    child: Chat,
  },
  {
    id: "3",
    title: "LLM",
    logo: <FaLinode className="text-base" />,
    child: Model,
  },
  // {
  //   id: "4",
  //   title: "Vector Database",
  //   logo: <LuDatabase className="text-base" />,
  //   child: VecDB,
  // },
  {
    id: "5",
    title: "RAG",
    logo: <HiCubeTransparent className="text-base" />,
    child: Embedder,
  },
  // {
  //   id: "6",
  //   title: "RAG",
  //   logo: <BsTextParagraph className="text-base" />,
  //   child: Rag,
  // },
  {
    id: "7",
    title: "Voice & Speech",
    logo: <RiVoiceprintFill className="text-base" />,
    child: Voice,
  },
  {
    id: "8",
    title: "Transcription",
    logo: <MdOutlineRecordVoiceOver className="text-base" />,
    child: Transcribe,
  },
]

function Settings() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState("General")
  const isSupported = useSttValidCheck()

  function onOpenChange(val: boolean) {
    setOpen(val)
    if (!val) setSelected("General")
  }

  let Comp = list?.find(l => l.title === selected)?.child

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input">
        <SettingIcon />
      </DialogTrigger>

      <DialogContent className="">
        <DialogHeader className="pb-2 md:pb-5 mb-2 border-b">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="mini-scroll-bar flex items-center gap-2 py-2 overflow-x-auto">
          {
            list
              .filter(l => isSupported ? true : l.title !== "Transcription")
              .map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelected(l.title)}
                  className={`df w-full text-nowrap text-xs text-left ${selected === l.title ? "bg-input" : ""}`}
                >
                  {l.logo}
                  {l.title}
                </button>
              ))
          }
        </div>

        <div className="h-96 -mr-6 pr-6 overflow-y-auto">
          <Comp onOpenChange={onOpenChange} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
