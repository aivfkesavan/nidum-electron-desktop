import useSystemPrompt from "./use-system-prompt";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type props = {
  closeModel: () => void
}

function Model({ closeModel }: props) {
  const { systemPrompt, onChange } = useSystemPrompt()

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
              value={systemPrompt}
              onChange={e => onChange(e.target.value)}
            ></textarea>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default Model