
import { useAccountDeleteConfirmMutate } from "../../../../hooks/use-user";
import useOnlineStatus from "../../../../hooks/use-online-status";
import { useToast } from "../../../../hooks/use-toast";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../ui/alert-dialog";

function Delete() {
  const { mutate: mutateDelete, isPending: isPending2 } = useAccountDeleteConfirmMutate()

  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  function onClk(e: any) {
    e?.preventDefault()
    if (!isOnline) return toast({ title: "Please ensure your device is connected to the internet to proceed." })
    mutateDelete()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="shrink-0 px-3 py-1.5 text-xs border bg-red-400/80 hover:bg-red-400">
        Delete Account
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Account Deletion Confirmation</AlertDialogTitle>

          <AlertDialogDescription className="text-xs text-zinc-400">
            This action will permanently delete your account and remove all data from our servers. All your information and access will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="px-4 py-2 text-xs font-normal border"
            disabled={isPending2}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="px-4 py-2 text-xs font-normal bg-red-400 hover:bg-red-400/80"
            onClick={onClk}
            disabled={isPending2}
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Delete
