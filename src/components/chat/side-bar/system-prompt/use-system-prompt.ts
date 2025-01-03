import { useParams } from "react-router-dom";
import useConvoStore from "../../../../store/conversations";
import useAuthStore from "../../../../store/auth";

function useSystemPrompt() {
  const { project_id = "", chat_id = "" } = useParams()

  const user_id = useAuthStore(s => s._id)

  const webEnabled = useConvoStore(s => s?.data?.[user_id]?.projects[project_id]?.web_enabled || "")
  const ragEnabled = useConvoStore(s => s?.data?.[user_id]?.projects[project_id]?.rag_enabled || "")

  const systemPrompt = useConvoStore(s => s?.data?.[user_id]?.projects[project_id]?.systemPrompt || "")
  const webPrompt = useConvoStore(s => s?.data?.[user_id]?.projects[project_id]?.webPrompt || "")
  const ragPrompt = useConvoStore(s => s?.data?.[user_id]?.projects[project_id]?.ragPrompt || "")

  const editProject = useConvoStore(s => s.editProject)

  const onChange = (v: string) => {
    let key = ragEnabled ? "ragPrompt" : webEnabled ? "webPrompt" : "systemPrompt"
    editProject(project_id, { [key]: v })
  }

  return {
    isDisabled: chat_id?.endsWith("-imgGen"),
    prompt: ragEnabled ? ragPrompt : webEnabled ? webPrompt : systemPrompt,
    onChange,
  }
}

export default useSystemPrompt
