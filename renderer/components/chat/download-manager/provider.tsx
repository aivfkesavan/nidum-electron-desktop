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
  ollamaUrl: string
  onSuccess: () => void
  onError: () => void
}

type DownloadContextType = {
  downloads: Downloads
  isDownloading: boolean
  downloadModel: (v: downloadModelProps) => void
  startDownload: (id: string) => void
  showAllPendingDownloads: () => void
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
  // const [visibleToasts, setVisibleToasts] = useState<VisibleToasts>({})
  const [downloads, setDownloads] = useState<Downloads>({})

  const downloadModel = async ({ ollamaUrl, name, onSuccess, onError }: downloadModelProps) => {
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
            // setData(isNaN(perc) ? 0 : perc)
          }

          if (parsed && parsed.status === "success") {
            onSuccess?.()
            // queryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
            // toast({ title: "Dowload completed" })
            // updateContext({ is_downloading: false, name: "" })
            break
          }
        }
      }

    } catch (err) {
      onError?.()
      // setData(0)
      // updateContext({ is_downloading: false, name: "" })
    }
  }

  const startDownload = (id: string) => {
    // setDownloads(prev => ({ ...prev, [id]: { progress: 0, status: 'downloading' } }))
    // setVisibleToasts(prev => ({ ...prev, [id]: true }))
  }

  const updateProgress = (id: string, progress: number) => {
    // setDownloads(prev => ({ ...prev, [id]: { ...prev[id], progress } }))
  }

  const showAllPendingDownloads = () => {
    // Object.entries(downloads).forEach(([id, { status }]) => {
    //   if (status === 'downloading') {
    //     setVisibleToasts(prev => ({ ...prev, [id]: true }))
    //   }
    // })
  }

  // useEffect(() => {
  //   Object.entries(downloads).forEach(([id, { progress, status }]) => {
  //     if (status === 'downloading' && visibleToasts[id]) {
  //       toast.success(`Downloading ${id}`, {
  //         description: `Progress: ${progress.toFixed(0)}%`,
  //         duration: Infinity,
  //         id: `download-${id}`,
  //         onDismiss: () => setVisibleToasts(prev => ({ ...prev, [id]: false })),
  //       })
  //     } else if (status === 'completed') {
  //       toast.success(`${id} downloaded successfully`, {
  //         id: `download-${id}`,
  //       })
  //       setVisibleToasts(prev => ({ ...prev, [id]: false }))
  //     }
  //   })
  // }, [downloads, visibleToasts])

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        isDownloading: Object.keys(downloads).length > 0,
        downloadModel,
        startDownload,
        showAllPendingDownloads,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}