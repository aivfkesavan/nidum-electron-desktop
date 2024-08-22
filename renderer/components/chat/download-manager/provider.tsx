import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'sonner';

type Downloads = {
  [id: string]: {
    title: string
    progress: number
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

type DownloadContextType = {
  downloads: Downloads
  isDownloading: boolean
  downloadModel: (v: downloadModelProps) => void
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

      while (true) {
        const { value } = await reader.read()
        const chunk = decoder?.decode(value)

        if (chunk) {
          const parsed = JSON?.parse(chunk)
          if (parsed && parsed.status?.startsWith("pulling")) {
            const perc = Math.round((Number(parsed.completed) / Number(parsed.total)) * 100)
            const title = initiater === "embedder" ? "RAG setup" : name
            toast.loading(title, {
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
              closeButton: true,
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
            break
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

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        isDownloading: Object.keys(downloads).length > 0,
        downloadModel,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}