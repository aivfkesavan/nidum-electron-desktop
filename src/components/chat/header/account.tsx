import { useEffect } from "react";

import { useLogoutMutate } from "../../../hooks/use-user";
import useAuthStore from "../../../store/auth";
import useUIStore from "../../../store/ui";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import Profile from "./profile";

function Account() {
  const { mutate, isPending } = useLogoutMutate()
  const update = useUIStore(s => s.update)
  const close = useUIStore(s => s.close)

  const email = useAuthStore(s => s.email)
  const open = useUIStore(s => s.open)

  useEffect(() => {
    return () => {
      close()
    }
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="dc size-6 non-draggable bg-zinc-600 rounded-full uppercase"
          disabled={isPending}
        >
          {email[0]}
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => update({ open: "profile" })}>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => mutate()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {
        open === "profile" &&
        <Profile />
      }
    </>
  )
}

export default Account
