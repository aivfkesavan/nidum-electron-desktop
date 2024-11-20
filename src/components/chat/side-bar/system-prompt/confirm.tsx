import useUIStore from "../../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

type props = {
  onSave: () => void
}

function Confirm({ onSave }: props) {
  const closeModel = useUIStore(s => s.close)

  return (
    <Dialog open onOpenChange={closeModel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            System Prompt
          </DialogTitle>

          <DialogDescription>
            Do you want save changes?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            onClick={closeModel}
            className="w-20 py-1.5 text-[13px] text-white/70 border hover:text-white bg-input"
          >
            Cancel
          </button>

          <button
            className="w-20 py-1.5 text-[13px] bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            onClick={onSave}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Confirm
