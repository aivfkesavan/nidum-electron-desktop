import { useState } from "react";

import { useResetApp } from "../../../../hooks/use-user";
import useOnlineStatus from "../../../../hooks/use-online-status";
import useDeviceStore from "../../../../store/device";
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
// import { Label } from "../../../ui/label";

function Reset() {
  // const [incxludeModels, setIncludeModels] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { mutate, isPending } = useResetApp(true)
  const deviceId = useDeviceStore(s => s.deviceId)
  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  function onReset(e: any) {
    e?.preventDefault()
    if (!isOnline) return toast({ title: "Kindly ensure an internet connection to continue." })
    if (!showConfirm) return setShowConfirm(true)
    mutate({ includeModels: true, deviceId })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="px-3 py-1.5 text-xs border bg-red-400/80 hover:bg-red-400">
        Reset App
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">App Reset Confirmation</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400">
            All app data and settings will be deleted. This action is irreversible, and all saved information will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          {/* <div className="df mr-auto">
            <input
              type="checkbox"
              id="delete-models"
              className="w-fit"
              checked={incxludeModels}
              onChange={() => setIncludeModels(p => !p)}
            />
            <Label htmlFor="delete-models" className=" text-xs font-normal text-zinc-300">
              Delete downloaded models
            </Label>
          </div> */}

          <AlertDialogCancel
            className="px-4 py-2 text-xs font-normal border"
            disabled={isPending}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            className="px-4 py-2 text-xs font-normal bg-red-400 hover:bg-red-400/80"
            disabled={isPending}
            onClick={onReset}
          >
            {showConfirm ? "Confirm" : "Reset"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Reset
