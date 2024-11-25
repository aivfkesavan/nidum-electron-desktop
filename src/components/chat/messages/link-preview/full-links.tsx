import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../ui/sheet";

import LinkCard from "./link-card";

type props = {
  urls: string[]
}

function FullLinks({ urls }: props) {
  const [open, setOpen] = useState(false)

  const updateOpen = () => setOpen(p => !p)

  return (
    <Sheet open={open} onOpenChange={updateOpen}>
      <SheetTrigger className="dfc justify-end w-full px-2.5 py-1.5 text-[11px] text-zinc-200 rounded-md bg-zinc-800">
        View all sources
      </SheetTrigger>

      <SheetContent className="dfc p-4">
        <SheetHeader>
          <SheetTitle>{urls?.length} Sources</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="scroll-y pr-4 -mr-4 space-y-4">
          {
            open && urls?.map(d => (
              <LinkCard
                key={d}
                url={d}
                isBig
              />
            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FullLinks
