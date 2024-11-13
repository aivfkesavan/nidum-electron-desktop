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
import { Label } from "../../../ui/label";

function Reset() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="px-3 py-1.5 text-xs border bg-red-400/80 hover:bg-red-400">
        Reset App
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Are you sure you want to reset the app?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400">
            This action will clear all your app data and settings.
            This action cannot be undone, and you will lose all your saved informations.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <div className="df mr-auto">
            <input
              type="checkbox"
              id="delete-models"
              className="w-fit"
            />
            <Label htmlFor="delete-models" className=" text-xs font-normal text-zinc-300">
              Delete downloaded models
            </Label>
          </div>
          <AlertDialogCancel className="px-4 py-2 text-xs font-normal border">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2 text-xs font-normal bg-red-400 hover:bg-red-400/80"
          >
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Reset
