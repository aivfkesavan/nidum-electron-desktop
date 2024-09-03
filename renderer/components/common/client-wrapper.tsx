import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from "@/lib/query-client";

import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/common/google-analytics";

import { DownloadProvider } from './download-manager';

type props = Readonly<{
  children: React.ReactNode;
}>

const style = {
  width: "250px"
}

function ClientWrapper({ children }: props) {
  return (
    <QueryClientProvider client={queryClient}>
      <DownloadProvider>
        {children}
      </DownloadProvider>

      <Toaster />

      <SonnerToaster
        style={style}
      // toastOptions={{ style }}
      />

      <GoogleAnalytics />
    </QueryClientProvider>
  )
}

export default ClientWrapper
