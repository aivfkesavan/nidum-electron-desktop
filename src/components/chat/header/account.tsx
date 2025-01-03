import { useEffect } from "react";

import { useLogoutMutate } from "../../../hooks/use-user";
import { useInitDevice } from "../../../hooks/use-device";
import useOnlineStatus from "../../../hooks/use-online-status";
import useAuthStore from "../../../store/auth";
import { useToast } from "../../../hooks/use-toast";
import useUIStore from "../../../store/ui";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

function Account() {
  const { data: device } = useInitDevice()
  const { mutate, isPending } = useLogoutMutate()
  const update = useUIStore(s => s.update)
  const close = useUIStore(s => s.close)
  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  const email = useAuthStore(s => s.email)

  useEffect(() => {
    return () => {
      close()
    }
  }, [])

  function onClk() {
    if (!isOnline) return toast({ title: "Please ensure your device is connected to the internet to proceed." })
    return mutate(device?._id)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="dc size-6 non-draggable bg-zinc-600 rounded-full uppercase"
        disabled={isPending}
      >
        {email[0]}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => update({ open: "download" })}>
          Downloads
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => update({ open: "profile" })}>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onClk}
          disabled={!device?._id}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Account
