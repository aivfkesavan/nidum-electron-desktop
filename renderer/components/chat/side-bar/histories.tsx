import { useState } from "react";
import { IoSearch } from "react-icons/io5";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";
import { cn } from "@/lib/utils";

import SystemPrompt from "./system-prompt";
import GoToProject from "./go-to-project";
import DeleteChat from "./delete-chat";
import ChatCard from "./chat-card";

function Histories() {
  const { chat_id, project_id, updateContext } = useContextStore()
  const chats = useConvoStore(s => s.chats?.[project_id] || [])

  const [searchBy, setSearchBy] = useState("")
  const [modal, setModal] = useState<{ state: string, data: any }>({ state: "", data: null })

  const updateModal = (state: string, data: any = null) => setModal({ state, data })

  return (
    <div
      className={cn("mini-scroll-bar dfc gap-0 shrink-0 w-full h-screen overflow-hidden transition-transform", {
        "-translate-x-full": !!project_id
      })}
    >
      <div className="df p-2 pl-9 text-[11px] mt-[5px] font-medium relative">
        <p className="flex-1">Chat history</p>

        <GoToProject />
      </div>

      <div className="df gap-1 mx-3 mt-2 pl-2 rounded-md border bg-secondary/60">
        <IoSearch className="text-white/30" />

        <input
          type="text"
          className="px-1 py-1.5 text-sm font-light border-none bg-transparent placeholder:text-white/50 text-zinc-400"
          placeholder="Search"
          value={searchBy}
          onChange={e => setSearchBy(e.target.value)}
        />
      </div>

      <div className="scroll-y p-2 border-b">
        {
          chats
            ?.filter(p => p.title?.toLowerCase()?.includes(searchBy?.toLowerCase()))
            ?.map(c => (
              <ChatCard
                key={c.id}
                name={c.title}
                isActive={chat_id === c.id}
                onDelete={() => updateModal("delete", c.id)}
                onNavigate={() => updateContext({ chat_id: c.id })}
              />
            ))
        }
      </div>

      <SystemPrompt />

      {
        modal.state === "delete" &&
        <DeleteChat
          id={modal.data}
          closeModel={() => updateModal("")}
        />
      }
    </div>
  )
}

export default Histories