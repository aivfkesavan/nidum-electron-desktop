import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { useProjectById, useProjectMutate, useProjectsMiniByUserId } from "../../../../hooks/use-project";
import useContextStore from "../../../../store/context";
import { useCrawler } from "../../../../hooks/use-crawler";
import useConvoStore from "../../../../store/conversations";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Switch } from "../../../../components/ui/switch";

import Info from "../../../../components/common/info";
import Footer from "../common/footer";

function Chat() {
  const project_id = useContextStore(s => s.project_id)
  const hasFiles = useConvoStore(s => s.files[project_id]?.length)

  const [selected, setSelected] = useState(project_id || "")

  const { mutate } = useProjectMutate()
  const { data: crawlerData } = useCrawler()
  const { data: projects } = useProjectsMiniByUserId()
  const { data: project } = useProjectById(selected)

  const { control, register, handleSubmit, setValue, reset, formState: { errors, isDirty } } = useForm()

  useEffect(() => {
    if (project) {
      reset({
        temperature: project?.temperature,
        max_tokens: project?.max_tokens,
        frequency_penalty: project?.frequency_penalty,
        top_p: project?.top_p,
        web_enabled: project?.web_enabled,
        rag_enabled: project?.rag_enabled,
      })
    }
  }, [project])

  const hasWebCrawle = crawlerData && Object.keys(crawlerData)?.length > 0

  function onSave(data: any) {
    mutate({ ...data, _id: selected }, {
      onSuccess() {
        reset(data)
      }
    })
  }

  return (
    <>
      <div className="mb-4">
        <label className="df mb-0.5 text-xs opacity-70">Project Name</label>

        <Select value={selected} onValueChange={setSelected}>
          <SelectTrigger className="w-full h-8 text-sm focus:ring-0">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>

          <SelectContent>
            {
              projects?.map((pro: any) => (
                <SelectItem
                  value={pro?._id}
                  key={pro?._id}
                >
                  {pro.name}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
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
            disabled={!selected}
            className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
            {...register("temperature", {
              required: "Temperature is required",
              min: { value: 0, message: "Min value is 0" },
              max: { value: 1, message: "Max value is 1" },
              valueAsNumber: true,
            })}
          />
          {errors.temperature &&
            // @ts-ignore
            <p className="mt-0.5 text-xs text-red-400">{errors.temperature?.message}</p>
          }
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
            disabled={!selected}
            className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
            {...register("max_tokens", {
              required: "Max tokens is required",
              min: { value: 1, message: "Min value is 1" },
              valueAsNumber: true,
            })}
          />
          {errors.max_tokens &&
            // @ts-ignore
            <p className="mt-0.5 text-xs text-red-400">{errors.max_tokens.message}</p>
          }
        </div>

        <div className="mb-4">
          <p className="df mb-0.5 text-xs">
            <span className="opacity-70">Repeat Penalty</span>
            <Info details="A parameter that discourages the model from repeating the same text. A higher penalty value reduces repetition, making responses more varied." />
          </p>
          <input
            min={-2}
            max={2}
            step={0.1}
            type="number"
            disabled={!selected}
            className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
            {...register("frequency_penalty", {
              required: "Repeat penalty is required",
              min: { value: -2, message: "Min value is -2" },
              max: { value: 2, message: "Max value is 2" },
              valueAsNumber: true,
            })}
          />
          {errors.frequency_penalty &&
            // @ts-ignore
            <p className="mt-0.5 text-xs text-red-400">{errors.frequency_penalty.message}</p>
          }
        </div>

        <div className="mb-4">
          <p className="df mb-0.5 text-xs">
            <span className="opacity-70">Top P Sampling</span>
            <Info details="Adjusts the probability threshold for token sampling. Setting this to 1 means the model considers all possible tokens, while lower values limit the selection to more likely tokens, improving coherence." />
          </p>
          <input
            min={0}
            max={1}
            step={0.1}
            type="number"
            disabled={!selected}
            className="no-number-arrows px-2 py-1 text-[13px] bg-transparent border resize-none"
            {...register("top_p", {
              required: "Top P is required",
              min: { value: 0, message: "Min value is 0" },
              max: { value: 1, message: "Max value is 1" },
              valueAsNumber: true,
            })}
          />
          {errors.top_p &&
            // @ts-ignore
            <p className="mt-0.5 text-xs text-red-400">{errors.top_p.message}</p>
          }
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <label htmlFor="" className="mb-0.5 text-xs opacity-80">
              Web Search
            </label>
            <p className="text-[10px] text-white/60">
              Enable and retrieve an answers from the <br /> web.
            </p>
            <Controller
              name="web_enabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(val) => {
                    onChange(val)
                    setValue("rag_enabled", false)
                  }}
                  title="Enable web search"
                  className="ml-auto"
                  disabled={!selected}
                />
              )}
            />
          </div>

          <div className="p-3 border rounded-md">
            <label htmlFor="" className="mb-0.5 text-xs opacity-80">
              RAG Search
            </label>
            <p className="text-[10px] text-white/60">
              Enable and retrieve answers from the uploaded documents.
            </p>
            <Controller
              name="rag_enabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(val) => {
                    onChange(val)
                    setValue("web_enabled", false)
                  }}
                  title={
                    !hasFiles
                      ? "Upload files or webcrawle sites to enable RAG search"
                      : "Enable RAG search"
                  }
                  className="ml-auto"
                  disabled={!selected || !(hasFiles || hasWebCrawle)}
                />
              )}
            />
          </div>
        </div>

        {
          !hasFiles &&
          <div className="text-[10px] text-white/60">
            Note: For RAG, no file is currently uploaded. Please upload a file and enable RAG to proceed.
          </div>
        }

        {isDirty && <Footer />}
      </form>
    </>
  )
}

export default Chat
