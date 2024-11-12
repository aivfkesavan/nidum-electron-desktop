import { cn } from "../../lib/utils";

type props = {
  className?: string
}

function OllmaStatusCheck({ className = "" }: props) {
  return <span className={cn("block size-1.5 rounded-full bg-green-400", className)}></span>
}

export default OllmaStatusCheck
