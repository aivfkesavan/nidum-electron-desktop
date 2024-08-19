// import SideNav from "./side-nav";

type props = Readonly<{
  children: React.ReactNode;
}>

function MainLayout({ children }: props) {
  return (
    <main className="app-wrapper flex h-screen overflow-hidden transition-all">
      {/* <SideNav /> */}

      {children}
    </main>
  )
}

export default MainLayout
