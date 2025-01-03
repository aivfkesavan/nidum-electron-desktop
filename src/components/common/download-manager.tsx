import { createContext, useContext, useState } from "react";
import { pipeline } from '@huggingface/transformers';
import { toast } from 'sonner';

import { generateImg, generateImgT } from "../../actions/img";
import constants from "../../utils/constants";

type Downloads = {
  [id: string]: {
    title: string
    progress: number | string
    initiater: string
  }
}

type downloadModelProps = {
  name: string
  lable?: string
  initiater: string
  onSuccess: () => void
  onError: () => void
}

type downloadModelProps1 = {
  id: string
  model: string
  lable: string
  fileName: string
  onSuccess: () => void
  onError: () => void
}

type downloadWhisperModelProps = {
  model: string
  onSuccess: () => void
  onError: () => void
}

type GenerateImageType = {
  data: generateImgT
  onSuccess: () => void
  onError: () => void
}

type DownloadContextType = {
  downloads: Downloads
  isDownloading: boolean
  generateImage: (v: GenerateImageType) => void
  downloadModel: (v: downloadModelProps1) => void
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

  const downloadModel = async ({ id, model, fileName, lable, onSuccess, onError }: downloadModelProps1) => {
    try {
      const response = await fetch(`${constants.backendUrl}/llama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, model, fileName })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let oldProgress = 0

      while (true) {
        const { value, done } = await reader?.read() || {}
        if (done) {
          toast.success(lable, {
            className: "py-2",
            richColors: true,
            closeButton: true,
            description: "Downloaded successfully",
            position: "top-center",
            duration: 1000,
            id,
          })
          setDownloads(p => {
            const rest = { ...p }
            delete rest[id]
            return rest
          })
          onSuccess?.()
          break;
        }

        const chunk = decoder?.decode(value)
        const lines = chunk?.split('\n\n')

        lines?.forEach(line => {
          if (line?.startsWith('data: ')) {
            let data = null
            try {
              data = JSON?.parse(line?.slice(6))
            } catch (error) {
              // console.log(error)
            }
            if (data) {
              if (data?.progress > oldProgress) {
                toast.loading(lable, {
                  className: "py-2",
                  description: `Progress: ${data?.progress || 0}%`,
                  richColors: false,
                  position: "top-center",
                  duration: Infinity,
                  id,
                })
                setDownloads(p => ({
                  ...p,
                  [id]: {
                    title: lable,
                    initiater: "llm",
                    progress: data?.progress || 0,
                  }
                }))
                oldProgress = data?.progress
              }
            }
          }
        })
      }

    } catch (err) {
      setDownloads(p => {
        const rest = { ...p }
        delete rest[id]
        return rest
      })
      toast.error(lable, {
        className: "py-2",
        richColors: true,
        description: "Model download failed",
        position: "top-center",
        duration: 1000,
        id,
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

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader?.read() || {}
        if (done) {
          toast.success(model, {
            className: "py-2",
            richColors: true,
            closeButton: true,
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
        const lines = chunk?.split('\n\n')
        lines?.forEach(line => {
          if (line?.startsWith('data: ')) {
            const data = JSON?.parse(line?.slice(6))
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

  async function downloadXenovaModels({ name, initiater, onSuccess, onError }: downloadModelProps) {
    let modelName = name?.replace(/^Xenova\//, '').replace(/\.en$/, '').replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    try {
      await pipeline('automatic-speech-recognition', name, {
        progress_callback: (progress: any) => {
          let perc = progress?.progress ? Math.ceil(progress?.progress) : 0
          let txt = progress?.file ? `${progress?.file} ${perc}` : `${perc}`
          let res = txt?.replace("onnx/", "")
          toast.loading(modelName, {
            className: "py-2",
            description: `Progress: Models ${res}%`,
            descriptionClassName: "text-xs",
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
              progress: perc,
            }
          }))
        },
      })

      toast.success(modelName, {
        className: "py-2",
        richColors: true,
        closeButton: true,
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
      toast.error(`${modelName} model download failed`, {
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

  async function generateImage({ data, onSuccess, onError }: GenerateImageType) {
    try {
      await generateImg(data)
      onSuccess()
    } catch (error) {
      console.log(error)
      onError()
    }
  }

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        isDownloading: Object.keys(downloads).length > 0,
        generateImage,
        downloadModel,
        downloadWhisperModel,
        downloadXenovaModels,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}