import { useNavigate, useParams } from "react-router-dom";

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

function DeleteProject() {
  const closeModel = useUIStore(s => s.close)
  const data = useUIStore(s => s.data)
  const open = useUIStore(s => s.open)

  const deleteProject = useConvoStore(s => s.deleteProject)

  const { project_id = "" } = useParams()
  const navigate = useNavigate()

  function onConfirm() {
    deleteProject(data?.id)
    if (project_id === data?.id) {
      navigate("/")
    }
    closeModel()
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
          >
            Cancel
          </button>

          <button
            className="px-3 py-1.5 text-sm bg-red-400 hover:bg-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteProject
