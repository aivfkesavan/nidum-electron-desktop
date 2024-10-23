import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../../ui/sheet";

import LinkCard from "./link-card";

type props = {
  data: any[]
}

function FullLinks({ data }: props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="df gap-1 flex-wrap px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800 cursor-pointer">
          {data?.filter((d, i) => i > 4 && !!d?.favicon)?.filter((d, i) => i < 7)?.map((d, i) => (
            <img
              className="size-4 rounded-full"
              src={d?.favicon}
              key={i}
            />
          ))}

          <span className="w-full flex-1 text-[10px] opacity-60">View all sourses</span>
        </div>
      </SheetTrigger>

      <SheetContent className="dfc p-4">
        <SheetHeader>
          <SheetTitle>{data?.length} Sources</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        <div className="scroll-y pr-4 -mr-4 space-y-4">
          {
            data?.map((d: any) => (
              <LinkCard
                key={d.url}
                isBig
                {...d}
              />
            ))
          }
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FullLinks
