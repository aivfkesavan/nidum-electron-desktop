import { useGoogleLoginMutate } from "../../hooks/use-user";
import { cn } from "../../lib/utils";

type props = {
  className?: string
}

function GoogleBtn({ className }: props) {
  const { mutate, isPending } = useGoogleLoginMutate()

  return (
    <button
      type='button'
      onClick={() => mutate()}
      disabled={isPending}
      className={cn("w-full mt-4 py-1.5 text-sm text-zinc-400 border border-zinc-600 hover:bg-zinc-800 disabled:opacity-50", className)}
    >
      Sign in with Google
    </button>
  )
}

export default GoogleBtn
