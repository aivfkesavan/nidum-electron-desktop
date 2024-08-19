import { Toaster } from "@/components/ui/toaster";

type props = Readonly<{
  children: React.ReactNode;
}>

function ClientWrapper({ children }: props) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export default ClientWrapper
