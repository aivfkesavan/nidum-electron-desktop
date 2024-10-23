import { GrResources } from "react-icons/gr";

import { Skeleton } from "../../../ui/skeleton";
import { usePreviewLinks } from "../../../../hooks/use-crawler";

import FullLinks from "./full-links";
import LinkCard from "./link-card";

type props = {
  id: string
  urls: string[]
}

function LinkPreview({ urls, id }: props) {
  const { isLoading, data } = usePreviewLinks(id, urls)

  return (
    <div className="grid grid-cols-5 gap-4 ml-9 my-4 relative">
      <div className="dc size-7 absolute top-1 -left-9 border rounded-full">
        <GrResources className=" opacity-50" />
      </div>

      {
        (isLoading || urls?.length === 0) && [1, 2, 3, 4, 5].map(d => (
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
        !isLoading && data &&
        <FullLinks data={data} />
      }
    </div>
  )
}

export default LinkPreview
