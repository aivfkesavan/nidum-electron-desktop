import { IoIosAttach } from "react-icons/io";

import useContextStore from "../../../../store/context";
// import { useToast } from "../../../../components/ui/use-toast";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import Documents from "./documents";
// import WebCrawlers from "./web-crawlers";

function FileUpload() {
  // const ollamaEmbeddingModel = useContextStore(s => s.ollamaEmbeddingModel)
  // const ollamEmbeddingUrl = useContextStore(s => s.ollamEmbeddingUrl)
  // const embedding_type = useContextStore(s => s.embedding_type)

  // const qdrantDBUrl = useContextStore(s => s.qdrantDBUrl)
  // const vb_type = useContextStore(s => s.vb_type)

  const project_id = useContextStore(s => s.project_id)

  // const { toast } = useToast()

  // const isNotValid = !embedding_type || !ollamEmbeddingUrl || !ollamaEmbeddingModel  // || !vb_type || !qdrantDBUrl

  // function onClk() {
  //   if (!embedding_type || !ollamEmbeddingUrl || !ollamaEmbeddingModel) {
  //     return toast({ title: "Please check your embedding configurations" })
  //   }

  //   // if (!vb_type || !qdrantDBUrl) {
  //   //   return toast({ title: "Please check your vector database configurations" })
  //   // }
  // }

  // if (isNotValid) {
  //   return (
  //     <button
  //       className="dc w-8 h-8 p-0 shrink-0 text-xl rounded-full bg-secondary cursor-pointer hover:bg-input disabled:cursor-not-allowed"
  //       onClick={onClk}
  //     >
  //       <IoIosAttach className="cursor-[inherit] text-white/60" />
  //     </button>
  //   )
  // }

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
          <DialogTitle className="text-left">
            Manage Resources
          </DialogTitle>
          {/* <DialogDescription className=" text-xs text-white/60">Manage documents and web crawlers</DialogDescription> */}
        </DialogHeader>

        <Documents />

        {/* <Tabs defaultValue="Web Crawlers">
          <TabsList className="p-0 h-auto mb-8 bg-transparent">
            {
              ["Documents", "Web Crawlers"].map(l => (
                <TabsTrigger
                  className="m-0 text-white/60 bg-transparent border-b-2 border-transparent rounded-none hover:text-white/80 data-[state=active]:border-white"
                  value={l}
                  key={l}
                >
                  {l}
                </TabsTrigger>
              ))
            }
          </TabsList>

          <TabsContent value="Documents">
            <Documents />
          </TabsContent>

          <TabsContent value="Web Crawlers">
            <WebCrawlers />
          </TabsContent>
        </Tabs> */}
      </DialogContent>
    </Dialog>
  )
}

export default FileUpload
