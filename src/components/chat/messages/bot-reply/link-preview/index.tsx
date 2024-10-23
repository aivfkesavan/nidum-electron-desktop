import { Skeleton } from "../../../../ui/skeleton";
import { usePreviewLinks } from "../../../../../hooks/use-crawler";
import LinkCard from "./link-card";
import FullLinks from "./full-links";

type props = {
  id: string
  urls: string[]
}

function LinkPreview({ urls, id }: props) {
  const { isLoading, data } = usePreviewLinks(id, urls)

  return (
    <div className="grid grid-cols-5 gap-4 ml-8 mt-4">
      {
        isLoading && [1, 2, 3, 4, 5].map(d => (
          <Skeleton
            key={d}
            className="h-16 rounded-md bg-zinc-800"
          />
        ))
      }

      {
        !isLoading && data?.filter((_: any, i: number) => i < 4)?.map((d: any) => (
          <LinkCard key={d.url} {...d} />
        ))
      }

      {
        !isLoading &&
        <FullLinks data={data} />
      }
    </div>
  )
}

export default LinkPreview
