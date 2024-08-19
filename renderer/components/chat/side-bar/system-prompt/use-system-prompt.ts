import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";

function useSystemPrompt() {
  const project_id = useContextStore(s => s.project_id)
  const systemPrompt = useConvoStore(s => s.projects[project_id]?.systemPrompt || "")
  const editProject = useConvoStore(s => s.editProject)

  const onChange = (v: string) => {
    editProject(project_id, { systemPrompt: v })
  }

  return {
    systemPrompt,
    onChange,
  }
}

export default useSystemPrompt
