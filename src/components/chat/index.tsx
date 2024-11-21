import { useEffect } from "react";
import { LuLoader } from "react-icons/lu";

import Messages from "./messages";
import SideBar from "./side-bar";

import { useStopShareOnAppLeave, useZorkEnable } from "../../hooks/use-device";
import { useCheckInit } from "../../hooks/use-check-init";
// import useContextStore from "@store/context";

import CheckForUpdate from "./check-for-update";
// import ImgGenerate from "./img-generate";
import Header from "./header";
import Modals from "./modals";

function Chat() {
  // const project_id = useContextStore(s => s.project_id)
  // const chat_id = useContextStore(s => s.chat_id)

  const initaialised = useCheckInit()

  useZorkEnable()

  useStopShareOnAppLeave()

  useEffect(() => {
    document.body.classList.add("open")
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

  if (!initaialised) {
    return (
      <div className="dc h-screen">
        <LuLoader className="animate-spin duration-1_5s" />
      </div>
    )
  }

  return (
    <main className="app-wrapper transition-all">
      <SideBar />

      <div className="dfc h-screen flex-1 text-sm border-t">
        <Header />
        {/* {
          chat_id === `${project_id}-imgGen`
            ? <ImgGenerate />
            : <Messages key={chat_id} />
        } */}
        <Messages />
      </div>

      <Modals />
      <CheckForUpdate />
    </main>
  )
}

export default Chat
