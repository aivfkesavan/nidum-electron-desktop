import { useEffect } from "react";
import Messages from "./messages";
import SideBar from "./side-bar";

// import useContextStore from "@store/context";
import useInitSetup from "@hooks/use-init-setup";
import usePlatform from "@hooks/use-platform";

import CheckForUpdate from "./check-for-update";
// import ImgGenerate from "./img-generate";
import Header from "./header";

function Chat() {
  // const project_id = useContextStore(s => s.project_id)
  // const chat_id = useContextStore(s => s.chat_id)
  const platform = usePlatform()

  useInitSetup()

  useEffect(() => {
    document.body.classList.add("open")
    document.documentElement.style.setProperty('--sidebar-width', '240px')
  }, [])

  return (
    <>
      <main className="app-wrapper transition-all">
        <SideBar />

        <section className={`dfc h-screen flex-1 text-sm ${platform === "windows" ? "border-t" : ""}`}>
          <Header />
          {/* {
          chat_id === `${project_id}-imgGen`
            ? <ImgGenerate />
            : <Messages key={chat_id} />
        } */}
          <Messages />
        </section>
      </main>

      <CheckForUpdate />
    </>
  )
}

export default Chat
