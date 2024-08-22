import { useState } from "react";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Info from "@/components/common/info";
import Footer from "../common/footer";

function Chat() {
  const project_id = useContextStore(s => s.project_id)
  const projectMap = useConvoStore(s => s.projects)
  const projects = useConvoStore(s => Object.values(s.projects))
  const editProject = useConvoStore(s => s.editProject)

  const [selected, setSelected] = useState(project_id || "")
  const [details, setDetails] = useState(projectMap[project_id] || {
    temperature: "",
    max_tokens: "",
    frequency_penalty: "",
    top_p: "",
    tokenLimit: "",
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

      <Footer onSave={onSave} />
    </>
  )
}

export default Chat
