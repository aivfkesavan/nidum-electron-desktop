import { cn } from "../../lib/utils";

type props = {
  className?: string
  isOnline?: boolean
}

function OnlineStatus({ className = "", isOnline = true }: props) {
  return <span className={cn("block size-1.5 rounded-full", className, {
    "bg-green-400": isOnline,
    "bg-red-400": !isOnline,
  })}></span>
}

export default OnlineStatus
