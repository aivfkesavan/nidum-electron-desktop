import { useMutation } from "@tanstack/react-query";

import useAuthStore from "../../../store/auth";
import { logout } from "../../../actions/user";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

function Account() {
  const clearAuth = useAuthStore(s => s.clear)

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess() {
      clearAuth()
    }
  })

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
