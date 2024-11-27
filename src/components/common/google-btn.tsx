import { FaGoogle } from "react-icons/fa";

import { useGoogleAuthMutate } from "../../hooks/use-user";
import { cn } from "../../lib/utils";

type props = {
  className?: string
}

function GoogleAuthBtn({ className }: props) {
  const { mutate, isPending } = useGoogleAuthMutate()

  return (
    <button
      type='button'
      onClick={() => mutate()}
      disabled={isPending}
      className={cn("dc w-full mt-4 py-1.5 text-sm text-zinc-300 border border-zinc-600 hover:bg-zinc-800 disabled:opacity-50", className)}
    >
      <FaGoogle />
      Continue with Google
    </button>
  )
}

export default GoogleAuthBtn