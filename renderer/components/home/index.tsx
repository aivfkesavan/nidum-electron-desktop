"use client";

import { useRouter } from "next/navigation";
import { PiPlus } from "react-icons/pi";
import Link from "next/link";

import useConvoStore from "@/store/conversations";
import useContextStore from "@/store/context";
import { MdDelete, MdEdit } from "react-icons/md";

function Home() {
  const updateContext = useContextStore(s => s.updateContext)
  const deleteProject = useConvoStore(s => s.deleteProject)
  const projects = useConvoStore(s => Object.values(s.projects))
  const navigate = useRouter()

  const onRedirect = (project_id: string) => {
    updateContext({ project_id, chat_id: "" })
    navigate.push("/chat")
  }

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 auto-rows-min items-start justify-start p-8 overflow-y-auto">
      <div className="dc flex-col my-12 sm:my-16 md:col-span-2 lg:col-span-3">
        <div className="df">
          <img
            className=" w-10 sm:w-12"
            src="/logo.png"
            alt=""
          />
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold font-Outfit tracking-wide">Nidum AI Studio</p>
        </div>
        <div className="my-1 text-sm md:text-base">Localize the AI Revolution</div>
      </div>

      <div className="df gap-4 mb-4 lg:mb-0 md:col-span-2 lg:col-span-3">
        <h1 className="text-xl md:text-2xl font-medium text-primary">Projects</h1>
        <Link href="/project/create" className="p-1 mt-0.5 text-sm rounded bg-primary-darker hover:bg-primary-dark">
          <PiPlus />
        </Link>
      </div>

      {
        projects.length === 0 &&
        <div className="dc flex-col flex-1 md:col-span-2 lg:col-span-3">
          <img
            className="max-w-sm"
            src="/ai.png"
            alt=""
          />
          <p>No project has been created yet.</p>
        </div>
      }

      {
        projects.length > 0 &&
        projects.map(p => (
          <div
            key={p.id}
            className="p-4 border rounded-lg hover:bg-secondary/40 hover:border-primary-darker/60 cursor-pointer group relative"
            onClick={() => onRedirect(p.id)}
          >
            <button
              className="hidden group-hover:block p-1 absolute top-2 right-8 hover:text-primary"
              onClick={e => {
                e.stopPropagation()
                navigate.push(`/project/edit/${p.id}`)
              }}
            >
              <MdEdit />
            </button>

            <button
              className="hidden group-hover:block p-1 absolute top-2 right-2 hover:text-red-500"
              onClick={e => {
                e.stopPropagation()
                deleteProject(p.id)
              }}
            >
              <MdDelete />
            </button>

            <p className="mb-2 text-base font-medium text-primary">{p.name}</p>
            <p className="w-fit mb-2 px-3.5 py-1 text-xs bg-primary-darker/40 text-white/70 rounded-full">{p.category === "Other" ? p.other : p.category}</p>
            <p className="min-h-10 text-[13px] text-secondary-foreground/50 line-clamp-2">{p.description}</p>
          </div>
        ))
      }
    </div>
  )
}

export default Home
