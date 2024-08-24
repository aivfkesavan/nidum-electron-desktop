import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import Copy from "../../common/copy";
import MarkdownParse from "@components/chat/messages/markdown-parse";

const list: any = {
  macos: {
    url: "curl -sS https://webi.sh/ollama | sh",
    txt: "Paste this into Terminal.app or a shell prompt, and press enter.",
  },
  linux: {
    url: "curl -sS https://webi.sh/ollama | sh",
    txt: "Paste this into a Linux shell prompt or terminal, and press enter.",
  },
  windows: {
    url: "curl.exe https://webi.ms/ollama | powershell",
    txt: "Paste this into a Command or cmd.exe prompt.",
  }
}

const res = `
### Getting Started with Ollama
1. *Open Terminal:* Launch the terminal and enter the command <br /> \`ollama serve\` or simply open the Ollama application on your desktop.
2. *Get Model ID:* Visit the Ollama website catalog at [ollama.com/library](https://ollama.com/library) to obtain the model ID or download the default model. Then, go to the Model Management section to start chatting.
`

function Instructions() {
  const [selected, setSelected] = useState("macos")

  useEffect(() => {
    // @ts-ignore
    const platform = window?.electronAPI?.getOS();
    const platformMap = {
      win32: "windows",
      darwin: "macos",
      linux: "linux",
    }
    setSelected(platformMap?.[platform] || "macos")
  }, [])

  return (
    <>
      <div>
        <label className="text-xs text-white/60">{list?.[selected]?.txt}</label>
        <Copy val={list?.[selected]?.url} />
      </div>

      <div className="df gap-3 mt-2">
        {
          ["MacOS", "Linux", "Windows"].map(l => (
            <button
              key={l}
              onClick={() => setSelected(l.toLowerCase())}
              className={cn("px-2 py-1 text-xs rounded-sm border border-transparent hover:border-white/70", {
                "bg-input": l.toLowerCase() === selected
              })}
            >
              {l}
            </button>
          ))
        }
      </div>

      <div className="mt-8 text-xs">
        <MarkdownParse response={res} />
        {/* <p className="mb-4 text-white/60">To get started,</p>
        <ul className="pl-5 list-decimal text-white/80">
          <li className="mb-4">Open <span className="font-medium text-white">TWO Terminals</span></li>
          <li className="mb-4 space-y-2">
            <div>In the first, start the ollama server</div>
            <Copy val="OLLAMA_ORIGINS='*' OLLAMA_HOST=localhost:11490 ollama serve" />
          </li>
          <li className="mb-4 space-y-2">
            <div>In the second, run the ollama CLI (using the nidumai/nidum-limitless-gemma-2b model)</div>
            <Copy val="ollama pull nidumai/nidum-limitless-gemma-2b" />
            <Copy val="ollama run nidumai/nidum-limitless-gemma-2b" />
          </li>
        </ul> */}
      </div>
    </>
  )
}

export default Instructions
