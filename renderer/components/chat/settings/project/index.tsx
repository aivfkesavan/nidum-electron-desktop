import { useState } from "react";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";
import useUIStore from "@store/ui";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import Info from "@/components/common/info";
import Footer from "../common/footer";

function Chat() {
  const editProject = useConvoStore(s => s.editProject)
  const updateTab = useUIStore(s => s.update)

  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const project_id = useContextStore(s => s.project_id)

  const projectMap = useConvoStore(s => s.projects)
  const projects = useConvoStore(s => Object.values(s.projects))

  const [selected, setSelected] = useState(project_id || "")
  const [details, setDetails] = useState(projectMap[project_id] || {
    temperature: "",
    max_tokens: "",
    frequency_penalty: "",
    top_p: "",
    tokenLimit: "",
    web_enabled: false,
    rag_enabled: false,
  })

  const onChange = (key: string, val: any) => {
    setDetails(pr => ({
      ...pr,
      [key]: val
    }))
  }

  function onSave() {
    editProject(selected, details as any)
  }

  function onSelectProject(val: string) {
    setSelected(val)
    setDetails(projectMap[val])
  }

  function onChangeRag(val: boolean) {
    onChange("rag_enabled", val)
    if (val) updateTab({ data: "RAG" })
  }

  return (
    <>
      <div className="mb-4">
        <label className="df mb-0.5 text-xs opacity-70">Project Name</label>

        <Select value={selected} onValueChange={onSelectProject}>
          <SelectTrigger className="w-full h-8 text-sm focus:ring-0">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>

          <SelectContent>
            {
              projects.map(pro => (
                <SelectItem
                  value={pro.id}
                  key={pro.id}
                >
                  {pro.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Temperature</span>
          <Info details="Controls the randomness of the model's responses. Lower values (e.g., 0.1) make the output more deterministic and focused, while higher values (e.g., 1.0) make it more random and creative." />
        </p>
        <input
          min={0}
          max={1}
          step={0.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.temperature || ""}
          onChange={e => onChange("temperature", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Max Tokens</span>
          <Info details="The maximum number of tokens the model can generate in a single response. Limiting this helps manage response length and resource usage." />
        </p>
        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.max_tokens || ""}
          onChange={e => onChange("max_tokens", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Repeat Penalty</span>
          <Info details="A parameter that discourages the model from repeating the same text. A higher penalty value reduces repetition, making responses more varied." />
        </p>
        <input
          min={-2}
          max={2}
          step={.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.frequency_penalty || details?.frequency_penalty === 0 ? details?.frequency_penalty : ""}
          onChange={e => onChange("frequency_penalty", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Top P Sampling</span>
          <Info details="Adjusts the probability threshold for token sampling. Setting this to 1 means the model considers all possible tokens, while lower values limit the selection to more likely tokens, improving coherence." />
        </p>

        <input
          min={0}
          max={1}
          step={.1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.top_p || ""}
          onChange={e => onChange("top_p", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="mb-4">
        <p className="df mb-0.5 text-xs">
          <span className="opacity-70">Token Limit</span>
          <Info details="A Token Limit in a Large Language Model (LLM) refers to the maximum number of tokens (words or characters) the model can process in a single interaction. Staying within this limit ensures optimal performance and accurate responses." />
        </p>
        <input
          min={1}
          step={1}
          type="number"
          className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
          value={details?.tokenLimit || ""}
          onChange={e => onChange("tokenLimit", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 border rounded-md">
          <label htmlFor="" className="mb-0.5 text-xs opacity-80">Web Search</label>
          <p className="text-[10px] text-white/60">Enable and retrieve an answer from the web.</p>
          <Switch
            checked={details.web_enabled}
            onCheckedChange={val => onChange("web_enabled", val)}
            title="Enable web search"
            className="ml-auto"
            disabled={!selected}
          />
        </div>

        <div className="p-3 border rounded-md">
          <label htmlFor="" className="mb-0.5 text-xs opacity-80">RAG Search</label>
          <p className="text-[10px] text-white/60">Enable and retrieve answers from the uploaded document.</p>
          <Switch
            checked={details.rag_enabled}
            onCheckedChange={onChangeRag}
            title="Enable web search"
            className="ml-auto"
            disabled={!selected}
          />
        </div>
      </div>

      {
        ollamaEmbeddingModel &&
        <div className="text-[10px] text-white/60">Note: Embedding is not setuped yet. If you enable RAG, you will be navigated to embedding setup. Please complete the setup to use RAG</div>
      }

      <Footer onSave={onSave} />
    </>
  )
}

export default Chat