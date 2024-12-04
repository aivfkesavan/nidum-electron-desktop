import useOnlineStatus from "../../../hooks/use-online-status";

function OfflineIndicator() {
  const isOnline = useOnlineStatus()

  if (isOnline) return null
  return (
    <span className=" px-4 py-1 text-xs border border-red-400 text-red-100 rounded-full">
      Offline
    </span>
  )
}

export default OfflineIndicator
