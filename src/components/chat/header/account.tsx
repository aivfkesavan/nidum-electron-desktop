import { useLogoutMutate } from "../../../hooks/use-user";
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
  const open = useUIStore(s => s.open)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="dc size-6 non-draggable bg-zinc-600 rounded-full"
          disabled={isPending}
        >
          A
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
