import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import * as React from "react";

// import { IS_DEVELOPMENT } from "../constants";

export { reportWebVitals } from "next-axiom";

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  return <Component {...pageProps} />;
};

export default App;
