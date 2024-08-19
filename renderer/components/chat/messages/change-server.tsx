import useContextStore from "@/store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

function ChangeServer() {
  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)
  const webEnabled = useContextStore(s => s.webEnabled)

  return (
    <div className="df pl-[60px] pr-4 -mb-2">
      <Select value={model_type} onValueChange={v => updateContext({ model_type: v as any })}>
        <SelectTrigger className="w-[100px] py-0 h-6 text-xs text-white/80 bg-input/80 rounded rounded-b-none border-0 focus:ring-0">
          <SelectValue placeholder="Server" />
        </SelectTrigger>

        <SelectContent className="[&_svg]:hidden min-w-[100px]">
          <SelectItem className="h-6 px-2 text-xs" value="Nidum">Nidum</SelectItem>
          <SelectItem className="h-6 px-2 text-xs" value="Ollama">Ollama</SelectItem>
          <SelectItem className="h-6 px-2 text-xs" value="Groq">Groq</SelectItem>
        </SelectContent>
      </Select>

      <label htmlFor="" className="ml-auto text-xs text-white/60">Enable web search</label>
      <Switch
        checked={webEnabled}
        onCheckedChange={val => updateContext({ webEnabled: val })}
        className="h-4 w-8"
      />
    </div>
  )
}

export default ChangeServer
