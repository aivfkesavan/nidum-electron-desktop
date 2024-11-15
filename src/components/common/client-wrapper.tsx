import { QueryClientProvider } from '@tanstack/react-query';
import { HashRouter } from "react-router-dom";

import { queryClient } from "../../lib/query-client";

import { Toaster as SonnerToaster } from "../ui/sonner";
import { Toaster } from "../ui/toaster";

import { DownloadProvider } from './download-manager';

type props = Readonly<{
  children: React.ReactNode;
}>

const style = {
  width: "250px"
}

function ClientWrapper({ children }: props) {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <DownloadProvider>
          {children}
        </DownloadProvider>

        <Toaster />

        <SonnerToaster
          style={style}
        />
      </QueryClientProvider>
    </HashRouter>
  )
}

export default ClientWrapper
