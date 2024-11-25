import useContextStore from "../../../store/context";
import useConvoStore from "../../../store/conversations";
import useUIStore from "../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";

function DeleteChat() {
  const closeModel = useUIStore(s => s.close)
  const data = useUIStore(s => s.data)
  const open = useUIStore(s => s.open)

  const updateContext = useContextStore(s => s.updateContext)
  const deleteChat = useConvoStore(s => s.deleteChat)

  const project_id = useContextStore(s => s.project_id)
  const chat_id = useContextStore(s => s.chat_id)

  function onConfirm() {
    deleteChat(project_id, data?.id)
    if (chat_id === data?.id) {
      updateContext({ chat_id: "" })
    }
    closeModel()
  }

  return (
    <Dialog open={open === "delete-chat"} onOpenChange={closeModel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Chat</DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to delete this chat?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            onClick={closeModel}
            className="px-3 py-1.5 text-sm bg-input hover:bg-input/70"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChat
