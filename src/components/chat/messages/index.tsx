import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaFileAlt, FaSquare } from "react-icons/fa";
import { Ollama } from 'ollama/browser';
import { LuSend } from "react-icons/lu";
import { nanoid } from "nanoid";
import { LuX } from "react-icons/lu";

import type { Message } from "../../../store/conversations";

import { createContext, ragDefaultPrompt, duckDuckGoSerach, ragSearch, systemDefaultPrompt, webDefaultPrompt } from "../../../utils/improve-context";
import { imgToBase64, setImgToBase64Map } from "../../../actions/img";
import { basicTokenizer, genMongoId } from "../../../utils";
import constants from "../../../utils/constants";

import { useAudio } from "./use-speech";
import { useToast } from "../../../hooks/use-toast";

import useContextStore, { llm_modelsT } from "../../../store/context";
import useConvoStore from "../../../store/conversations";
import useAuthStore from "../../../store/auth";

import { useLLMModels, useLLamaDownloadedModels } from "../../../hooks/use-llm-models";
import { useSharedDevice } from "../../../hooks/use-device";
import useOnlineStatus from "../../../hooks/use-online-status";
import { useCrawler } from "../../../hooks/use-crawler";
import { useConfig } from "../../../hooks/use-config";
import useTempStore from "../../../store/temp";

import ManageResourses from "./manage-resourses";
import SpeechToText from "./speech-to-text";
import ImageUpload from "./image-upload";
import Settings from "../settings";
import List from "./list";

import logo from '../../../assets/imgs/logo.png';

