import { useEffect, useState } from "react";

import { useInitDevice, useDeviceMutate, useGoPublicMutate, useStopShareMutate, usePublicShareCheck } from "../../../../hooks/use-device";
import useOnlineStatus from "../../../../hooks/use-online-status";
import useContextStore from "../../../../store/context";
import useDeviceStore from "../../../../store/device";
import { useToast } from "../../../../hooks/use-toast";
import useAuthStore from "../../../../store/auth";

function Main() {
  const [deviceName, setDeviceName] = useState("")

  const user_id = useAuthStore(s => s._id)

  const isNidumSharedPublic = useDeviceStore(s => s.isNidumSharedPublic)
  const model_type = useContextStore(s => s?.data?.[user_id]?.model_type)
  const llamModel = useContextStore(s => s?.data?.[user_id]?.llamaModel)

  const isOnline = useOnlineStatus()
  const { toast } = useToast()

  const { data: device, isLoading: isLoading1 } = useInitDevice()

  const { mutate: mutateDevice, isPending: isPending3 } = useDeviceMutate()

  const { mutate: mutateGoPublic, isPending: isPending4 } = useGoPublicMutate()
  const { mutate: mutateStop, isPending: isPending5 } = useStopShareMutate()

  usePublicShareCheck()

  useEffect(() => {
    if (device) {
      setDeviceName(device?.name || "")
    }
  }, [device])

  useEffect(() => {
    if (device && llamModel && llamModel !== device?.modelName) {
      mutateDevice({
        _id: device?._id,
        modelName: llamModel,
      })
    }
  }, [llamModel, device])

  function onBlur(name: string) {
    if (name !== device?.name) {
      mutateDevice({ _id: device?._id, name })
    }
  }

  function onClk() {
    if (!isNidumSharedPublic) {
      if (model_type !== "Local") return toast({ title: "Choose Local AI server to go public" })
      if (!llamModel) return toast({ title: "Please choose a model to go public" })
      if (!isOnline) return toast({ title: "Kindly ensure an internet connection to continue." })
      return mutateGoPublic()
    }
    return mutateStop()
  }

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
          onClick={onClk}
          className={`dc w-36 px-4 py-1.5 text-[13px] ${isNidumSharedPublic ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        >
          {(isPending4 || isPending5) && <span className="loader-2 size-4 border-2"></span>}
          {isNidumSharedPublic ? "Stop Sharing" : "Go Public"}
        </button>
      </div>
    </>
  )
}

export default Main
