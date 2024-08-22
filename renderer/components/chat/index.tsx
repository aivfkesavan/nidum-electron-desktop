import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import { DownloadProvider } from "./download-manager/provider";

function Chat() {
  useEffect(() => {
    document.body.classList.add("open")
  }, [])

  return (
    <DownloadProvider>
      <main className="app-wrapper transition-all">
        <SideBar />
        <Messages />
      </main>
    </DownloadProvider>
  )
}

export default Chat