function Messages() {
  const { toast } = useToast()

  const navigate = useNavigate()
  const user_id = useAuthStore(s => s._id)

  const model_type = useContextStore(s => s?.data?.[user_id]?.model_type)
  const model_mode = useContextStore(s => s?.data?.[user_id]?.model_mode)
  const sharedAppId = useContextStore(s => s?.data?.[user_id]?.sharedAppId)
  const llamaModel = useContextStore(s => s?.data?.[user_id]?.llamaModel)
  const ollamaModel = useContextStore(s => s?.data?.[user_id]?.ollamaModel)
  const ollamaUrl = useContextStore(s => s?.data?.[user_id]?.ollamaUrl)
  const nidumDecentralisedModel = useContextStore(s => s?.data?.[user_id]?.nidumDecentralisedModel)

  const updateContext = useContextStore(s => s.updateContext)

  const { project_id = "", chat_id = "" } = useParams()

  const projectDetails = useConvoStore(s => s?.data?.[user_id]?.projects[project_id] || null)
  const filesLen = useConvoStore(s => s?.data?.[user_id]?.files[project_id]?.length || 0)
  const pushIntoMessages = useConvoStore(s => s.pushIntoMessages)
  const deleteMessage = useConvoStore(s => s.deleteMessage)
  const editProject = useConvoStore(s => s.editProject)
  const editChat = useConvoStore(s => s.editChat)
  const addChat = useConvoStore(s => s.addChat)

  const { data: nidumCentralised } = useLLMModels("nidum-decentralised2")
  const { data: downloadedModels } = useLLamaDownloadedModels("downloaded")
  const { data: sharedDevice } = useSharedDevice(sharedAppId, model_type === "Nidum Shared")
  const { data: crawlerData } = useCrawler()
  const { data: config } = useConfig()
  const isOnline = useOnlineStatus()

  const setTempData = useTempStore(s => s.setTempData)
  const setLoading = useTempStore(s => s.setLoading)
  const resetTemp = useTempStore(s => s.reset)
  const tempData = useTempStore(s => s?.data?.[chat_id]?.data || [])
  const loading = useTempStore(s => s?.data?.[chat_id]?.loading || false)

  const [timings, setTimings] = useState<number>(null)
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])

  const abortController = useRef<AbortController | Ollama>(new AbortController())
  const scrollableRef = useRef<HTMLDivElement>(null)

  const { speak } = useAudio()

  const data = useConvoStore(s => s?.data?.[user_id]?.messages?.[chat_id] || [])
  const isChatInputDisabled = !project_id

  const {
    hfApiKey, hfModel,
    groqApiKey, groqModel,
    sambaNovaApiKey, sambaNovaModel,
    anthropicApiKey, anthropicModel,
    openaiApiKey, openaiModel,
  } = config || {}

  useEffect(() => {
    setTimings(null)
  }, [chat_id])

  useEffect(() => {
    if (!isOnline && !loading) {
      if (!["Local"].includes(model_type)) { // "Ollama"
        updateContext({ model_type: "Local", model_mode: "" })
        toast({ title: "Defaulted to the Local AI Server due to a connection error." })
      }
    }
  }, [isOnline, loading, model_type])

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
          const base64 = result.split(',')[1] as string
          setImgToBase64Map(file.name, base64)
          resolve(base64)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = error => reject(error)
    })
  }

  function hasAPiKeyError() {
    if (model_type === "Groq") {
      if (!groqApiKey) return "Please enter the Groq API key to proceed."
      if (!groqModel) return "Please select a Groq Model to continue."
    }
    else if (model_type === "Local") {
      if (!llamaModel) return "Please choose a model to continue the chat."
      if (!downloadedModels?.some((d: any) => d.fileName === llamaModel)) {
        return "The selected model is currently unavailable."
      }
    }
    else if (model_type === "Hugging Face") {
      if (!hfApiKey) return "Please enter the Hugging Face API key to proceed."
      if (!hfModel) return "Please select a Hugging Face Model to continue."
    }
    else if (model_type === "SambaNova") {
      if (!sambaNovaApiKey) return "Please provide the SambaNova API key."
      if (!sambaNovaModel) return "Please select a SambaNova Model to continue."
    }
    else if (model_type === "Anthropic") {
      if (!anthropicApiKey) return "Please provide the Anthropic API key."
      if (!anthropicModel) return "Please choose an Anthropic Model."
    }
    else if (model_type === "OpenAI") {
      if (!openaiApiKey) return "Please provide the OpenAI API key to proceed."
      if (!openaiModel) return "Please select an OpenAI Model to continue."
    }
    else if (model_type === "Nidum Shared") {
      if (!sharedDevice?.modelName) return "A provider has not been selected for the model."
    }
    else if (model_type === "Ollama") {
      if (!ollamaUrl) return "Please provide the Ollama base URL."
      if (!ollamaModel) return "Please select an Ollama Model to proceed."
    }
    return ""
  }

  const postData = async (msg: string, needAutoPlay: boolean = false) => {
    const currContextId = chat_id || window.location?.hash?.split("/c/")[1]

    try {
      if (msg && projectDetails) {
        const hasError = hasAPiKeyError()
        if (hasError) return toast({ title: hasError })

        setFiles([])
        setMessage('')
        setLoading(currContextId, true)
        setTimings(null)

        if (chat_id && data?.length === 0) {
          editChat(project_id, {
            id: currContextId,
            title: msg,
          })
        }

        const user: Message = {
          id: nanoid(10),
          role: "user",
          content: msg,
        }

        if (files?.length > 0) {
          user.images = files.map(f => f.name)
        }

        const initial = [user]
        const webSearchId = nanoid(10)

        if (isOnline && projectDetails?.web_enabled) {
          const webSearch: Message = {
            id: webSearchId,
            role: "web-searched",
            content: "",
            webSearched: [],
          }
          initial.push(webSearch)
        }

        initial.push({
          role: "loading",
          id: nanoid(10),
          content: "",
        })
        setTempData(currContextId, initial)

        let dataMap: any = []
        const onlyAllwedInputs = ["user", "assistant"]

        if (data) {
          if (model_mode === "vision" && model_type === "Nidum Decentralized") {
            dataMap = await Promise.all(data?.filter(d => onlyAllwedInputs.includes(d.role))?.map(async ({ id, ...rest }) => {
              if (rest?.images && rest?.images?.length > 0) {
                const base64Files = await Promise.all(rest.images.map(imgToBase64))
                rest.images = base64Files
              }
              return rest
            }))
          }
          else if (model_type === "Local") {
            dataMap = data?.filter(d => onlyAllwedInputs.includes(d.role))?.map(d => {
              let is_user = d.role === "user"
              if (is_user) {
                return {
                  type: "user",
                  text: d.content
                }
              }
              return {
                type: "model",
                response: [d.content],
              }
            })
          } else {
            dataMap = data?.filter(d => onlyAllwedInputs.includes(d.role))?.map(({ id, images, ...rest }) => rest)
          }
        }

        let systemPrompt = projectDetails?.systemPrompt || systemDefaultPrompt
        let webSearchedData: string[] = []

        if (isOnline && projectDetails?.web_enabled && !projectDetails?.rag_enabled) {
          const searchResult = await duckDuckGoSerach(msg)
          if (searchResult?.length > 0) {
            webSearchedData = searchResult.map((f: any) => f.href)
            systemPrompt = createContext({
              base: projectDetails?.webPrompt || webDefaultPrompt,
              context: searchResult.map((f: any) => f.body).join(","),
            })
          }
          setTempData(currContextId, prev => prev.map(p => {
            if (p.role === "web-searched") {
              return {
                ...p,
                webSearched: webSearchedData
              }
            }
            return p
          }))
        }

        if (isOnline && projectDetails?.rag_enabled && (filesLen > 0 || Object.keys(crawlerData)?.length > 0)) {
          const searchReult = await ragSearch(msg)
          systemPrompt = createContext({
            base: projectDetails?.ragPrompt || ragDefaultPrompt,
            context: searchReult,
          })
        }

        const { id: _, ...restUserContent } = user as any

        if (restUserContent?.images?.length > 0) {
          const base64Files = await Promise.all(files.map(convertToBase64))
          restUserContent.images = base64Files
        }

        const isLocal = ["Local", "Nidum Shared"].includes(model_type)
        const prompt = [
          {
            role: "system",
            [isLocal ? "text" : "content"]: systemPrompt
          },
          ...dataMap,
        ]

        if (!isLocal) {
          prompt.push(restUserContent)
        }

        type urlsT = Record<llm_modelsT, string>
        const urls: urlsT = {
          Local: `${constants.backendUrl}/llama-chat`,
          "Nidum Shared": `https://${sharedAppId}.${sharedDevice?.domain}/llama-chat/2`,
          "Nidum Decentralized": nidumCentralised?.url,
          Groq: "https://api.groq.com/openai/v1/chat/completions",
          "Hugging Face": `https://api-inference.huggingface.co/models/${hfModel}/v1/chat/completions`,
          "SambaNova": `${constants.backendUrl}/ai/sambanova`,
          Anthropic: "https://api.anthropic.com/v1/messages",
          OpenAI: "https://api.openai.com/v1/chat/completions",
          Ollama: `${ollamaUrl}/api/chat`,
        }

        let url = urls?.[model_type as keyof typeof urls]

        const headers: any = {
          "content-type": "application/json",
        }

        const payload: any = {
          top_p: num(projectDetails?.top_p, 1),
          max_tokens: num(projectDetails?.max_tokens, 500),
          temperature: num(projectDetails?.temperature, 0.1),
          stream: !["Nidum", "Anthropic"].includes(model_type),
          messages: prompt,
        }

        if (model_type !== "Anthropic") {
          // payload.n = num(projectDetails?.n, 1)
          payload.frequency_penalty = num(projectDetails?.frequency_penalty, 0)
        }

        if (model_type === "Groq") {
          payload.model = groqModel
          headers.Authorization = `Bearer ${groqApiKey}`
        }

        if (model_type === "Local") {
          payload.modelName = llamaModel
          payload.message = msg
        }

        if (model_type === "Nidum Shared") {
          payload.modelName = sharedDevice?.modelName
          payload.message = msg
        }

        if (model_type === "Hugging Face") {
          payload.model = hfModel
          headers.Authorization = `Bearer ${hfApiKey}`
          headers["x-use-cache"] = "false"
          if (payload.top_p === 0) {
            payload.top_p = 0.1
          }
          if (payload.top_p === 1) {
            payload.top_p = 0.9
          }
        }

        if (model_type === "SambaNova") {
          payload.model = sambaNovaModel
          payload.apiKey = sambaNovaApiKey
        }

        if (model_type === "Anthropic") {
          payload.model = anthropicModel
          headers["x-api-key"] = anthropicApiKey
          headers["anthropic-version"] = "2023-06-01"
          headers["anthropic-dangerous-direct-browser-access"] = true
          payload.system = prompt[0].content
          payload.messages = prompt.slice(1)
        }

        if (model_type === "OpenAI") {
          payload.model = openaiModel
          headers.Authorization = `Bearer ${openaiApiKey}`
        }

        if (model_type === "Ollama") {
          payload.model = ollamaModel
        }

        if (model_type === "Nidum Decentralized") {
          payload.model = nidumDecentralisedModel || nidumCentralised?.models?.[0]?.id
        }

        abortController.current = new AbortController()

        if (model_type === "Nidum Decentralized") {
          const ollama = new Ollama({ host: url })
          const response = await ollama.chat({
            model: payload.model,
            messages: payload.messages,
            stream: true,
            options: {
              temperature: payload?.temperature,
              top_p: payload?.top_p,
              frequency_penalty: payload?.frequency_penalty,
              num_ctx: payload?.max_tokens
            },
          })

          abortController.current = ollama

          let botRes = ""
          for await (const part of response) {
            botRes = botRes + part.message.content || ""

            const botReply: Message = {
              role: "assistant",
              content: botRes,
              id: nanoid(5),
            }

            setTempData(currContextId, prev => prev.map(p => {
              if (p.role === "assistant" || p.role === "loading") {
                return botReply
              }
              return p
            }))
          }

          const finalOutput = [user]
          const botReply: Message = {
            role: "assistant",
            content: botRes,
            id: nanoid(10),
          }
          if (webSearchedData?.length > 0) {
            finalOutput.push({
              id: webSearchId,
              role: "web-searched",
              content: "",
              webSearched: webSearchedData,
            })
          }
          finalOutput.push(botReply)
          resetTemp(currContextId)
          pushIntoMessages(project_id, currContextId, finalOutput)
          if (needAutoPlay) {
            speak(botReply.id, botReply.content)
          }
          return
        }

        const response = await fetch(url, {
          signal: abortController.current.signal,
          method: "POST",
          cache: "no-store",
          body: JSON.stringify(payload),
          headers,
        })

        if (!response.ok) {
          const err = await response.json()
          const errMsg = err?.error?.message || err?.error
          resetTemp(currContextId)
          toast({ title: errMsg || "An error occurred. Please try again." })
          return
        }

        if (["Nidum", "Anthropic", "SambaNova", "Nidum Shared"].includes(model_type)) {
          const res = await response.json()
          const content = res?.choices?.[0]?.message?.content || res?.content?.[0]?.text || res?.message?.content || ""

          const finalOutput = [user]
          const botReply: Message = {
            role: "assistant",
            id: nanoid(10),
            content,
          }
          if (webSearchedData?.length > 0) {
            finalOutput.push({
              id: webSearchId,
              role: "web-searched",
              content: "",
              webSearched: webSearchedData,
            })
          }
          finalOutput.push(botReply)
          resetTemp(currContextId)
          if (model_type === "Nidum Shared") {
            setTimings(basicTokenizer(content))
          }
          pushIntoMessages(project_id, currContextId, finalOutput)
          if (needAutoPlay) {
            speak(botReply.id, botReply.content)
          }

        } else {
          const reader = response.body?.getReader()
          let botRes = ""
          let halfData = ""

          reader?.read().then(function processResult(result: any): any {
            try {
              if (result.done) {
                const finalOutput = [user]
                const botReply: Message = {
                  role: "assistant",
                  content: botRes,
                  id: nanoid(10),
                }
                if (webSearchedData?.length > 0) {
                  finalOutput.push({
                    id: webSearchId,
                    role: "web-searched",
                    content: "",
                    webSearched: webSearchedData,
                  })
                }
                finalOutput.push(botReply)
                resetTemp(currContextId)
                pushIntoMessages(project_id, currContextId, finalOutput)
                if (model_type === "Local") {
                  setTimings(basicTokenizer(botRes))
                }
                if (needAutoPlay) {
                  speak(botReply.id, botReply.content)
                }
                return;
              }

              const decoded = new TextDecoder().decode(result.value)
              const resArr = model_type === "Ollama" ? [decoded] : decoded?.split("data: ")

              if (halfData) {
                resArr[0] = halfData + resArr[0]
                halfData = ""
              }

              for (const res of resArr) {
                if (res && res !== "[DONE]") {
                  if (model_type === "Anthropic" && res.startsWith("event:")) {
                    continue
                  }
                  if (model_type !== "Ollama" && !res.endsWith("}\n\n")) {
                    halfData = res
                    continue
                  }
                  const json = JSON?.parse(res)
                  let text = ""
                  let finishReason = ""

                  if (model_type === "Local") {
                    text = json?.reply || ""
                    finishReason = ""
                  }
                  else if (model_type === "Anthropic") {
                    text = json?.delta?.text || ""
                    finishReason = ""
                  } else if (model_type === "Ollama") {
                    text = json?.message?.content || ""
                    finishReason = ""
                  } else {
                    text = json?.choices?.[0]?.delta?.content || ""
                    finishReason = json?.choices?.[0]?.finish_reason
                  }

                  const hasFinishReason = ["stop", "length"].includes(finishReason)
                  if (json?.error && !text) {
                    resetTemp(currContextId)
                    toast({ title: "Chat limit exceeded. Please start a new chat." })
                    return
                  }
                  botRes += text

                  if (hasFinishReason) {
                    const finalOutput = [user]
                    const botReply: Message = {
                      role: "assistant",
                      content: botRes,
                      id: nanoid(10),
                    }
                    if (webSearchedData?.length > 0) {
                      finalOutput.push({
                        id: webSearchId,
                        role: "web-searched",
                        content: "",
                        webSearched: webSearchedData,
                      })
                    }
                    finalOutput.push(botReply)
                    resetTemp(currContextId)
                    if (model_type === "Local") {
                      setTimings(basicTokenizer(botRes))
                    }
                    pushIntoMessages(project_id, currContextId, finalOutput)
                    if (needAutoPlay) {
                      speak(botReply.id, botReply.content)
                    }
                    return;
                  }

                  const botReply: Message = {
                    role: "assistant",
                    content: botRes,
                    id: nanoid(5),
                  }

                  setTempData(currContextId, prev => prev.map(p => {
                    if (p.role === "assistant" || p.role === "loading") {
                      return botReply
                    }
                    return p
                  }))
                }
              }

              return reader.read().then(processResult)

            } catch (error) { }
          })
        }
      }
    } catch (error) {
      resetTemp(currContextId)
      if (error?.name !== "AbortError") {
        toast({ title: !isOnline ? "Your device is not connected to the internet. Please check your connection." : "An error occurred. Please try again." })
      }
    }
  }

  const stopListening = () => {
    try {
      const currContextId = chat_id || window.location?.hash?.split("/c/")[1]
      abortController?.current?.abort()
      abortController.current = new AbortController()
      pushIntoMessages(project_id, currContextId, tempData.filter(f => f.role !== "loading"))
      resetTemp(currContextId)
    } catch (error) { }
  }

  const sentMessage = () => {
    if (message) {
      if (!chat_id) {
        const hasError = hasAPiKeyError()
        if (hasError) return toast({ title: hasError })

        const temContextId = genMongoId()

        addChat(project_id, {
          id: temContextId,
          title: message,
        })

        navigate(`/p/${project_id}/c/${temContextId}`)
      }

      postData(message)
    }
  }

  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      sentMessage()
    }
  }

  const deleteChat = (msgId: string) => deleteMessage(chat_id, msgId)

  return (
    <>
      <div className="scroll-y px-6 py-2 mt-2">
        {
          tempData?.length === 0 &&
          (!data || data?.length === 0) &&
          <div className="dc h-[calc(100%-3rem)]">
            <img
              className="w-16 opacity-60"
              src={logo}
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
          isOnline && projectDetails?.rag_enabled &&
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
          {
            timings &&
            <div className="absolute bottom-full right-4 text-xs text-zinc-300 bg-background">{timings} tok/sec</div>
          }

          <input
            type="text"
            className="pl-4 pr-10 bg-transparent border-2 rounded-full"
            placeholder={!project_id ? "Please choose a project" : "Message"}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={keyPress}
            disabled={isChatInputDisabled}
          />

          {
            model_mode === "vision" && model_type === "Nidum Decentralized" &&
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

        {isOnline && <ManageResourses />}
      </div>
    </>
  )
}

export default Messages
