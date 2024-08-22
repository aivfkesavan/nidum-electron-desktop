import { useState } from "react";
import { MdOutlineRecordVoiceOver } from "react-icons/md";
import { HiCubeTransparent } from "react-icons/hi2";
import { GoProjectRoadmap } from "react-icons/go";
import { RiVoiceprintFill } from "react-icons/ri";
// import { BsTextParagraph } from "react-icons/bs";
// import { LuDatabase } from "react-icons/lu";
import { FaLinode } from "react-icons/fa";

import useSttValidCheck from "@/hooks/use-stt-valid-check";
import useUIStore from "@store/ui";

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
import Project from "./project";
import Voice from "./voice";
import LLM from "./llm";

const list = [
  {
    id: "1",
    title: "General",
    logo: <SettingIcon />,
    child: <General />,
  },
  {
    id: "2",
    title: "Project",
    logo: <GoProjectRoadmap className="text-base" />,
    child: <Project />,
  },
  {
    id: "3",
    title: "LLM",
    logo: <FaLinode className="text-base" />,
    child: <LLM />,
  },
  // {
  //   id: "4",
  //   title: "Vector Database",
  //   logo: <LuDatabase className="text-base" />,
  //   child: <VecDB />,
  // },
  {
    id: "5",
    title: "RAG",
    logo: <HiCubeTransparent className="text-base" />,
    child: <Embedder />,
  },
  // {
  //   id: "6",
  //   title: "RAG",
  //   logo: <BsTextParagraph className="text-base" />,
  //   child: <Rag />,
  // },
  {
    id: "7",
    title: "Voice & Speech",
    logo: <RiVoiceprintFill className="text-base" />,
    child: <Voice />,
  },
  {
    id: "8",
    title: "Transcription",
    logo: <MdOutlineRecordVoiceOver className="text-base" />,
    child: <Transcribe />,
  },
]

function Settings() {
  const update = useUIStore(s => s.update)
  const open = useUIStore(s => s.open)

  const [selected, setSelected] = useState("General")
  const isSupported = useSttValidCheck()

  function onOpenChange(val: boolean) {
    update({ open: val ? "settings" : "" })
    if (!val) setSelected("General")
  }

  return (
    <Dialog open={open === "settings"} onOpenChange={onOpenChange}>
      <DialogTrigger className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full cursor-pointer hover:bg-input">
        <SettingIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="pb-2 md:pb-4 mb-2 border-b">
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
                  className={`df w-full text-nowrap text-xs text-left hover:bg-input ${selected === l.title ? "bg-input text-white [&_svg]:stroke-white" : " text-white/60 [&_svg]:stroke-white/60"}`}
                >
                  {l.logo}
                  {l.title}
                </button>
              ))
          }
        </div>

        <div className="h-96 -mr-6 pr-6 overflow-y-auto">
          {list?.find(l => l.title === selected)?.child}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
