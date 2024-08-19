import { MdChatBubbleOutline, MdHelpOutline, MdOutlineFeedback } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { IoMdSettings } from "react-icons/io";
import { IoHomeSharp } from "react-icons/io5";
import Btn from "./btn";

function SideNav() {
  const pathname = usePathname()
  const navigate = useRouter()

  const onClk = (to: string) => navigate.push(to)

  return (
    <aside className="dfc gap-4 items-center w-12 h-screen shrink-0 py-4 border-r z-[2] bg-[#171717]">
      <Btn
        to='/'
        title='Home'
        pathname={pathname}
        icon={<IoHomeSharp />}
        disabled={false}
        onClk={onClk}
      />

      <Btn
        to='/chat'
        title='Chat'
        pathname={pathname}
        icon={<MdChatBubbleOutline />}
        disabled={false}
        onClk={onClk}
      />

      <Btn
        to='/settings'
        title='Settings'
        pathname={pathname}
        icon={<IoMdSettings />}
        disabled={false}
        onClk={onClk}
      />

      <Btn
        to='/support'
        title='Support'
        pathname={pathname}
        icon={<MdHelpOutline />}
        disabled={false}
        onClk={onClk}
      />

      <span className="mt-auto"></span>

      <Btn
        to='/feedback'
        title='Feedback'
        pathname={pathname}
        icon={<MdOutlineFeedback />}
        disabled={false}
        onClk={onClk}
      />

      <span className='text-[10px] text-center opacity-60'>
        v1.0.1
      </span>
    </aside>
  )
}

export default SideNav
