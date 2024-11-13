import { useState } from "react";

import { useAccountDeleteConfirmMutate, useReqAccountDeleteMutate } from "../../../../hooks/use-user";

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
  const [showDelete, setShowDelete] = useState(false)
  const [otp, setOtp] = useState("")

  const { mutate: mutateDelete, isPending: isPending2 } = useAccountDeleteConfirmMutate()
  const { mutate: mutateReq, isPending: isPending1 } = useReqAccountDeleteMutate()

  function onReq() {
    mutateReq(null, {
      onSuccess() {
        setShowDelete(true)
      }
    })
  }

  function onDelete() {
    mutateDelete(Number(otp))
  }

  function onClk(e: any) {
    e?.preventDefault()
    showDelete ? onDelete() : onReq()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="px-3 py-1.5 text-xs border bg-red-400/80 hover:bg-red-400">
        Delete Account
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Are you absolutely sure you want to delete your account?</AlertDialogTitle>

          {
            !showDelete &&
            <AlertDialogDescription className="text-xs text-zinc-400">
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers. You will lose access to all your information and settings.
            </AlertDialogDescription>
          }
        </AlertDialogHeader>

        {
          showDelete &&
          <div className="mb-4">
            <label htmlFor="" className="text-xs font-normal text-zinc-400">Enter OTP to confirm delete</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="px-3 py-1.5 text-sm bg-zinc-700"
            />
          </div>
        }

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            className="px-4 py-2 text-xs font-normal border"
            disabled={isPending1 || isPending2}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="px-4 py-2 text-xs font-normal bg-red-400 hover:bg-red-400/80"
            onClick={onClk}
            disabled={isPending1 || isPending2}
          >
            {showDelete ? "Confirm Delete" : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Delete
