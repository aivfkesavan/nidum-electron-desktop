import useContextStore from "@/store/context";
import useConvoStore from "@/store/conversations";

function useSystemPrompt() {
  const project_id = useContextStore(s => s.project_id)
  const systemPrompt = useConvoStore(s => s.projects[project_id]?.systemPrompt || "")
  const ragEnabled = useConvoStore(s => s.projects[project_id]?.rag_enabled || "")
  const ragPrompt = useConvoStore(s => s.projects[project_id]?.ragPrompt || "")
  const editProject = useConvoStore(s => s.editProject)

  const onChange = (v: string) => {
    let key = ragEnabled ? "ragPrompt" : "systemPrompt"
    editProject(project_id, { [key]: v })
  }

  return {
    prompt: ragEnabled ? ragPrompt : systemPrompt,
    onChange,
  }
}

export default useSystemPrompt
