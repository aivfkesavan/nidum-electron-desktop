import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { LuLoader } from "react-icons/lu";

import type { Chat } from '../../../types/base';

import { generateNumberArray } from "../../../utils";
import { relativeDateFormat } from "../../../utils/date-helper";
import useContextStore from "../../../store/context";
import useUIStore from "../../../store/ui";
import { cn } from "../../../lib/utils";

import { useChatsByProjectId, useChatMutate } from "../../../hooks/use-chat";

import Message from '../../../assets/svg/message.svg?react';

import { Skeleton } from "../../ui/skeleton";
import SystemPrompt from "./system-prompt";
import GoToProject from "./go-to-project";
import ChatCard from "./chat-card";
import LoadMore from "../../common/load-more";

type groupedChatsT = Record<string, Chat[]>

type props = {
  platform: string
  isFullScreen: boolean
}

function Histories({ isFullScreen, platform }: props) {
  const updateContext = useContextStore(s => s.updateContext)
  const project_id = useContextStore(s => s.project_id)
  const chat_id = useContextStore(s => s.chat_id)

  const updateModal = useUIStore(s => s.update)

  const {
    data: chats,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatsByProjectId(project_id)
  const { mutate } = useChatMutate()

  const [searchBy, setSearchBy] = useState("")

  // useEffect(() => {
  //   if (!chat_id && chats && chats?.length) {
  //     updateContext({ chat_id: chats?.[0]?._id })
  //   }
  // }, [chat_id, chats])

  const groupedChats: groupedChatsT = useMemo(() => {
    if (chats) {
      return chats?.reduce((prev: groupedChatsT, curr: Chat) => {
        if (curr?.title?.toLowerCase()?.includes(searchBy?.toLowerCase())) {
          const dateGroup = relativeDateFormat(curr.updatedAt)
          if (!prev[dateGroup]) prev[dateGroup] = []
          prev[dateGroup]?.push(curr)
          return prev
        }
        return prev
      }, {}) || {}
    }

    return {}
  }, [chats])

  function addChatTo() {
    mutate(
      {
        title: "New Chat",
        project_id,
      },
      {
        onSuccess(res) {
          updateContext({ chat_id: res?._id })
        }
      }
    )
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

      {/* <button onClick={() => addRandomChats(project_id, generateSampleChats())}>Generate</button> */}

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
        {
          isLoading &&
          generateNumberArray(15).map(d => (
            <Skeleton key={d} className="h-9 mb-1" />
          ))
        }

        {!isLoading && Object.entries(groupedChats).map(([dateGroup, groupChats]) => (
          <div key={dateGroup} className="mb-5">
            <h2 className="mb-0.5 pl-2.5 text-xs font-semibold text-white/40">{dateGroup}</h2>

            {groupChats?.map((c) => (
              <ChatCard
                key={c._id}
                name={c.title}
                isActive={chat_id === c._id}
                onDelete={() => updateModal({ open: "delete-chat", data: { _id: c._id } })}
                onNavigate={() => updateContext({ chat_id: c._id })}
              />
            ))}
          </div>
        ))}

        {
          isFetchingNextPage &&
          <LuLoader className=" mx-auto my-2 animate-spin duration-1_5s" />
        }

        {
          !isLoading && hasNextPage && !isFetchingNextPage &&
          <LoadMore fn={() => fetchNextPage()} />
        }
      </div>

      <SystemPrompt />
    </div>
  )
}

export default Histories
