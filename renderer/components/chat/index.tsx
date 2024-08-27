import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import useInitSetup from "@hooks/use-init-setup";

function Chat() {
  useInitSetup()

  useEffect(() => {
    document.body.classList.add("open")
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

  return (
    <main className="app-wrapper transition-all">
      <SideBar />
      <Messages />
    </main>
  )
}

export default Chat
