import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getOllamaTags } from "@actions/ollama";
import { useDownloads } from "@components/chat/download-manager/provider";
import useContextStore from "@/store/context";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@components/ui/use-toast";
import Instructions from "../../llm/ollama/instructions";
import Footer from "../../common/footer";

function Ollama() {
  const updateContext = useContextStore(s => s.updateContext)
  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)

  const [autodetectFailed, setAutoDetectFailed] = useState(false)
  const [details, setDetails] = useState({
    ollamaEmbeddingModel,
    ollamEmbeddingUrl,
  })

  const { downloads, downloadModel } = useDownloads()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  async function checkAutoDetect() {
    try {
      let url = "http://localhost:11434"
      let model = "mxbai-embed-large"
      const res = await fetch(url)
      const txt = await res.text()

      if (txt === "Ollama is running") {
        const data = await queryClient.fetchQuery({
          queryKey: ["ollama-tags", url],
          queryFn: () => getOllamaTags(url)
        })
        const hasEmbModel = data?.some(d => d?.model?.includes(model))
        const toastPayload: any = { title: "Ollama detected" }
        if (!hasEmbModel) {
          toastPayload.description = "But model not found"
        }
        toast(toastPayload)
        let payload = {
          ollamEmbeddingUrl: url,
          ollamaEmbeddingModel: hasEmbModel ? model : "",
        }
        setDetails(payload)
        updateContext(payload)
        setAutoDetectFailed(false)
      } else {
        setAutoDetectFailed(true)
        updateContext({
          ollamEmbeddingUrl: "",
          ollamaEmbeddingModel: "",
        })
      }

    } catch (error) {
      toast({ title: "Cannot auto detect ollama" })
      setAutoDetectFailed(true)
      console.log(error)
      updateContext({
        ollamEmbeddingUrl: "",
        ollamaEmbeddingModel: "",
      })
    }
  }

  function onChange(payload: Record<string, any>) {
    setDetails(pr => ({
      ...pr,
      ...payload,
    }))
  }

  function onSave() {
    updateContext(details)
  }

  return (
    <>
      <div className="my-4">
        <div className="df justify-between mb-0.5">
          <label htmlFor="" className="text-xs opacity-70">Ollama Embedding url</label>

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
          value={details.ollamEmbeddingUrl}
          onChange={e => onChange({ ollamEmbeddingUrl: e.target.value })}
        />
      </div>

      {
        autodetectFailed &&
        <div className="mb-4">
          <div className="mb-2 text-xs text-white/60">Auto detect failed. If you are not setuped the ollama, please follow the instructions to setup. Or Iy you already setuped ollama, please manually provide the link.</div>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-1 pl-0 text-sm text-white/80 hover:text-white hover:no-underline">Instructions</AccordionTrigger>
              <AccordionContent>
                <Instructions />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      }

      {
        downloads?.["mxbai-embed-large:latest"] &&
        <div className="text-xs text-white/70">
          RAG setup progress: {downloads?.["mxbai-embed-large:latest"]?.progress}%
        </div>
      }

      {
        !ollamaEmbeddingModel && details.ollamEmbeddingUrl && !downloads?.["mxbai-embed-large:latest"] &&
        <div className="text-xs">
          <p className="mb-0.5 text-white/60">It appears the model hasn't been downloaded yet. Would you like to download it?</p>
          <button
            className="px-3 py-1.5 bg-input"
            onClick={() => downloadModel({
              name: "mxbai-embed-large:latest",
              ollamaUrl: ollamEmbeddingUrl,
              initiater: "embedder",
              onSuccess() {
                queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
                updateContext({ ollamaEmbeddingModel: "mxbai-embed-large:latest" })
              },
              onError() { },
            })}
          >
            Download and setup
          </button>
        </div>
      }

      {
        ollamEmbeddingUrl && ollamaEmbeddingModel && !downloads?.["mxbai-embed-large:latest"] &&
        <div className="text-[10px] text-white/60">
          You are all set to use RAG. You can enable RAG under project section.
        </div>
      }

      <Footer onSave={onSave} />
    </>
  )
}

export default Ollama
