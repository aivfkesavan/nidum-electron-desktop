import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";

type props = {
  to: string
  icon: any
  title: string
  pathname: string
  disabled: boolean
  onClk: (v: string) => void
}

function Btn({ title, to, icon, disabled, pathname, onClk }: props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => onClk(to)}
          className={`p-2 ${pathname === to ? "bg-primary-lighter/10 text-primary" : " hover:bg-primary-lighter/10"}`}
          disabled={disabled}
        >
          {icon}
        </TooltipTrigger>

        <TooltipContent side="right">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Btn