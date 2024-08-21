import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

function Chat() {
  useEffect(() => {
    document.body.classList.add("open")
  }, [])

  return (
    <main className="app-wrapper transition-all">
      <SideBar />
      <Messages />
    </main>
  )
}

export default Chat
