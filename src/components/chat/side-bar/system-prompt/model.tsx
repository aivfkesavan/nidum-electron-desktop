import useSystemPrompt from "./use-system-prompt";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";

type props = {
  closeModel: () => void
}

function Model({ closeModel }: props) {
  const { prompt, isDisabled, onChange, onSave } = useSystemPrompt()

  return (
    <Dialog open onOpenChange={closeModel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            System Prompt
          </DialogTitle>

          <DialogDescription>
            <textarea
              className="min-h-40 p-2 mb-2 text-[13px] bg-input/60 resize-none"
              value={prompt}
              onChange={e => onChange(e.target.value)}
              disabled={isDisabled}
            ></textarea>
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
            disabled={isDisabled}
            onClick={onSave}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Model
