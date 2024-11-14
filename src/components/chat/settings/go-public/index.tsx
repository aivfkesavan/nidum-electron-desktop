import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

import { useDeviceInfo, useDeviceMutate, useGoPublicMutate, useStopShareMutate } from "../../../../hooks/use-device";
import { useAddInviteMutate, useInvites, useRemoveInviteMutate } from "../../../../hooks/use-user";
import useDeviceStore from "../../../../store/device";

function GoPublic() {
  const [deviceName, setDeviceName] = useState("")
  const [emailTo, setEmailTo] = useState("")

  const isPublicShared = useDeviceStore(s => s.isPublicShared)

  const { data: device, isLoading: isLoading1 } = useDeviceInfo()
  const { data: invites, isLoading: isLoading2 } = useInvites()

  const { mutate: mutateRemove, isPending: isPending2 } = useRemoveInviteMutate()
  const { mutate: mutateDevice, isPending: isPending3 } = useDeviceMutate()
  const { mutate: mutateAdd, isPending: isPending1 } = useAddInviteMutate()

  const { mutate: mutateGoPublic, isPending: isPending4 } = useGoPublicMutate()
  const { mutate: mutateStop, isPending: isPending5 } = useStopShareMutate()

  useEffect(() => {
    if (device) {
      setDeviceName(device?.name || "")
    }
  }, [device])

  function onBlur(name: string) {
    if (name !== device?.name) {
      mutateDevice({ _id: device?._id, name })
    }
  }

  function onClk() {
    if (!isPublicShared) return mutateGoPublic()
    return mutateStop()
  }

  const loading = isPending1 || isPending2 || isLoading1 || isLoading2 || isPending3 || isPending4 || isPending5

  return (
    <>
      {
        isLoading1 &&
        <div className="text-xs text-center">Checking device status</div>
      }

      <div className="dc mb-8">
        <input
          className="max-w-60 px-3 py-2 text-sm bg-zinc-700/50"
          value={deviceName}
          onChange={e => setDeviceName(e.target.value)}
          onBlur={e => onBlur(e.target.value)}
        />

        <button
          className={`dc w-36 px-4 py-1.5 text-[13px] ${isPublicShared ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
          onClick={onClk}
        >
          {(isPending4 || isPending5) && <span className="loader-2 size-4 border-2"></span>}
          {isPublicShared ? "Stop Sharing" : "Go Public"}
        </button>
      </div>

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

export default GoPublic
