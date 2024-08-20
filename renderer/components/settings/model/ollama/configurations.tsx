import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";
import useContextStore from "@store/context";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@components/ui/use-toast";

function Configurations() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaModel = useContextStore(s => s.ollamaModel)
  const ollamaUrl = useContextStore(s => s.ollamaUrl)

  const { toast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: getOllamaTags,
  })

  async function checkAutoDetect() {
    try {
      const res = await fetch("http://localhost:11434")
      const txt = await res.text()

      if (txt === "Ollama is running") {
        toast({ title: "Ollama detected" })
        updateContext({
          ollamaUrl: "http://localhost:11434",
          ollamaModel: "",
        })
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })

      console.log(error)
    }
  }

  return (
    <>
      <div className="mb-4">
        <div className="df justify-between mb-0.5">
          <label htmlFor="" className="text-xs opacity-70">Ollama base url</label>

          <button
            className="px-2 py-0.5 text-xs bg-input hover:bg-input/50"
            onClick={checkAutoDetect}
          >
            Auto detect
          </button>
        </div>

        <input
          type="text"
          className="text-sm px-2 py-1.5 bg-transparent border"
          placeholder="http://localhost:11434"
          value={ollamaUrl}
          onChange={e => updateContext({ ollamaUrl: e.target.value })}
        />
      </div>

      <div className="mb-8">
        <label htmlFor="" className="text-xs opacity-70">Ollama Model Name</label>

        <Select value={ollamaModel} onValueChange={v => updateContext({ ollamaModel: v })}>
          <SelectTrigger className="h-9 px-2 py-1.5 text-sm bg-transparent border focus:ring-0">
            <SelectValue placeholder="Server" />
          </SelectTrigger>

          <SelectContent className="[&_svg]:hidden min-w-[100px]">
            {
              !isLoading && data?.map(m => (
                <SelectItem
                  className="h-6 px-2 text-xs"
                  value={m.model}
                  key={m.model}
                >
                  {m.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </>
  )
}

export default Configurations
