import { MdDeleteOutline, MdOutlineContentCopy } from "react-icons/md";
import useClipboardCopy from '@/hooks/use-clipboard-copy';

type props = {
  isTemp: boolean
  response: string
  deleteChat?: () => void
}

function User({ response, isTemp = false, deleteChat = () => { } }: props) {
  const { copied, onCopyClk } = useClipboardCopy()

  const onCopy = () => onCopyClk(response)

  return (
    <div className="mb-6 group">
      <div className="py-2 px-4 w-fit max-w-[88%] ml-auto mr-8 text-[13px] text-right bg-border rounded-[2rem]">
        {response}
      </div>

      {
        !isTemp &&
        <div className='df gap-4 w-fit ml-auto mr-8 opacity-0 group-hover:opacity-100 text-white/60'>
          <button
            onClick={onCopy}
            disabled={copied}
            className='df gap-1 text-[10px] p-0 hover:text-white'
          >
            <MdOutlineContentCopy />

            {copied ? "Copied" : "Copy"}
          </button>

          <button
            className="p-0 hover:text-white"
            onClick={deleteChat}
          >
            <MdDeleteOutline />
          </button>
        </div>
      }
    </div>
  )
}

export default User
