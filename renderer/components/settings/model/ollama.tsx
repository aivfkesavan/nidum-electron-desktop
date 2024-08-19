import { useState } from "react";

import useContextStore from "@/store/context";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

import Copy from "../copy";

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

function Ollama() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaModel = useContextStore(s => s.ollamaModel)
  const ollamUrl = useContextStore(s => s.ollamaUrl)

  const [selected, setSelected] = useState("macos")
  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11434")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        updateContext({
          ollamaUrl: "http://localhost:11434",
          ollamaModel: "nidumai/nidum-limitless-gemma-2b",
        })
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })

      console.log(error)
    }
  }

  return (
    <div>
      <div className="mt-8 mb-4">
        <div className="df justify-between mb-1.5">
          <label htmlFor="" className="text-xs">Ollama base url</label>

          <button
            className="px-2 py-0.5 text-xs bg-primary-darker hover:bg-primary-dark"
            onClick={checkAutoDetect}
          >
            Auto detect
          </button>
        </div>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="http://localhost:11434"
          value={ollamUrl}
          onChange={e => updateContext({ ollamaUrl: e.target.value })}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="" className="text-xs">Ollama Model Name</label>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="nidumai/nidum-limitless-gemma-2b"
          value={ollamaModel}
          onChange={e => updateContext({ ollamaModel: e.target.value })}
        />
      </div>

      <h6 className="mb-2 text-primary-dark">Instructions</h6>

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
              className={cn("px-2 py-1 text-xs rounded-sm border hover:border-l-white", {
                "bg-primary": l.toLowerCase() === selected
              })}
            >
              {l}
            </button>
          ))
        }
      </div>

      <div className="mt-8 text-sm">
        <p className="mb-4 text-white/60">To get started,</p>
        <ul className="pl-5 list-decimal text-white/80">
          <li className="mb-4">Open <span className="font-medium text-white">TWO Terminals</span></li>
          <li className="mb-4 space-y-2">
            <div>In the first, start the ollama server</div>
            <Copy val="OLLAMA_ORIGINS='*' OLLAMA_HOST=localhost:11434 ollama serve" />
          </li>
          <li className="mb-4 space-y-2">
            <div>In the second, run the ollama CLI (using the nidumai/nidum-limitless-gemma-2b model)</div>
            <Copy val="ollama pull nidumai/nidum-limitless-gemma-2b" />
            <Copy val="ollama run nidumai/nidum-limitless-gemma-2b" />
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Ollama
