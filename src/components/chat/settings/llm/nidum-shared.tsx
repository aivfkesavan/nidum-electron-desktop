import { useState } from "react";

import { useSharedServers } from "../../../../hooks/use-user";
import useContextStore from "../../../../store/context";

import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import OnlineStatus from "../../../common/online-status";
import { Label } from "../../../ui/label";
import Footer from "../common/footer";

function NidumShared() {
  const updateContext = useContextStore(s => s.updateContext)
  const sharedAppId = useContextStore(s => s.sharedAppId)

  const [selected, setSelected] = useState(sharedAppId || "")

  const { data, isLoading } = useSharedServers()

  function onSave() {
    updateContext({ sharedAppId: selected })
  }

  if (isLoading) {
    return <div className="dc h-80"><span className="loader-2"></span></div>
  }

  if (data?.invites?.length === 0) {
    return <div className="dc h-80 text-xs text-zinc-300">No shared servers found</div>
  }

  return (
    <>
      <RadioGroup value={selected} onValueChange={setSelected} className="my-4">
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

      {
        selected !== sharedAppId &&
        <Footer onSave={onSave} />
      }
    </>
  )
}

export default NidumShared
