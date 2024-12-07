import { useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

import { useNidumChainSetupRetry } from "../../../../hooks/use-device";
import { useToast } from "../../../../hooks/use-toast";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../ui/accordion";

function Configurations() {
  const [val, setVal] = useState("")

  const { mutate, isPending } = useNidumChainSetupRetry()
  const { toast } = useToast()

  const handleRetry = () => mutate(null, {
    onSuccess() {
      toast({ title: "Configurations have been updated successfully" })
      setVal("")
      setTimeout(() => {
        const el = document.querySelector("#settings-cont")
        if (el) {
          el.scrollTop = 0
        }
      }, 20)
    }
  })

  function scrollDown() {
    setVal(p => p === "" ? "1" : "")
    setTimeout(() => {
      const el = document.querySelector("#settings-cont")
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }, 200)
  }

  return (
    <Accordion value={val} type="single" collapsible>
      <AccordionItem value="1" className="p-6 m-4 mt-8 rounded-lg border shadow shadow-zinc-800">
        <AccordionTrigger
          className="p-0 text-sm text-zinc-400 font-medium hover:text-zinc-300 hover:no-underline [&>svg]:rotate-180 [&[data-state=open]>svg]:rotate-0"
          onClick={scrollDown}
        >
          Troubleshoot Nidum Network Issues
        </AccordionTrigger>

        <AccordionContent>
          <ol className="text-xs text-zinc-200">
            <li className="pl-4 pb-2 pt-4">1. Confirm your internet connection is working properly.</li>
            <li className="pl-4 pb-2">2. Make sure you are using the latest version of the Nidum client.</li>
            <li className="pl-4 pb-2">3. Check that your firewall settings are not blocking the Nidum network.</li>
            <li className="pl-4 pb-2">4. Click the "Reconfigure" button below.</li>
            <li className="pl-4 pb-2">5. Close the app after reconfiguring, and then click "Go Public."</li>
            <li className="pl-4 pb-2">6. If the issue persists, contact Nidum support at <a href="mailto:info@nidum.ai">info@nidum.ai</a> for assistance.</li>
          </ol>

          <button
            className="dc mx-auto px-4 py-1.5 text-xs rounded-full bg-zinc-700 text-white hover:bg-zinc-700/50 relative group"
            onClick={handleRetry}
            disabled={isPending}
          >
            <LuRefreshCw className={isPending ? "animate-spin" : ""} />
            {isPending ? "Updating..." : "Re-configure"}
          </button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default Configurations
