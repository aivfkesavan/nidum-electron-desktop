
import useContextStore from "@/store/context";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuChevronRight } from "react-icons/lu";

type items = "Groq" | "Ollama" | "Nidum"
const list: items[] = ["Ollama", "Groq"]

function ModelSelect() {
  const updateContext = useContextStore(s => s.updateContext)
  const model_type = useContextStore(s => s.model_type)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="pl-6 [.open_&]:pl-0 df gap-px text-sm">
        {model_type} <LuChevronRight className="opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        {
          list.map(l => (
            <DropdownMenuItem
              key={l}
              onClick={() => updateContext({ model_type: l })}
            >
              {l}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModelSelect
