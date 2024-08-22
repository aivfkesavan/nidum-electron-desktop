import { useQuery } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type props = {
  val: string
  ollamaUrl: string
  filterFn: (m: any) => boolean;
  onChange: (v: string) => void
}

function ModelSelect({ ollamaUrl, val, filterFn, onChange }: props) {
  const { data, isLoading } = useQuery({
    queryKey: ["ollama-tags", ollamaUrl],
    queryFn: () => getOllamaTags(ollamaUrl),
    enabled: !!ollamaUrl,
  })

  return (
    <Select value={val} onValueChange={onChange}>
      <SelectTrigger className="h-9 px-2 py-1.5 text-sm bg-transparent border focus:ring-0">
        <SelectValue placeholder="Server" />
      </SelectTrigger>

      <SelectContent className="[&_svg]:hidden min-w-[100px]">
        {
          !isLoading &&
          data
            ?.filter(filterFn)
            ?.map(m => (
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
  )
}

export default ModelSelect
