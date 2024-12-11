
import useUIStore from "../../../../store/ui";

import {
  Dialog,
  DialogContent,
} from "../../../ui/dialog";
import HfModelDownload from "./hf-model-download";

function OpenUrl() {
  const closeModel = useUIStore(s => s.close)
  const data = useUIStore(s => s.data)
  const open = useUIStore(s => s.open)

  const action = data?.split?.("nidum://")?.[1]

  return (
    <Dialog open={open === "open-url"} onOpenChange={closeModel}>
      <DialogContent>
        {
          action?.includes("huggingface") &&
          <HfModelDownload
            id={action?.replace("models/huggingface/", "")}
          />
        }
      </DialogContent>
    </Dialog>
  )
}

export default OpenUrl
