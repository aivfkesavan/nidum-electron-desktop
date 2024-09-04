import { useEffect, useRef, useState } from "react";
import { FaFileAlt, FaSquare } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { nanoid } from "nanoid";
import { LuX } from "react-icons/lu";

import type { Message } from "@/store/conversations";

import { createContext, duckDuckGoPrompt, duckDuckGoSerach, ragSearch } from "../../../utils/improve-context";
import { imgToBase64, setImgToBase64Map } from "@actions/img";
// import isWithinTokenLimit from "@/utils/is-within-token-limit";

import { useAudio } from "./use-speech";
import { useToast } from "@/components/ui/use-toast";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";

import ManageResourses from "./manage-resourses";
import SpeechToText from "./speech-to-text";
import ImageUpload from "./image-upload";
import Settings from "../settings";
import Header from "./header";
import List from "./list";

function Messages() {
  const { toast } = useToast()

  const {
    updateContext, project_id, chat_id: id,
    model_type, groqApiKey, groqModel, ollamaUrl, ollamaModel, ollamaModeType,
    embedding_type, ollamEmbeddingUrl, ollamaEmbeddingModel,
  } = useContextStore()

  const projectdetails = useConvoStore(s => s.projects[project_id] || null)
  const filesLen = useConvoStore(s => s.files[project_id]?.length)
  const pushIntoMessages = useConvoStore(s => s.pushIntoMessages)
  const deleteMessage = useConvoStore(s => s.deleteMessage)
  const editProject = useConvoStore(s => s.editProject)
  const editChat = useConvoStore(s => s.editChat)
  const addChat = useConvoStore(s => s.addChat)
  const init = useConvoStore(s => s.init)

  const webEnabled = useConvoStore(s => s.projects[project_id]?.web_enabled)
  const ragEnabled = useConvoStore(s => s.projects[project_id]?.rag_enabled)

  // const [reachedLimit, setReachedLimit] = useState(false)
  const [tempData, setTempData] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const abortController = useRef(new AbortController())
  const scrollableRef = useRef<HTMLDivElement>(null)

  const { speak } = useAudio()

  const data = useConvoStore(s => s.messages?.[id] || [])
  const isChatInputDisabled = !project_id // reachedLimit || 

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setTempData([])
    setLoading(false)
    setFiles([])
  }, [id])

  useEffect(() => {
    scrollableRef?.current?.scrollIntoView({ behavior: "instant", block: "end" })

    // if (data.length > 0 && tempData.length === 0) {
    //   if (!isWithinTokenLimit(JSON.stringify(data), projectdetails?.tokenLimit)) {
    //     setReachedLimit(true)
    //   }
    // } else {
    //   setReachedLimit(false)
    // }
  }, [data.length, tempData])

  function num(n: string | number, defaultVal: number) {
    return (n || n === 0) ? Number(n) : defaultVal
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result
        if (typeof result === 'string') {
          const base64 = result.split(',')[1]
          setImgToBase64Map(file.name, base64)
          resolve(base64)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  const postData = async (msg: string, needAutoPlay: boolean = false) => {
    try {
      if (msg) {
        if (model_type === "Groq") {
          if (!groqApiKey) return toast({ title: "Please provide Groq API key" })
          if (!groqModel) return toast({ title: "Please choose a Groq Model" })
        }
        else if (model_type === "Ollama") {
          if (!ollamaUrl) return toast({ title: "Please provide base url" })
          if (!ollamaModel) return toast({ title: "Select a model to continue the chat" })
        }

        if (ragEnabled) {
          if (embedding_type === "Ollama" && (!ollamEmbeddingUrl || !ollamaEmbeddingModel)) return toast({ title: "Please Check your embedding configurations in settings" })
        }

        setFiles([])
        setMessage('')
        setLoading(true)
        let temContextId = ""

        if (!id) {
          temContextId = nanoid(10)

          addChat(project_id, {
            id: temContextId,
            title: msg,
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
        const user: Message = {
          id: nanoid(10),
          role: "user",
          content: msg,
        }

        if (files?.length > 0) {
          user.images = files.map(f => f.name)
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

        let dataMap = []

        if (data) {
          if (ollamaModeType === "vision") {
            dataMap = await Promise.all(data?.map(async ({ id, ...rest }) => {
              if (rest?.images?.length > 0) {
                const base64Files = await Promise.all(rest.images.map(imgToBase64))
                rest.images = base64Files
              }
              return rest
            }))

          } else {
            dataMap = data?.map(({ id, images, ...rest }) => rest)
          }
        }

        let systemPrompt = projectdetails?.systemPrompt || "You are a helpful AI assistant"

        if (webEnabled && !ragEnabled) {
          const searchReult = await duckDuckGoSerach(msg)
          systemPrompt = createContext({
            base: duckDuckGoPrompt,
            context: searchReult,
          })
        }

        if (ragEnabled && filesLen > 0) {
          const searchReult = await ragSearch(msg)
          systemPrompt = createContext({
            base: projectdetails?.ragPrompt || duckDuckGoPrompt,
            context: searchReult,
          })
        }

        const { id: _, ...restUserContent } = user

        if (restUserContent?.images?.length > 0) {
          const base64Files = await Promise.all(files.map(convertToBase64))
          restUserContent.images = base64Files
        }

        const prompt = [
          {
            role: "system",
            content: systemPrompt
          },
          ...dataMap,
          restUserContent,
        ]

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

        // if (!isWithinTokenLimit(JSON.stringify(prompt), projectdetails.tokenLimit)) {
        //   toast({
        //     title: "Token limit reached",
        //     description: "Please use new chat"
        //   })
        //   setReachedLimit(true)
        //   return
        // }

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
          setTempData([])
          setLoading(false)
          toast({ title: errMsg || "Something went wrong!" })
          return
        }

        if (model_type === "Nidum" || model_type === "Groq") {
          const res = await response.json()
          const content = res?.choices?.[0]?.message?.content

          const botReply: Message = {
            role: "assistant",
            id: nanoid(10),
            content,
          }
          setTempData([])
          setLoading(false)
          pushIntoMessages(project_id, currContextId, [
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
                const botReply: Message = {
                  role: "assistant",
                  content: botRes,
                  id: nanoid(10),
                }
                setTempData([])
                setLoading(false)
                pushIntoMessages(project_id, currContextId, [
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
                if (json?.error && !text) {
                  setTempData([])
                  setLoading(false)
                  toast({ title: "Please use new chat" })
                  return
                }
                botRes += text

                const botReply: Message = {
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
      pushIntoMessages(project_id, id, tempData.filter(f => f.role !== "loading"))
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
          ragEnabled &&
          <div className="df py-1 pl-2 text-xs absolute bottom-full left-4 sm:left-[68px] text-white/80 bg-border rounded-sm">
            <FaFileAlt className="shrink-0 text-base text-white/50" />
            <p className="w-24 truncate">RAG enabled</p>

            <button
              className="shrink-0 p-1 hover:bg-red-400 mr-1"
              onClick={() => editProject(project_id, { rag_enabled: false })}
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
              // reachedLimit ? "Token limit reached" :
              !project_id ? "Please choose a project" :
                "Message"
            }
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={keyPress}
            disabled={isChatInputDisabled}
          />

          {
            ollamaModeType === "vision" &&
            <ImageUpload
              files={files}
              loading={loading}
              message={message}
              setFiles={setFiles}
            />
          }

          {
            loading &&
            <button
              className="p-1.5 animate-in border border-foreground/20 absolute top-1.5 right-2 rounded-full bg-white/80 text-black/80 hover:bg-red-200 transition-colors"
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

        <ManageResourses />
      </div>
    </div>
  )
}

export default Messages
