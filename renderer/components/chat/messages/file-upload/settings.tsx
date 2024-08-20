import { Switch } from "@components/ui/switch"
import useContextStore from "@store/context"
import useConvoStore from "@store/conversations"

function Settings() {
  const projectId = useContextStore(s => s.project_id)
  const chatId = useContextStore(s => s.chat_id)
  const ragEnabled = useConvoStore(s => s.chats?.[projectId]?.find(c => c.id === chatId)?.rag_enabled)
  const editChat = useConvoStore(s => s.editChat)

  return (
    <div className="pt-4 mt-5 border-t">
      <h6 className="mb-6 text-sm font-medium text-center text-white/80">RAG Settings</h6>

      <div className="df">
        <label htmlFor="" className=" text-xs">Enable RAG</label>
        <Switch
          checked={ragEnabled}
          onCheckedChange={val => editChat(projectId, { id: chatId, rag_enabled: val })}
        />
      </div>

      <div className="my-4">
        <label htmlFor="" className="mb-0.5 text-xs opacity-70">Reteival Documents</label>

        <input
          type="number"
          className="no-number-arrows text-sm px-2 py-1.5 bg-transparent border"
          placeholder="3"
        // value={apiKey}
        // onChange={e => updateContext({ groqApiKey: e.target.value })}
        />
      </div>
    </div>
  )
}

export default Settings
