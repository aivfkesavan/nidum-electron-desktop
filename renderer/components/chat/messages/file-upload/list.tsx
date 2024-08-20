// import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import useContextStore from '@/store/context';
import useConvoStore from '@/store/conversations';
import bytesToSize from '@/utils/bytes-to-size';
import axios from 'axios';

// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

function List() {
  const deleteFile = useConvoStore(s => s.deleteFile)
  const editChat = useConvoStore(s => s.editChat)

  const projectId = useContextStore(s => s.project_id)
  const chatId = useContextStore(s => s.chat_id)
  const files = useConvoStore(s => s.files[projectId] || [])
  const file_id = useConvoStore(s => s.chats?.[projectId]?.find(c => c.id === chatId)?.file_id)

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: any) => axios.delete(`http://localhost:4000/doc/index/${projectId}/${name}`),
    onSuccess(res, variables) {
      console.log(res)
      deleteFile(projectId, variables.id)
    }
  })
  // const [selected, setSelected] = useState(file_id || "")

  return (
    <div className='mini-scroll-bar h-80 flex-1 px-4 max-md:pt-6 overflow-y-auto border-t md:border-t-0 md:border-l'>
      {
        files?.length === 0 &&
        <div className="dc h-72 text-white/60">
          No files added yet
        </div>
      }

      {/* <RadioGroup value={selected} onValueChange={setSelected}> */}
      {
        files?.map(m => (
          <div
            key={m.id}
            className='df mb-2'
          >
            {/* <RadioGroupItem
                className='shrink-0 mr-1'
                value={m.id}
                id={m.id}
              /> */}

            <Label htmlFor={m.id} className='flex-1 dfc gap-1 text-xs cursor-pointer'>
              <span className='text-white/80'>{m.name}</span>
              <span>{bytesToSize(m.size)}</span>
            </Label>

            <button
              className='shrink-0 px-2 py-px text-[11px] text-foreground bg-red-600 hover:bg-red-700 transition-colors rounded-[2px]'
              onClick={() => mutate({ id: m.id, name: m.name })}
              disabled={isPending}
            >
              Delete
            </button>
          </div>
        ))
      }
      {/* </RadioGroup> */}

      {
        !chatId &&
        <div className='mt-6 text-xs text-white/60'>Choose a chat to add/change attachment</div>
      }

      {
        isPending &&
        <div className='text-xs'>
          Delete process in progress...
        </div>
      }

      {/* {
        chatId && selected !== file_id && files?.length > 0 &&
        <button
          className='block px-3 mx-auto text-xs text-white bg-input hover:bg-border'
          onClick={() => editChat(projectId, { id: chatId, file_id: selected })}
          disabled={!selected}
        >
          {file_id ? "Change in" : "Add to"} current chat
        </button>
      } */}
    </div>
  )
}

export default List
