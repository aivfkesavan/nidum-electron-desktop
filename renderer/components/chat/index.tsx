import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

import { DownloadProvider } from "./download-manager/provider";
import { useQuery } from "@tanstack/react-query";
import { initSetup } from "@actions/ollama";

function Chat() {
  useQuery({
    queryKey: ["init-setup"],
    queryFn: initSetup,
  })

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
