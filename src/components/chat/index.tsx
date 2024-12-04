import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import { useStopShareOnAppLeave, useZorkEnable } from "../../hooks/use-device";
import useConvoStore from "../../store/conversations";
import useAuthStore from "../../store/auth";
import { findLatest } from "../../utils";
// import useContextStore from "@store/context";

import CheckForUpdate from "./check-for-update";
// import ImgGenerate from "./img-generate";
import Header from "./header";
import Modals from "./modals";

function Chat() {
  // const project_id = useContextStore(s => s.project_id)
  // const chat_id = useContextStore(s => s.chat_id)

  const user_id = useAuthStore(s => s._id)
  const convo = useConvoStore(s => s.data?.[user_id] || null)
  const init = useConvoStore(s => s.init)

  useEffect(() => {
    console.log("at convo stor from index")
    if (!convo?.projects || Object.keys(convo?.projects).length === 0) {
      init()
    }
  }, [])

  useZorkEnable()

  useStopShareOnAppLeave()

  useEffect(() => {
    document.body.classList.add("open")
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

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
