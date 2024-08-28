import { createContext, useContext, useState } from "react";
import { toast } from 'sonner';
import axios from "axios";
import { pipeline } from '@xenova/transformers';

import constants from "@utils/constants";

type Downloads = {
  [id: string]: {
    title: string
    progress: number | string
    initiater: string
  }
}

type downloadModelProps = {
  name: string
  initiater: string
  ollamaUrl: string
  onSuccess: () => void
  onError: () => void
}

type downloadWhisperModelProps = {
  model: string
  onSuccess: () => void
  onError: () => void
}

type DownloadContextType = {
  downloads: Downloads
  isDownloading: boolean
  downloadModel: (v: downloadModelProps) => void
  downloadLatestExec: (link: string) => void
  downloadXenovaModels: (v: downloadModelProps) => void
  downloadWhisperModel: (v: downloadWhisperModelProps) => void
}

type props = {
  children: React.ReactNode
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export const useDownloads = (): DownloadContextType => {
  const context = useContext(DownloadContext)
  if (context === undefined) throw new Error('useDownloads must be used within a DownloadProvider')

  return context
}

export function DownloadProvider({ children }: props) {
  const [downloads, setDownloads] = useState<Downloads>({})

  const downloadModel = async ({ ollamaUrl, name, initiater, onSuccess, onError }: downloadModelProps) => {
    try {
      const response = await fetch(`${ollamaUrl}/api/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let shouldBreak = false;

      while (!shouldBreak) {
        const { value, done } = await reader.read()
        if (done) break;

        const chunk = decoder?.decode(value)

        if (chunk) {
          const lines = chunk.split('\n').filter(line => line.trim() !== '')
          for (const line of lines) {
            try {
              const parsed = JSON?.parse(line)
              if (parsed && parsed?.status?.startsWith("pulling")) {
                const perc = Math.round((Number(parsed.completed) / Number(parsed.total)) * 100)
                const title = initiater === "embedder" ? "RAG setup" : name
                toast.loading(title, {
                  className: "py-2",
                  description: `Progress: ${isNaN(perc) ? 0 : perc}%`,
                  richColors: false,
                  position: "top-center",
                  duration: Infinity,
                  id: name,
                })
                setDownloads(p => ({
                  ...p,
                  [name]: {
                    title: name,
                    initiater,
                    progress: isNaN(perc) ? 0 : perc,
                  }
                }))
              }

              if (parsed && parsed?.status === "success") {
                const title = initiater === "embedder" ? "RAG setup" : name
                toast.success(title, {
                  className: "py-2",
                  richColors: true,
                  description: "Downloaded successfully",
                  position: "top-center",
                  duration: 1000,
                  id: name,
                })
                setDownloads(p => {
                  const rest = { ...p }
                  delete rest[name]
                  return rest
                })
                onSuccess?.()
                shouldBreak = true;
                break;
              }
            } catch (error) {
              console.error("Error parsing JSON:", error)
            }
          }
        }
      }

    } catch (err) {
      setDownloads(p => {
        const rest = { ...p }
        delete rest[name]
        return rest
      })
      onError?.()
    }
  }

  async function downloadWhisperModel({ model, onSuccess, onError }: downloadWhisperModelProps) {
    try {
      const response = await fetch(`${constants.backendUrl}/whisper/download`, {
        method: "POST",
        cache: "no-store",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          // console.log("at done")
          toast.success(model, {
            className: "py-2",
            richColors: true,
            description: "Downloaded successfully",
            position: "top-center",
            duration: 1000,
            id: model,
          })
          setDownloads(p => {
            const rest = { ...p }
            delete rest[model]
            return rest
          })
          onSuccess?.()
          break
        }

        const chunk = decoder?.decode(value)
        // console.log("chunk", chunk)
        const lines = chunk?.split('\n\n')
        // console.log("lines", lines)
        lines?.forEach(line => {
          if (line?.startsWith('data: ')) {
            // console.log("line?.slice(6)", line?.slice(6))
            const data = JSON?.parse(line?.slice(6))
            // console.log("data", data)
            if (data) {
              let title = data?.name === "Whisper" ? "Setting up Speech to Text" : data?.name
              toast.loading(title, {
                className: "py-2",
                description: data?.name === "Whisper" ? "" : `Progress: ${data?.progress || 0}%`,
                richColors: false,
                position: "top-center",
                duration: Infinity,
                id: model,
              })
              setDownloads(p => ({
                ...p,
                [model]: {
                  title: data?.name,
                  initiater: "whisper",
                  progress: data?.progress || 0,
                }
              }))
            }
          }
        })
      }

    } catch (error) {
      console.log(error)
      onError?.()
    }
  }

  async function downloadLatestExec(downloadUrl: string) {
    try {
      const response = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          toast.loading("Downloading latest version", {
            className: "py-2",
            description: `Progress: ${percentCompleted || 0}%`,
            richColors: false,
            position: "top-center",
            duration: Infinity,
            id: "latest-v",
          })
        },
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'RAGDrive.dmg')
      document.body.appendChild(link)
      link.click()

      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success("Downloading latest version", {
        className: "py-2",
        richColors: true,
        position: "top-center",
        duration: 1000,
        id: "latest-v",
      })

    } catch (error) {
      console.log(error)
      toast.error("Downloading latest version", {
        description: "Cannot complete download, please try again later",
        className: "py-2",
        richColors: false,
        position: "top-center",
        duration: 1000,
        id: "latest-v",
      })
    }
  }

  async function downloadXenovaModels({ name, initiater, onSuccess, onError }: downloadModelProps) {
    try {
      await pipeline('automatic-speech-recognition', name, {
        progress_callback: (progress: any) => {
          let perc = progress?.progress ? Math.ceil(progress?.progress) : 0
          let txt = progress?.name ? `${progress?.name} ${perc}` : perc
          toast.loading(name, {
            className: "py-2",
            description: `Progress: ${txt}%`,
            richColors: false,
            position: "top-center",
            duration: Infinity,
            id: name,
          })
          setDownloads(p => ({
            ...p,
            [name]: {
              title: name,
              initiater,
              progress: txt,
            }
          }))
        },
      })

      toast.success(name, {
        className: "py-2",
        richColors: true,
        description: "Downloaded successfully",
        position: "top-center",
        duration: 1000,
        id: name,
      })
      setDownloads(p => {
        const rest = { ...p }
        delete rest[name]
        return rest
      })
      onSuccess?.()

    } catch (error) {
      console.error('Error loading model:', error);
      toast.error(`${name} model download failed`, {
        className: "py-2",
        richColors: true,
        description: "Please try again later",
        position: "top-center",
        duration: 1000,
        id: name,
      })
      onError?.()
    }
  }

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        isDownloading: Object.keys(downloads).length > 0,
        downloadModel,
        downloadWhisperModel,
        downloadLatestExec,
        downloadXenovaModels,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}