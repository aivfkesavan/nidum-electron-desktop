import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";

import type { Chat } from '../../../store/conversations';

import { relativeDateFormat } from "../../../utils/date-helper";
import useConvoStore from "../../../store/conversations";
import useAuthStore from "../../../store/auth";
import useUIStore from "../../../store/ui";
import { cn } from "../../../lib/utils";

import Message from '../../../assets/svg/message.svg?react';

import SystemPrompt from "./system-prompt";
import GoToProject from "./go-to-project";
import ChatCard from "./chat-card";

type groupedChatsT = Record<string, Chat[]>

type props = {
  platform: string
  isFullScreen: boolean
}

function Histories({ isFullScreen, platform }: props) {
  const { project_id = "", chat_id = "" } = useParams()
  const { pathname } = useLocation()

  const user_id = useAuthStore(s => s._id)

  const navigate = useNavigate()

  const updateModal = useUIStore(s => s.update)

  const [searchBy, setSearchBy] = useState("")

  const groupedChats: groupedChatsT = useConvoStore(s => {
    if (s?.data?.[user_id]?.chats) {
      return s?.data?.[user_id]?.chats?.[project_id]?.reduce((prev: any, curr) => {
        if (curr?.title?.toLowerCase()?.includes(searchBy?.toLowerCase())) {
          const dateGroup = relativeDateFormat(curr.at)
          if (!prev[dateGroup]) prev[dateGroup] = []
          prev[dateGroup].push(curr)
          return prev
        }
        return prev
      }, {}) || {}
    }
    return {}
  })

  function addChatTo() {
    if (pathname !== `/p/${project_id}`) {
      navigate(`/p/${project_id}`)
    }
  }

  return (
    <div
      className={cn("mini-scroll-bar dfc gap-0 shrink-0 w-full h-screen pt-0 overflow-hidden transition-transform", {
        "-translate-x-full": !!project_id
      })}
    >
      <div className={`df p-2 ${isFullScreen ? "pl-10" : platform === "windows" ? "pl-10" : "pl-[102px]"} text-[11px] mt-[5px] font-medium relative text-white/60`}>
        <p className="flex-1">Chats</p>

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

      <div className="mt-2 mx-2.5">
        <button
          className="df w-full px-3 py-2 text-[13px] text-left text-white/70 cursor-pointer rounded-lg group bg-secondary hover:text-white group active:scale-105 transition-all"
          onClick={addChatTo}
        >
          <span className="flex-1">New Chat</span>
          <Message className="size-4 group-hover:stroke-white" />
        </button>
      </div>

      {/* {
        model_type === "Hugging Face" && hfImgGenModel && hfImgGenModel !== "-" &&
        <div className="mb-2 mt-1.5 mx-2.5">
          <button
            className="df w-full px-3 py-2 text-[13px] text-left text-white/70 cursor-pointer rounded-lg group bg-secondary hover:text-white group"
            onClick={() => updateContext({ chat_id: `${project_id}-imgGen` })}
          >
            <span className="flex-1">Image Generator</span>
            <IoImages className="size-4 group-hover:stroke-white" />
          </button>
        </div>
      } */}

      <div className="scroll-y p-2 border-b">
        {Object.entries(groupedChats).map(([dateGroup, groupChats]) => (
          <div key={dateGroup} className="mb-5">
            <h2 className="mb-0.5 pl-2.5 text-xs font-semibold text-white/40">{dateGroup}</h2>

            {groupChats?.map((c) => (
              <ChatCard
                key={c.id}
                name={c.title}
                isActive={chat_id === c.id}
                onDelete={() => updateModal({ open: "delete-chat", data: { id: c.id } })}
                onNavigate={() => {
                  navigate(`/p/${project_id}/c/${c.id}`)
                  if (document.body.clientWidth < 768) {
                    document.body.classList.remove("open")
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <SystemPrompt />
    </div>
  )
}

export default Histories
