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
  return (
    <AlertDialog>
      <AlertDialogTrigger className="px-3 py-1.5 text-xs border bg-red-400/80 hover:bg-red-400">
        Delete Account
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Are you absolutely sure you want to delete your account?</AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-zinc-400">
            This action cannot be undone. This will permanently delete your account and remove all of your data from our servers. You will lose access to all your information and settings.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="px-4 py-2 text-xs font-normal border">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2 text-xs font-normal bg-red-400 hover:bg-red-400/80"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Delete
