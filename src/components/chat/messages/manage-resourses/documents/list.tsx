import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import useConvoStore from '../../../../../store/conversations';
import useAuthStore from '../../../../../store/auth';

import { bytesToSize } from '../../../../../utils';
import constants from '../../../../../utils/constants';

import { Label } from "../../../../../components/ui/label";

function List() {
  const { project_id = "", chat_id = "" } = useParams()

  const deleteFile = useConvoStore(s => s.deleteFile)

  const user_id = useAuthStore(s => s._id)
  const files = useConvoStore(s => s?.data?.[user_id]?.files[project_id] || [])

  const { mutate, isPending } = useMutation({
    mutationFn: ({ name }: any) => axios.delete(`${constants.backendUrl}/doc/${project_id}/${name}`),
    onSuccess(res, variables) {
      deleteFile(project_id, variables.id)
    }
  })

  return (
    <div className='mini-scroll-bar flex-1 px-4 max-md:pt-6 overflow-y-auto border-t md:border-t-0 md:border-l'>
      {
        files?.length === 0 &&
        <div className="dc h-full text-white/60">
          No files added yet
        </div>
      }

      {
        files?.map(m => (
          <div
            key={m.id}
            className='df mb-2'
          >
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

      {
        !chat_id &&
        <div className='mt-6 text-xs text-white/60'>Choose a chat to add/change attachment</div>
      }

      {
        isPending &&
        <div className='text-xs'>
          Delete process in progress...
        </div>
      }
    </div>
  )
}

export default List
