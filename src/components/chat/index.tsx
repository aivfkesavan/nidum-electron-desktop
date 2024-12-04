import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import { useStopShareOnAppLeave, useNidumChainSetup } from "../../hooks/use-device";
import useConvoStore from "../../store/conversations";
import useAuthStore from "../../store/auth";
import { findLatest } from "../../utils";
// import useContextStore from "@store/context";

import CheckForUpdate from "./check-for-update";
// import ImgGenerate from "./img-generate";
import Header from "./header";
import Modals from "./modals";
import { useNavigate } from "react-router-dom";

function Chat() {
  // const project_id = useContextStore(s => s.project_id)
  // const chat_id = useContextStore(s => s.chat_id)

  const navigate = useNavigate()

  const user_id = useAuthStore(s => s._id)
  const convo = useConvoStore(s => s.data?.[user_id] || null)
  const init = useConvoStore(s => s.init)

  useEffect(() => {
    const pathname = window.location.pathname
    if (pathname === "/") {
      if (convo?.projects && Object.keys(convo?.projects).length) {
        const latestProjectId = findLatest(Object.values(convo?.projects))
        const chats = convo?.chats[latestProjectId?.id]
        const latestChatId = findLatest(chats)
        let to = `/p/${latestProjectId?.id}`
        if (chats?.length === 1 || chats?.[0]?.title === "New Chat") {
          to = to + `/c/${latestChatId?.id}`
        }
        navigate(to)
      } else {
        init()
        window.location.reload()
      }
    }
  }, [])

  useEffect(() => {
    if (document.body.clientWidth > 768) {
      document.body.classList.add("open")
    }
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

  useNidumChainSetup()

  useStopShareOnAppLeave()

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
