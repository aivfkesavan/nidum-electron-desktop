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
      <div className="df text-xs">
        <input
          type="email"
          className="w-full px-2.5 py-2 bg-zinc-700/30"
          placeholder="Invite a friend using email (john@gmail.com)"
          value={emailTo}
          disabled={loading}
          onChange={e => setEmailTo(e.target.value)}
        />
        <button
          className="dc w-16 px-2 py-1.5 bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
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

      {
        invites?.length > 0 &&
        <div className="df flex-wrap mt-4">
          {
            invites?.map((l: string) => (
              <div
                key={l}
                className="df pl-2.5 pr-0.5 py-0.5 text-sm text-zinc-200 bg-zinc-700/50 hover:bg-zinc-700 rounded-full"
              >
                <p className="flex-1">{l}</p>
                <button
                  onClick={() => mutateRemove(l)}
                  disabled={loading}
                  className="p-1 rounded-full hover:bg-red-500"
                >
                  <LuX />
                </button>
              </div>
            ))
          }
        </div>
      }
    </>
  )
}

export default Invite
