import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ApolloProvider } from "@apollo/client";
import { ClerkProvider, UserButton } from "@clerk/nextjs";
import { UserProvider } from "@eden/package-context";
import { apolloClient } from "@eden/package-graphql";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import type { ReactElement, ReactNode } from "react";
import * as React from "react";
import { ToastContainer } from "react-toastify";

// import { IS_DEVELOPMENT } from "../constants";

const AppDeviceLayout = dynamic(
  () => import(`@eden/package-ui/src/layout/AppDeviceLayout/AppDeviceLayout`),
  {
    ssr: false,
  }
);

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
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // console.log(IS_DEVELOPMENT ? "development" : "production");

  return (
    <>
      <ClerkProvider>
        <AppDeviceLayout />
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <UserProvider>
              <div className="z-50">
                <UserButton />
              </div>
              {getLayout(<Component {...pageProps} />)}
            </UserProvider>

            <ToastContainer />
          </ApolloProvider>
        </SessionProvider>
      </ClerkProvider>
    </>
  );
};

export default App;
