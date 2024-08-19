import SideNavToggler from "@/components/common/side-nav-toggler";
import Histories from "./histories";
import Projects from "./projects";

function SideBar() {
  return (
    <>
      <div className="side-nav flex w-[240px] shrink-0 overflow-hidden border-r bg-[#171717] z-[1] transition-transform duration-200">
        <Projects />
        <Histories />
      </div>

      <SideNavToggler />
    </>
  )
}

export default SideBar
