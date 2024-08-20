import React from "react";
import type { AppProps } from "next/app";

import ClientWrapper from "@components/common/client-wrapper";

import "../styles/loader.css";
import "../styles/animate.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClientWrapper>
      <Component {...pageProps} />
    </ClientWrapper>
  )
}

export default MyApp;
