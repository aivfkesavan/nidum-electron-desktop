import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from "@/lib/query-client";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

type props = Readonly<{
  children: React.ReactNode;
}>

function ClientWrapper({ children }: props) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <SonnerToaster
          toastOptions={{
            style: {
              width: "250px"
            }
          }}
        />
      </QueryClientProvider>
    </>
  )
}

export default ClientWrapper
