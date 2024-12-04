import { useState } from "react";
import { IoSearch } from "react-icons/io5";

import type { Project } from "../../../store/conversations";

import { relativeDateFormat } from "../../../utils/date-helper"; // generateSampleProjects, 
import useContextStore from "../../../store/context";
import useConvoStore from "../../../store/conversations";
import useAuthStore from "../../../store/auth";
import useUIStore from "../../../store/ui";
import { cn } from "../../../lib/utils";

import Message from '../../../assets/svg/message.svg?react';

import ProjectCard from "./project-card";

type groupedPrpjectT = Record<string, Project[]>

type props = {
  platform: string
  isFullScreen: boolean
}

function Projects({ isFullScreen, platform }: props) {
  const user_id = useAuthStore(s => s._id)

  const updateContext = useContextStore(s => s.updateContext)
  const project_id = useContextStore(s => s?.data?.[user_id]?.project_id)

  const updateModal = useUIStore(s => s.update)
  const [searchBy, setSearchBy] = useState("")

  const chatsMap = useConvoStore(s => s?.data?.[user_id]?.chats)
  const groupedProjects: groupedPrpjectT = useConvoStore(s => {
    if (s?.data?.[user_id]) {
      return Object.values(s?.data?.[user_id]?.projects)?.reduce((prev: any, curr) => {
        if (curr?.name?.toLowerCase()?.includes(searchBy?.toLowerCase())) {
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

  function onNavigate(id: string) {
    updateContext({
      project_id: id,
      chat_id: chatsMap?.[id]?.[0]?.id || ""
    })
  }

  return (
    <div
      className={cn("mini-scroll-bar dfc gap-0 shrink-0 w-full h-screen overflow-hidden transition-transform", {
        "-translate-x-full": !!project_id
      })}
    >
      <div className={`df p-2 ${isFullScreen ? "pl-10" : platform === "windows" ? "pl-10" : "pl-[102px]"} text-[11px] mt-[5px] font-medium text-white/60`}>
        Projects
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

      <div className="my-2 mx-2.5">
        <button
          className="df w-full px-3 py-2 text-[13px] text-left text-white/70 cursor-pointer rounded-lg group bg-secondary hover:text-white group active:scale-105 transition-all"
          onClick={() => updateModal({ open: "project" })}
        >
          <span className="flex-1">New Project</span>
          <Message className="size-4 group-hover:stroke-white" />
        </button>
      </div>

      <div className="scroll-y p-2">
        {Object.entries(groupedProjects).map(([dateGroup, groupProjects]) => (
          <div key={dateGroup} className="mb-5">
            <h2 className="mb-0.5 pl-2.5 text-xs font-semibold text-white/40">{dateGroup}</h2>

            {groupProjects?.map((p) => (
              <ProjectCard
                key={p.id}
                name={p.name}
                onEdit={() => updateModal({ open: "project", data: p })}
                onDelete={() => updateModal({ open: "delete-project", data: { id: p.id } })}
                onNavigate={() => onNavigate(p.id)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
