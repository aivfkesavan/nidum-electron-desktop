import { TiVendorAndroid } from "react-icons/ti";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaAppStoreIos } from "react-icons/fa6";
// import { IoLogoWindows } from "react-icons/io";
import { GrApple } from "react-icons/gr";

import useUIStore from "../../../store/ui";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

const list = [
  {
    title: "iOS",
    icon: FaAppStoreIos,
    link: "https://apps.apple.com/in/app/nidum-local-ai/id6737910747",
  },
  {
    title: "Android",
    icon: TiVendorAndroid,
    link: "https://releases.nidum.ai/download/downloads/nidum-ai-latest.apk",
  },
  {
    title: "Mac",
    icon: GrApple,
    link: "https://releases.nidum.ai/download/downloads/nidum-ai-latest.dmg",
  },
  {
    title: "Web",
    icon: AiOutlineGlobal,
    link: "https://app.nidum.ai",
  },
  // {
  //   title: "Windows",
  //   icon: IoLogoWindows,
  // },
]

function Download() {
  const closeModel = useUIStore(s => s.close)
  const open = useUIStore(s => s.open)

  return (
    <Dialog open={open === "download"} onOpenChange={closeModel}>
      <DialogContent className="max-w-sm md:max-w-lg bg-white [&_.close-icon]:top-1 [&_.close-icon]:right-1 [&_.close-icon]:text-black rounded-lg">
        <DialogHeader>
          <DialogTitle className="max-md:mt-2 max-md:text-center max-md:leading-6 text-black">
            Say hello to your very own Local AI Ecosystem
          </DialogTitle>

          <DialogDescription className=" max-md:text-center text-black">
            Platforms supported
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center gap-4">
          {
            list.map(l => (
              <a
                key={l.title}
                href={l.link}
                target="_blank"
                className="p-4 text-black border-2 border-black rounded-md hover:text-zinc-600 hover:border-zinc-600"
              >
                <h6 className="md:mb-4 text-lg font-semibold text-center">{l.title}</h6>
                <l.icon className="text-6xl mx-auto" />
              </a>
            ))
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Download
