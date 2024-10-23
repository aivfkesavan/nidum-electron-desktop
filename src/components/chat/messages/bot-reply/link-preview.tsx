import { Skeleton } from "../../../ui/skeleton";
import { usePreviewLinks } from "../../../../hooks/use-crawler";

type props = {
  url: string
}

function LinkPreview({ url }: props) {
  const { isLoading, data: metadata } = usePreviewLinks(url)

  const hasData = isLoading ? true : Object.values(metadata).filter(Boolean).length > 0

  if (isLoading) {
    return <Skeleton className="h-28 rounded-md bg-zinc-800" />
  }

  if (!hasData) {
    return (
      <div className="px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800">
        <div className="flex-1 leading-4 line-clamp-2 opacity-55">Cannot preview informations</div>

        <div className="df gap-1">
          <span className="size-4 bg-gray-700 rounded-full"></span>
          <span className="flex-1 truncate">{url}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="dfc gap-1 px-2.5 py-1.5 text-[11px] rounded-md bg-zinc-800">
      <div className="flex-1 leading-4 line-clamp-2 opacity-90">{metadata?.title}</div>
      <div className="df gap-1">
        <img
          className="size-4 rounded-full"
          src={metadata?.favicon}
        />
        <p className="flex-1 truncate">{metadata?.siteName}</p>
      </div>
    </div>
  )
}

export default LinkPreview
