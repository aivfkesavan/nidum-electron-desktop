import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import Messages from "./messages";
import SideBar from "./side-bar";

import { useStopShareOnAppLeave, useNidumChainSetup } from "../../hooks/use-device";
import { useLLMModels, useLLamaDownloadedModels } from "../../hooks/use-llm-models";
import { useOfflineLoginCorrection } from "../../hooks/use-user";
import { findLatest } from "../../utils";
import useConvoStore from "../../store/conversations";
import useAuthStore from "../../store/auth";
import useUIStore from "../../store/ui";
// import useContextStore from "@store/context";

// import ImgGenerate from "./img-generate";
import Header from "./header";
import Modals from "./modals";

function Chat() {
  // const project_id = useContextStore(s => s.project_id)
  // const chat_id = useContextStore(s => s.chat_id)

  const navigate = useNavigate()

  const updateModal = useUIStore(s => s.update)
  const user_id = useAuthStore(s => s._id)
  const convo = useConvoStore(s => s.data?.[user_id] || null)
  const init = useConvoStore(s => s.init)

  useEffect(() => {
    const pathname = window.location.hash
    if (!pathname || pathname === "#/") {
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

  useEffect(() => {
    function handle(e: any, data: any) {
      if (data !== "nidum://") {
        updateModal({ open: "open-url", data })
      }
    }
    window.ipcRenderer.on('open-url', handle)

    return () => {
      window.ipcRenderer.off('open-url', handle)
    }
  }, [])

  useOfflineLoginCorrection()

  useNidumChainSetup()

  useStopShareOnAppLeave()

  useLLamaDownloadedModels("downloaded")
  useLLMModels("llm2")

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
        {/* <Messages /> */}
        <Outlet />
      </div>

      <Modals />
    </main>
  )
}

export default Chat
