import { CSSProperties } from "react";
import { RiArrowLeftWideFill } from "react-icons/ri";

import useIsFullScreenCheck from "../../../hooks/use-is-full-screen-check";
import usePlatform from "../../../hooks/use-platform";
import useResizable from "./use-resizable";

import SideNavToggler from "../../../components/common/side-nav-toggler";
import Histories from "./histories";
import Projects from "./projects";

function SideBar() {
  const isFullScreen = useIsFullScreenCheck()
  const platform = usePlatform()

  const { resizedWidth, resizeHandle } = useResizable({
    initialWidth: 240,
    maxWidth: 400,
    minWidth: 180,
  })

  return (
    <>
      <div
        className="side-nav w-[240px] shrink-0 border-r bg-[#171717] z-[1] transition-transform duration-200 border-t"
        style={{ width: resizedWidth }}
      >
        <div className="flex overflow-hidden">
          <Projects
            isFullScreen={isFullScreen}
            platform={platform}
          />
          <Histories
            isFullScreen={isFullScreen}
            platform={platform}
          />

          <div
            className="w-px h-screen absolute right-0 bg-secondary cursor-ew-resize"
            {...resizeHandle}
          ></div>
        </div>

        <button
          className="px-0 py-5 opacity-0 [.open_&]:opacity-100 select-none [.open_&]:select-auto text-xl absolute top-1/2 left-full -translate-y-1/2 bg-[#444] z-[1] rounded-l-none rounded-r-xl transition-opacity"
          style={{ "--x": `${resizedWidth}px` } as CSSProperties}
          onClick={() => document.body.classList.toggle("open")}
        >
          <RiArrowLeftWideFill />
        </button>
      </div>

      <SideNavToggler />
    </>
  )
}

export default SideBar
