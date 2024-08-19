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

function Chat() {
  const project_id = useContextStore(s => s.project_id)
  const projectdetails = useConvoStore(s => s.projects[project_id] || null)
  const projects = useConvoStore(s => Object.values(s.projects))
  const editProject = useConvoStore(s => s.editProject)

  const [selected, setSelected] = useState(project_id || "")

  const onChange = (key: string, val: number | string | boolean) => {
    editProject(selected, {
      [key]: val
    })
  }

  return (
    <div>
      <div className="mb-4">

        <label className="df mb-0.5 text-xs opacity-70">Project Name</label>
        <Select value={selected} onValueChange={setSelected}>
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
          value={projectdetails?.temperature || ""}
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
          value={projectdetails?.max_tokens || ""}
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
          value={projectdetails?.frequency_penalty || projectdetails?.frequency_penalty === 0 ? projectdetails?.frequency_penalty : ""}
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
          value={projectdetails?.top_p || ""}
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
          value={projectdetails?.tokenLimit || ""}
          onChange={e => onChange("tokenLimit", e.target.valueAsNumber)}
          disabled={!selected}
        />
      </div>
    </div>
  )
}

export default Chat
