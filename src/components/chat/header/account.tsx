import { useEffect } from "react";

import { useLogoutMutate } from "../../../hooks/use-user";
import { useInitDevice } from "../../../hooks/use-device";
import useAuthStore from "../../../store/auth";
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

  const email = useAuthStore(s => s.email)

  useEffect(() => {
    return () => {
      close()
    }
  }, [])

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
          onClick={() => mutate(device?._id)}
          disabled={!device?._id}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Account
