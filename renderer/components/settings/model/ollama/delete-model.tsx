import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteModel } from "@actions/ollama";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type props = {
  id: string
  closeModel: () => void
}

function DeleteModel({ id, closeModel }: props) {
  const quryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteModel(id),
    onSuccess() {
      quryClient.invalidateQueries({ queryKey: ["ollama-tags"] })
      closeModel()
    },
    onError(err) {
      console.log(err)
    }
  })

  return (
    <Dialog open onOpenChange={closeModel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Model</DialogTitle>
          <DialogDescription className="text-white/60">
            Are you sure you want to delete this model?
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
            onClick={() => mutate()}
            disabled={isPending}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteModel
