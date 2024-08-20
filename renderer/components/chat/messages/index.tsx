import { useEffect, useRef, useState } from "react";
import { FaFileAlt, FaSquare } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { nanoid } from "nanoid";
import { LuX } from "react-icons/lu";

import { createContext, duckDuckGoPrompt, duckDuckGoSerach, fileSearchQdrant } from "../../../utils/improve-context";
import isWithinTokenLimit from "@/utils/is-within-token-limit";

import { useAudio } from "./use-speech";
import { useToast } from "@/components/ui/use-toast";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";
import useModelStore from "@store/model";

import ModelProgress from "../model-progress";
import SpeechToText from "./speech-to-text";
import FileUpload from "./file-upload";
import Settings from "../settings";
import Header from "./header";
import List from "./list";

type msg = {
  id: string
  role: "user" | "assistant" | "loading"
  content: string
}

function Messages() {
  const { toast } = useToast()

  const {
    updateContext, project_id, chat_id: id, webEnabled,
    model_type, groqApiKey, groqModel, ollamaUrl, ollamaModel,
    embedding_type, ollamEmbeddingUrl, ollamaEmbeddingModel,
    vb_type, qdrantDBUrl,
  } = useContextStore()

  const isModelDownloading = useModelStore(s => s.is_downloading)
  const projectdetails = useConvoStore(s => s.projects[project_id] || null)
  const pushIntoMessages = useConvoStore(s => s.pushIntoMessages)
  const deleteMessage = useConvoStore(s => s.deleteMessage)
  const editChat = useConvoStore(s => s.editChat)
  const addChat = useConvoStore(s => s.addChat)

  const fileDetails = useConvoStore(s => {
    const file_id = s.chats?.[project_id]?.find(c => c.id === id)?.file_id
    return s.files?.[project_id]?.find(f => f.id === file_id)
  })

  const [reachedLimit, setReachedLimit] = useState(false)
  const [tempData, setTempData] = useState<msg[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const abortController = useRef(new AbortController())
  const scrollableRef = useRef<HTMLDivElement>(null)

  const { speak } = useAudio()

  const data = useConvoStore(s => s.messages?.[id] || [])
  const isChatInputDisabled = reachedLimit || !project_id

  useEffect(() => {
    setTempData([])
    setLoading(false)
  }, [id])

  useEffect(() => {
    scrollableRef?.current?.scrollIntoView({ behavior: "instant", block: "end" })

    if (data.length > 0 && tempData.length === 0) {
      if (!isWithinTokenLimit(JSON.stringify(data), projectdetails?.tokenLimit)) {
        setReachedLimit(true)
      }
    } else {
      setReachedLimit(false)
    }
  }, [data.length, tempData])

  function num(n: string | number, defaultVal: number) {
    return (n || n === 0) ? Number(n) : defaultVal
  }

  const postData = async (msg: string, needAutoPlay: boolean = false) => {
    try {
      if (msg) {
        if (model_type === "Groq") {
          if (!groqApiKey) return toast({ title: "Please provide Groq API key" })
          if (!groqModel) return toast({ title: "Please choose a Groq Model" })
        }
        else if (model_type === "Ollama") {
          if (!ollamaUrl) return toast({ title: "Please provide Ollama base url" })
          if (!ollamaModel) return toast({ title: "Please choose a Ollama Model" })
        }

        if (fileDetails) {
          if (embedding_type === "Ollama" && (!ollamEmbeddingUrl || !ollamaEmbeddingModel)) return toast({ title: "Please Check your Ollama embedding configurations in settings" })
          if (vb_type === "Qdrant" && !qdrantDBUrl) return toast({ title: "Please Check your Qdrant db configurations in settings" })
        }

        setMessage('')
        setLoading(true)
        let temContextId = ""

        if (!id) {
          temContextId = nanoid(10)

          addChat(project_id, {
            id: temContextId,
            title: msg,
            file_id: null,
          })

          updateContext({ chat_id: temContextId })
        }

        if (id && data?.length === 0) {
          updateContext({ chat_id: id })
          editChat(project_id, {
            id,
            title: msg,
          })
        }

        const currContextId = temContextId || id
        const user: msg = {
          id: nanoid(10),
          role: "user",
          content: msg,
        }

        setTempData(prev => [
          ...prev,
          user,
          {
            role: "loading",
            id: nanoid(10),
            content: "",
          }
        ])

        const dataMap = data ? data?.map(({ id, ...rest }: any) => rest) : []

        let systemPrompt = projectdetails?.systemPrompt || "You are a helpful AI assistant"

        if (webEnabled && !fileDetails) {
          const searchReult = await duckDuckGoSerach(msg)
          systemPrompt = createContext({
            base: duckDuckGoPrompt,
            context: searchReult,
          })
        }

        if (fileDetails) {
          const searchReult = await fileSearchQdrant(msg, fileDetails.id)
          systemPrompt = createContext({
            base: duckDuckGoPrompt,
            context: searchReult,
          })
        }

        const prompt = [
          {
            role: "system",
            content: systemPrompt
          },
          ...dataMap,
          {
            role: "user",
            content: msg,
          },
        ]
        // console.log(prompt)

        type urlsT = Record<"Groq" | "Ollama" | "Nidum", string>
        const urls: urlsT = {
          Groq: "https://api.groq.com/openai/v1/chat/completions",
          Ollama: `${ollamaUrl}/api/chat`,
          Nidum: "https://nidum2b.tunnelgate.haive.tech/v1/chat/completions",
        }

        let url = urls?.[model_type as keyof typeof urls]

        const headers: any = {
          "content-type": "application/json",
        }

        const payload: any = {
          n: num(projectdetails?.n, 1),
          top_p: num(projectdetails?.top_p, 1),
          max_tokens: num(projectdetails?.max_tokens, 500),
          temperature: num(projectdetails?.temperature, 0.1),
          frequency_penalty: num(projectdetails?.frequency_penalty, 0),
          stream: model_type === "Ollama",
          messages: prompt,
        }

        if (model_type === "Groq") {
          payload.model = groqModel
          headers.Authorization = `Bearer ${groqApiKey}`
        }

        if (model_type === "Nidum") {
          payload.model = "nidum_ai_2b"
        }

        if (model_type === "Ollama") {
          payload.model = ollamaModel
        }
        // console.log(config)

        if (!isWithinTokenLimit(JSON.stringify(prompt), projectdetails.tokenLimit)) {
          toast({
            title: "Token limit reached",
            description: "Please use new chat"
          })
          setReachedLimit(true)
          return
        }

        abortController.current = new AbortController()

        const response = await fetch(url, {
          signal: abortController.current.signal,
          method: "POST",
          body: JSON.stringify(payload),
          headers,
        })

        if (!response.ok) {
          const err = await response.json()
          const errMsg = err?.error?.message || err?.error
          // console.log(errMsg)
          // const content = errMsg ? `Error: ${errMsg}` : "Error"
          // const botReply: msg = {
          //   role: "assistant",
          //   id: nanoid(10),
          //   content,
          // }
          setTempData([])
          setLoading(false)
          // pushIntoMessages(currContextId, [
          //   user,
          //   botReply
          // ])
          toast({ title: errMsg || "Something went wrong!" })
          return
        }
        if (model_type === "Nidum" || model_type === "Groq") {
          const res = await response.json()
          const content = res?.choices?.[0]?.message?.content

          const botReply: msg = {
            role: "assistant",
            id: nanoid(10),
            content,
          }
          setTempData([])
          setLoading(false)
          pushIntoMessages(currContextId, [
            user,
            botReply
          ])
          if (needAutoPlay) {
            speak(botReply.id, botReply.content)
          }

        } else {
          const reader = response.body?.getReader()
          let botRes = ""

          reader?.read().then(function processResult(result: any): any {
            try {
              if (result.done) {
                const botReply: msg = {
                  role: "assistant",
                  content: botRes,
                  id: nanoid(10),
                }
                setTempData([])
                setLoading(false)
                pushIntoMessages(currContextId, [
                  user,
                  botReply
                ])
                if (needAutoPlay) {
                  speak(botReply.id, botReply.content)
                }
                return;
              }

              const decoded = new TextDecoder().decode(result.value)
              const res = model_type === "Ollama" ? decoded : decoded?.split("data: ")[1]
              if (res && res !== "[DONE]") {
                const json = JSON.parse(res)
                const text = model_type === "Ollama" ? json?.message?.content : json?.choices?.[0]?.delta?.content || ""
                botRes += text

                const botReply: msg = {
                  role: "assistant",
                  content: botRes,
                  id: nanoid(10),
                }

                setTempData(prev => prev.map(p => {
                  if (p.role === "assistant" || p.role === "loading") {
                    return botReply
                  }
                  return p
                }))
              }

              return reader.read().then(processResult)

            } catch (error) { }
          })
        }
      }
    } catch (error) {
      setLoading(false)
      setTempData([])
      console.log(error)
      toast({ title: "Something went wrong!" })
    }
  }

  const stopListening = () => {
    try {
      abortController?.current?.abort()
      abortController.current = new AbortController()
      pushIntoMessages(id, tempData.filter(f => f.role !== "loading"))
      setLoading(false)
      setTempData([])
    } catch (error) { }
  }

  const sentMessage = () => {
    if (message) {
      postData(message)
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      sentMessage()
    }
  }

  const deleteChat = (msgId: string) => deleteMessage(id, msgId)

  return (
    <div className="dfc h-screen flex-1 text-sm">
      <Header />

      <div className="scroll-y px-6 py-2 mt-2">
        {
          tempData?.length === 0 &&
          (!data || data?.length === 0) &&
          <div className="dc h-[calc(100%-16px)]">
            <img
              className="w-16 opacity-60"
              src="/logo.png"
              alt=""
            />
          </div>
        }

        <div className="max-w-4xl w-full mx-auto pt-6 lg:pl-6">
          <List
            list={data}
            deleteChat={deleteChat}
          />

          {
            tempData?.length > 0 &&
            <List list={tempData} isTemp />
          }

          <div ref={scrollableRef} className="py-2"></div>
        </div>
      </div>

      <div className="df pb-4 px-4 max-w-4xl w-full mx-auto relative">
        <Settings />

        {
          fileDetails &&
          <div className="df py-2 pl-3 text-xs absolute bottom-full left-4 sm:left-[68px] text-white/80 bg-border rounded-sm">
            <FaFileAlt className="shrink-0 text-xl text-white/50" />
            <p className="w-48 truncate">{fileDetails.name}</p>

            <button
              className="shrink-0 p-1 hover:bg-red-400 mr-1"
              onClick={() => editChat(project_id, { id, file_id: null })}
            >
              <LuX />
            </button>
          </div>
        }

        <div className="flex-1 relative">
          <input
            type="text"
            className="pl-4 pr-10 bg-transparent border-2 rounded-full"
            placeholder={
              reachedLimit ? "Token limit reached" :
                !project_id ? "Please choose a project" :
                  "Message"
            }
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={keyPress}
            disabled={isChatInputDisabled}
          />

          {
            loading &&
            <button
              className={`p-2 animate-in border border-foreground/20 absolute top-1 right-2 bg-input hover:bg-red-200 transition-colors text-red-500`}
              onClick={stopListening}
            >
              <FaSquare />
            </button>
          }

          {
            !loading && message &&
            <button
              className="p-1.5 animate-in text-lg absolute top-[5px] right-2 hover:bg-border transition-colors rounded-full"
              onClick={sentMessage}
            >
              <LuSend />
            </button>
          }
        </div>

        <SpeechToText
          postData={postData}
          disabled={isChatInputDisabled}
        />

        <FileUpload />

        {
          isModelDownloading &&
          <ModelProgress />
        }
      </div>
    </div>
  )
}

export default Messages
