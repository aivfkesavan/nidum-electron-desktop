import { useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";

import { useSharedServers } from "../../../../hooks/use-user";
import useContextStore from "../../../../store/context";
import useAuthStore from "../../../../store/auth";

import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import OnlineStatus from "../../../common/online-status";
import { Label } from "../../../ui/label";
import Footer from "../common/footer";

function NidumShared() {
  const user_id = useAuthStore(s => s._id)

  const updateContext = useContextStore(s => s.updateContext)
  const sharedAppId = useContextStore(s => s?.data?.[user_id]?.sharedAppId)

  const [selected, setSelected] = useState(sharedAppId || "")

  const { data, isLoading, isFetching, refetch } = useSharedServers()

  function onSave() {
    updateContext({ sharedAppId: selected })
  }

  function onSelect(v: string) {
    setSelected(v)
    setTimeout(() => {
      const el = document.querySelector("#settings-cont")
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }, 10)
  }

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  return (
    <>
      <div className="df justify-end gap-1 mt-4">
        <p className="text-xs text-zinc-400">Refresh</p>
        <button onClick={() => refetch()} className="px-2 py-1 text-xs rounded-full bg-zinc-500">
          <LuRefreshCcw className={isFetching ? "animate-spin" : ""} />
        </button>
      </div>

      {
        data?.invites?.length === 0 &&
        <div className="dc h-80 text-xs text-zinc-300">No shared servers found</div>
      }

      {
        data?.invites?.length > 0 &&
        <RadioGroup value={selected} onValueChange={onSelect} className="my-4">
          {
            data?.invites?.map((inv: any) => (
              <div key={inv?._id} className="p-4 mb-4 border rounded-md">
                <div className="df mb-3 text-xs text-zinc-300">
                  {inv?.email}
                  <OnlineStatus isOnline={inv?.isServerOn} />
                </div>

                {
                  inv?.devices?.map((dev: any) => (
                    <Label
                      key={dev?._id}
                      htmlFor={dev?.appId}
                      className="df w-full p-3 mb-2 border rounded-md cursor-pointer"
                    >
                      <RadioGroupItem value={dev?.appId} id={dev?.appId} />
                      {dev?.name}
                      <OnlineStatus isOnline={dev?.isServerOn} />
                    </Label>
                  ))
                }
              </div>
            ))
          }
        </RadioGroup>
      }

      {
        selected !== sharedAppId &&
        <Footer onSave={onSave} />
      }
    </>
  )
}

export default NidumShared
