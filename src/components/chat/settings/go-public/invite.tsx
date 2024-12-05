import { useState } from "react";
import { LuX } from "react-icons/lu";

import { useAddInviteMutate, useInvites, useRemoveInviteMutate } from "../../../../hooks/use-user";

function Invite() {
  const [emailTo, setEmailTo] = useState("")

  const { data: invites, isLoading } = useInvites()

  const { mutate: mutateRemove, isPending: isPending2 } = useRemoveInviteMutate()
  const { mutate: mutateAdd, isPending: isPending1 } = useAddInviteMutate()

  const loading = isLoading || isPending1 || isPending2

  return (
    <>
      <div className="dc text-xs">
        <p className="shrink-0">Invite a friend</p>
        <input
          type="email"
          className="w-full max-w-[280px] px-2.5 py-1.5 bg-zinc-700/30"
          placeholder="john@gmail.com"
          value={emailTo}
          disabled={loading}
          onChange={e => setEmailTo(e.target.value)}
        />
        <button
          className="dc w-16 px-2 py-1 bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
          disabled={!emailTo || loading}
          onClick={() => {
            mutateAdd(emailTo, {
              onSettled() {
                setEmailTo("")
              }
            })
          }}
        >
          {isPending1 && <span className="loader-2 size-3 shrink-0 border-2 border-zinc-800"></span>}
          Invite
        </button>
      </div>

      <div className="max-w-md mt-8 w-full mx-auto">
        {
          invites?.map((l: string) => (
            <div
              key={l}
              className="df pl-2 mb-1 text-sm hover:bg-zinc-700/50 rounded-sm"
            >
              <p className="flex-1">{l}</p>
              <button
                onClick={() => mutateRemove(l)}
                disabled={loading}
                className="p-1 hover:bg-red-500"
              >
                <LuX />
              </button>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Invite
