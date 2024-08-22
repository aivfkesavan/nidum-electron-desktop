import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'sonner';

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export const useDownloads = (): DownloadContextType => {
  const context = useContext(DownloadContext)
  if (context === undefined) throw new Error('useDownloads must be used within a DownloadProvider')

  return context
}

type props = {
  children: React.ReactNode
}

const simulateDownload = (id: string, onProgress: (id: string, progress: number) => void): Promise<void> => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve();
      }
      onProgress(id, Math.min(progress, 100));
    }, 500);
  });
};

export function DownloadProvider({ children }: props) {
  const [visibleToasts, setVisibleToasts] = useState<VisibleToasts>({})
  const [downloads, setDownloads] = useState<Downloads>({})

  const startDownload = (id: string) => {
    setDownloads(prev => ({ ...prev, [id]: { progress: 0, status: 'downloading' } }))
    setVisibleToasts(prev => ({ ...prev, [id]: true }))
    simulateDownload(id, updateProgress).then(() => {
      setDownloads(prev => ({ ...prev, [id]: { ...prev[id], status: 'completed' } }));
    })
  }

  const updateProgress = (id: string, progress: number) => {
    setDownloads(prev => ({ ...prev, [id]: { ...prev[id], progress } }))
  }

  const showAllPendingDownloads = () => {
    Object.entries(downloads).forEach(([id, { status }]) => {
      if (status === 'downloading') {
        setVisibleToasts(prev => ({ ...prev, [id]: true }))
      }
    })
  }

  useEffect(() => {
    Object.entries(downloads).forEach(([id, { progress, status }]) => {
      if (status === 'downloading' && visibleToasts[id]) {
        toast.success(`Downloading ${id}`, {
          description: `Progress: ${progress.toFixed(0)}%`,
          duration: Infinity,
          id: `download-${id}`,
          onDismiss: () => setVisibleToasts(prev => ({ ...prev, [id]: false })),
        })
      } else if (status === 'completed') {
        toast.success(`${id} downloaded successfully`, {
          id: `download-${id}`,
        })
        setVisibleToasts(prev => ({ ...prev, [id]: false }))
      }
    })
  }, [downloads, visibleToasts])

  return (
    <DownloadContext.Provider
      value={{
        downloads,
        startDownload,
        showAllPendingDownloads,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}