
import { useLogoutMutate } from "../../../hooks/use-user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

function Account() {
  const { mutate, isPending } = useLogoutMutate()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="dc size-6 non-draggable bg-zinc-600 rounded-full"
        disabled={isPending}
      >
        A
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Account
