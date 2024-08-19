import { IoIosAttach } from "react-icons/io";

import useContextStore from "@/store/context";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Upload from "./upload";
import List from './list';

function FileUpload() {
  const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)
  const embedding_type = useContextStore(s => s.embedding_type)

  const qdrantDBUrl = useContextStore(s => s.qdrantDBUrl)
  const vb_type = useContextStore(s => s.vb_type)

  const project_id = useContextStore(s => s.project_id)

  const { toast } = useToast()

  const isNotValid = !embedding_type || !ollamEmbeddingUrl || !ollamaEmbeddingModel || !vb_type || !qdrantDBUrl

  function onClk() {
    if (!embedding_type || !ollamEmbeddingUrl || !ollamaEmbeddingModel) {
      return toast({ title: "Please check your embedding configurations" })
    }

    if (!vb_type || !qdrantDBUrl) {
      return toast({ title: "Please check your vector database configurations" })
    }
  }

  if (isNotValid) {
    return (
      <button
        className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full bg-secondary cursor-pointer hover:bg-input disabled:cursor-not-allowed"
        onClick={onClk}
      >
        <IoIosAttach className="cursor-[inherit] text-white/60" />
      </button>
    )
  }

  return (
    <Dialog>
      <DialogTrigger
        className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full bg-secondary cursor-pointer hover:bg-input disabled:cursor-not-allowed"
        disabled={!project_id}
      >
        <IoIosAttach className="cursor-[inherit] text-white/60" />
      </DialogTrigger>

      <DialogContent className="md:max-w-3xl lg:max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-2 text-left">
            Manage Files
          </DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className='flex flex-col md:flex-row gap-8'>
            <Upload />
            <List />
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default FileUpload
