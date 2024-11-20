
import { useProjectDeleteMutate } from "../../../hooks/use-project";
import useContextStore from "../../../store/context";
import useUIStore from "../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";

function DeleteProject() {
  const closeModel = useUIStore(s => s.close)
  const data = useUIStore(s => s.data)
  const open = useUIStore(s => s.open)

  const { mutate, isPending } = useProjectDeleteMutate()

  const updateContext = useContextStore(s => s.updateContext)
  const project_id = useContextStore(s => s.project_id)

  function onConfirm() {
    mutate(data?._id, {
      onSuccess() {
        if (project_id === data?._id) {
          updateContext({ project_id: "", chat_id: "" })
        }
        closeModel()
      }
    })
  }

  return (
    <Dialog open={open === "delete-project"} onOpenChange={closeModel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to delete this project?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <button
            className="px-3 py-1.5 text-sm bg-input hover:bg-input/70"
            onClick={closeModel}
            disabled={isPending}
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
            onClick={onConfirm}
            disabled={isPending}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProject
