
type DownloadStatus = 'downloading' | 'completed'

type DownloadInfo = {
  progress: number
  status: DownloadStatus
}

type Downloads = {
  [id: string]: DownloadInfo
}

type VisibleToasts = {
  [id: string]: boolean
}

type DownloadContextType = {
  downloads: Downloads
  startDownload: (id: string) => void
  showAllPendingDownloads: () => void
}
