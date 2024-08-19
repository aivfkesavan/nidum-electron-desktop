import { useState } from "react";
import { IoSearch } from "react-icons/io5";

import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";
import { cn } from "@/lib/utils";

import ProjectCard from "./project-card";
import Model from "@/components/project/model";
import DeleteProject from "./delete-project";

function Projects() {
  const updateContext = useContextStore(s => s.updateContext)
  const projects = useConvoStore(s => Object.values(s.projects))
  const project_id = useContextStore(s => s.project_id)

  const [searchBy, setSearchBy] = useState("")
  const [modal, setModal] = useState<{ state: string, data: any }>({ state: "", data: null })

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

      <div className="scroll-y p-2">
        {
          projects
            .filter(p => p.name?.toLowerCase()?.includes(searchBy?.toLowerCase()))
            .map(p => (
              <ProjectCard
                key={p.id}
                name={p.name}
                onEdit={() => updateModal("edit", p)}
                onDelete={() => updateModal("delete", p.id)}
                onNavigate={() => updateContext({ project_id: p.id, chat_id: "" })}
              />
            ))
        }
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
    </div>
  )
}

export default Projects
