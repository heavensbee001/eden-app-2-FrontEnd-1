import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ApolloProvider } from "@apollo/client";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { CompanyProvider, UserProvider } from "@eden/package-context";
import { apolloClient } from "@eden/package-graphql";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import type { ReactElement, ReactNode } from "react";
import * as React from "react";
import { ToastContainer } from "react-toastify";

import mixpanelConfig from "../utils/tools/mixpanel";

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
  mixpanelConfig();

  return (
    <>
      <DynamicContextProvider
        settings={{
          environmentId: "ae98f8db-5f81-4e4b-9536-a676f20dfbf6",
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <SessionProvider session={session}>
          <ApolloProvider client={apolloClient}>
            <UserProvider>
              <CompanyProvider>
                {/* <AppMaintainanceLayout /> */}
                <AppDeviceLayout />
                {getLayout(<Component {...pageProps} />)}
              </CompanyProvider>
            </UserProvider>
            <ToastContainer />
          </ApolloProvider>
        </SessionProvider>
      </DynamicContextProvider>
    </>
  );
};

export default App;
