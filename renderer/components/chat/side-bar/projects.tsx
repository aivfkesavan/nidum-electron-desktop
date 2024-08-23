import { useState } from "react";
import { IoSearch } from "react-icons/io5";

import type { Project } from "@/store/conversations";

import { relativeDateFormat } from "@utils/date-helper";
import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";
import { cn } from "@/lib/utils";

import Message from '@/assets/svg/message.svg';

import DeleteProject from "./delete-project";
import ProjectCard from "./project-card";
import Model from "@/components/project/model";

type groupedPrpjectT = Record<string, Project[]>

function Projects() {
  const updateContext = useContextStore(s => s.updateContext)
  const project_id = useContextStore(s => s.project_id)

  const [searchBy, setSearchBy] = useState("")
  const [modal, setModal] = useState<{ state: string, data: any }>({ state: "", data: null })
  const [open, setOpen] = useState(false)

  const groupedProjects: groupedPrpjectT = useConvoStore(s =>
    Object.values(s.projects)?.reduce((prev, curr) => {
      if (curr?.name?.toLowerCase()?.includes(searchBy?.toLowerCase())) {
        const dateGroup = relativeDateFormat(curr.at)
        if (!prev[dateGroup]) prev[dateGroup] = []
        prev[dateGroup].push(curr)
        return prev
      }
      return prev
    }, {}) || {}
  )

  const updateModal = (state: string, data: any = null) => setModal({ state, data })

  return (
    <div
      className={cn("mini-scroll-bar dfc gap-0 shrink-0 w-full h-screen overflow-hidden transition-transform", {
        "-translate-x-full": !!project_id
      })}
    >
      <div className="df p-2 pl-9 text-[11px] mt-[5px] font-medium">
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
          className="df w-full px-3 py-2 text-[13px] text-left text-white/70 cursor-pointer rounded-lg group bg-secondary hover:text-white group"
          onClick={() => setOpen(true)}
        >
          <span className="flex-1">New Project</span>
          <Message className="size-4 group-hover:stroke-white" />
        </button>
      </div>

      <div className="scroll-y p-2">
        {Object.entries(groupedProjects).map(([dateGroup, groupChats]) => (
          <div key={dateGroup} className="mb-5">
            <h2 className="mb-0.5 pl-2.5 text-xs font-semibold text-white/40">{dateGroup}</h2>

            {groupChats?.map((p) => (
              <ProjectCard
                key={p.id}
                name={p.name}
                onEdit={() => updateModal("edit", p)}
                onDelete={() => updateModal("delete", p.id)}
                onNavigate={() => updateContext({ project_id: p.id, chat_id: "" })}
              />
            ))}
          </div>
        ))}
      </div>

      {
        modal.state === "edit" &&
        <Model
          open
          closeModel={() => updateModal("")}
          id={modal.data.id}
          data={modal?.data}
        />
      }

      {
        modal.state === "delete" &&
        <DeleteProject
          id={modal.data}
          closeModel={() => updateModal("")}
        />
      }

      <Model
        open={open}
        closeModel={() => setOpen(false)}
      />
    </div>
  )
}

export default Projects
