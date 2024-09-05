import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import useInitSetup from "@hooks/use-init-setup";
import CheckForUpdate from "./check-for-update";
import Header from "./header";

function Chat() {
  useInitSetup()

  useEffect(() => {
    document.body.classList.add("open")
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

  return (
    <main className="app-wrapper transition-all">
      <SideBar />

      <div className="dfc h-screen flex-1 text-sm">
        <Header />
        <Messages />
      </div>

      <CheckForUpdate />
    </main>
  )
}

export default Chat
