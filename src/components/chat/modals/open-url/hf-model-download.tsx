import { useQueryClient } from "@tanstack/react-query";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaCheck } from "react-icons/fa";

import { useHFModel, useHFModelTree, useLLamaDownloadedModels, useUploadHFModel } from "../../../../hooks/use-llm-models";
import { useDownloads } from "../../../common/download-manager";
import { bytesToSize, generateNumberArray } from "../../../../utils";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { Skeleton } from "../../../ui/skeleton";

type props = {
  id: string
}

function HfModelDownload({ id }: props) {
  const { data: details, isLoading: isLoading1 } = useHFModel(id)
  const { data: files, isLoading: isLoading2 } = useHFModelTree(id)
  const { data: downloaded } = useLLamaDownloadedModels("downloaded")
  const { downloads, downloadModel } = useDownloads()

  const { mutate } = useUploadHFModel()
  const queryClient = useQueryClient()
  console.log(details)
  console.log(files)
  function download(f: any) {
    const base = id?.replaceAll("/", "_") + f?.path
    const link = `https://huggingface.co/${id}/resolve/main/${f?.path}`

    mutate(
      {
        id: base?.replace(".gguf", ""),
        fileName: base,
        name: `${id}/${f?.path?.replace(".gguf", "")}`,
        description: "No description found",
        size: bytesToSize(f?.size),
        download_link: link
      },
      {
        onSuccess() {
          downloadModel({
            id: base?.replace(".gguf", ""),
            model: link,
            lable: f?.path,
            fileName: base,
            onSuccess() {
              queryClient.invalidateQueries({ queryKey: ["llama-models-downloaded"] })
            },
            onError() { },
          })
        }
      }
    )
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className=" line-clamp-2 leading-6">
          Model: {isLoading1 ? "Details Loading..." : details?.id}
        </DialogTitle>

        <DialogDescription>
          Author: {isLoading1 ? "Loading..." : details?.author}
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-80 -mr-6 pr-6 overflow-y-auto">
        {
          isLoading2 &&
          generateNumberArray(5).map(d => (
            <Skeleton key={d} className="h-14 mb-3" />
          ))
        }
        {
          !isLoading2 && files
            ?.filter(file => file?.path?.endsWith(".gguf"))
            ?.map(file => (
              <div className="df px-3 py-2 mb-3 border rounded border-zinc-600" key={file.path}>
                <div className="flex-1">
                  <p className="text-xs line-clamp-2 text-zinc-100">{file?.path}</p>
                  <p className=" text-xs text-zinc-400">Size: {bytesToSize(file?.size)}</p>
                </div>

                {
                  downloaded?.some((d: any) => d?.id === id?.replaceAll("/", "_") + file?.path?.replace(".gguf", ""))
                    ? (
                      <button className="p-0.5 text-sm">
                        <FaCheck />
                      </button>
                    ) :
                    downloads[id?.replaceAll("/", "_") + file?.path?.replace(".gguf", "")] ?
                      <p className="shrink-0 text-[11px] text-white/70">
                        {downloads[id?.replaceAll("/", "_") + file?.path?.replace(".gguf", "")]?.progress}%
                      </p>
                      :
                      <button
                        className="-mt-1 -mr-1 p-0.5 text-base hover:bg-input"
                        onClick={() => download(file)}
                      >
                        <MdOutlineFileDownload />
                      </button>
                }
              </div>
            ))
        }
      </div>
    </>
  )
}

export default HfModelDownload
