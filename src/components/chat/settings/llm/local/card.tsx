import { MdInfoOutline, MdOutlineDeleteOutline, MdOutlineFileDownload } from "react-icons/md";

import { RadioGroupItem } from "../../../../ui/radio-group";
import { Label } from "../../../../ui/label";

type props = {
  name: string
  fileName: string
  info_url?: string
  size: string
  category: string
  description: string
  isDownloaded: boolean
  progress?: any
  updateModel: (v: string) => void
  onDownload: () => void
}

function Card({
  name, fileName, info_url, size, category,
  description, progress, isDownloaded,
  onDownload, updateModel
}: props) {
  return (
    <div className="p-4 mb-2 text-xs border rounded-md">
      <div className="df mb-2">
        <RadioGroupItem value={fileName} id={fileName} />

        <Label htmlFor={fileName} className="cursor-pointer line-clamp-1">
          {name}
        </Label>

        {
          info_url &&
          <a href={info_url} target="_blank" className="mr-auto hover:text-blue-300">
            <MdInfoOutline />
          </a>
        }

        {
          isDownloaded
            ? (
              <button
                className="-mt-1 -mr-1 ml-auto p-0.5 text-base hover:bg-input"
                onClick={() => updateModel(fileName)}
              >
                <MdOutlineDeleteOutline />
              </button>
            ) :
            progress ?
              <p className="shrink-0 ml-auto text-[11px] text-white/70">
                {progress}%
              </p>
              :
              <button
                className="-mt-1 -mr-1 ml-auto p-0.5 text-base hover:bg-input"
                onClick={onDownload}
              >
                <MdOutlineFileDownload />
              </button>
        }
      </div>

      <div className="text-[10px] text-white/80">
        <div className="df justify-between my-1.5">
          <p>Size: {size}</p>

          <p className="w-fit px-2 py-0.5 rounded-full bg-input capitalize">{category}</p>
        </div>

        <div className="text-[11px] text-white/60 line-clamp-2">
          {description}
        </div>
      </div>
    </div>
  )
}

export default Card
