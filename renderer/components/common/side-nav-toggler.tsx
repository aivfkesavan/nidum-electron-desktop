import SideBar from '@/assets/svg/sidebar.svg';

function SideNavToggler() {
  function toggleNav() {
    document.body?.classList.toggle("open")
  }

  return (
    <button
      className="fixed top-2 left-2 p-1 text-lg z-[2] bg-background"
      onClick={toggleNav}
    >
      <SideBar />
    </button>
  )
}

export default SideNavToggler
