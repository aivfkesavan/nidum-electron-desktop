import { useEffect, useState } from "react";

import { useProjectById, useProjectMutate } from "../../../../hooks/use-project";
import useContextStore from "../../../../store/context";
import useUIStore from "../../../../store/ui";

function useSystemPrompt() {
  const updateModel = useUIStore(s => s.update)
  const closeModel = useUIStore(s => s.close)

  const project_id = useContextStore(s => s.project_id)
  const chat_id = useContextStore(s => s.chat_id)

  const { data: project, isLoading } = useProjectById(project_id)
  const { mutate, isPending } = useProjectMutate()

  const [val, setVal] = useState("")

  const webEnabled = project?.web_enabled
  const ragEnabled = project?.rag_enabled
  const key = ragEnabled ? "ragPrompt" : webEnabled ? "webPrompt" : "systemPrompt"

  useEffect(() => {
    if (project) {
      setVal(project?.[key])
    }
  }, [project, key])

  const onChange = (v: string) => setVal(v)

  function onBlur() {
    if (val !== project?.[key]) {
      updateModel({ open: "confirm" })
    }
  }

  function onSave() {
    mutate(
      {
        _id: project_id,
        [key]: val,
      },
      {
        onSuccess() {
          closeModel()
        }
      }
    )
  }

  return {
    isDisabled: chat_id?.endsWith("-imgGen") || isLoading || isPending,
    prompt: val,
    onChange,
    onBlur,
    onSave,
  }
}

export default useSystemPrompt
