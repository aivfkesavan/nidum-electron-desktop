import { useState } from "react";

import { cn } from "@/lib/utils";

import SideNavToggler from "@/components/common/side-nav-toggler";
import Transcribe from "./transcribe";
// import Embedder from "./embedder";
import Model from "./model";
// import VecDB from "./vecdb";
import Voice from "./voice";
// import Rag from "./rag";

const list = [
  "LLM",
  // "Vector Database",
  // "Embedder",
  // "RAG",
  "Voice & Speech",
  "Transcription",
] as const

function Settings() {
  const [selected, setSelected] = useState<typeof list[number]>("LLM")

  return (
    <>
      <SideNavToggler />

      <div className="side-nav dfc gap-0 shrink-0 w-[240px] h-screen border-r overflow-hidden transition-transform bg-background z-[1]">
        <h1 className="py-2 px-4 text-lg font-medium text-primary">
          Settings
        </h1>

        <div className="mini-scroll-bar scroll-y">
          {
            list.map(l => (
              <button
                key={l}
                className={cn("w-full text-[13px] py-2 pl-4 text-left border-l-2 border-transparent rounded-none hover:bg-secondary", {
                  "border-white bg-transparent border": l === selected
                })}
                onClick={() => setSelected(l)}
              >
                {l}
              </button>
            ))
          }
        </div>
      </div>

      <div className="p-6 flex-1 h-screen overflow-y-auto">
        <div className="md:max-w-xl md:mx-auto">
          {
            selected === "LLM" &&
            <Model />
          }

          {/* {
            selected === "Vector Database" &&
            <VecDB />
          }

          {
            selected === "Embedder" &&
            <Embedder />
          }

          {
            selected === "RAG" &&
            <Rag />
          } */}

          {
            selected === "Voice & Speech" &&
            <Voice />
          }

          {
            selected === "Transcription" &&
            <Transcribe />
          }
        </div>
      </div>
    </>
  )
}

export default Settings
