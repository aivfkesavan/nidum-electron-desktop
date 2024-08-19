import React from "react";
import type { AppProps } from "next/app";

import "../styles/loader.css";
import "../styles/animate.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />
}

export default MyApp;
