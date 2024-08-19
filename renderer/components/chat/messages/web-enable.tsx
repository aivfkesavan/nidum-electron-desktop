import useContextStore from "@/store/context";

// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch";

function WebEnable() {
  const webEnabled = useContextStore(s => s.webEnabled)
  const updateContext = useContextStore(s => s.updateContext)

  return (
    <>
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Switch
              checked={webEnabled}
              onCheckedChange={val => updateContext({ webEnabled: val })}
            />
          </TooltipTrigger>

          <TooltipContent>
            <p>Enable web search</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      <Switch
        checked={webEnabled}
        onCheckedChange={val => updateContext({ webEnabled: val })}
        title="Enable web search"
      />
    </>
  )
}

export default WebEnable
