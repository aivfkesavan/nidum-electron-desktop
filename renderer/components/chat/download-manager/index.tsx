import { FiDownload } from "react-icons/fi";
import { useDownloads } from "./provider";

function DownloadManager() {
  const { showAllPendingDownloads } = useDownloads()

  return (
    <button
      className="dc size-8 p-0 shrink-0 text-lg text-white/60 rounded-full cursor-pointer bg-input"
      onClick={showAllPendingDownloads}
    >
      <FiDownload className="animate-pulse" />
    </button>
  )
}

export default DownloadManager
