import { ApolloProvider } from "@apollo/client";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import {
  CompanyProvider,
  DynamicSessionProvider,
  UserProvider,
} from "@eden/package-context";
import { apolloClient } from "@eden/package-graphql";
import { parseCookie } from "@eden/package-ui/utils";
import { deleteCookie, hasCookie, setCookie } from "cookies-next";
import React from "react";

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [fetchingToken, setFetchingToken] = React.useState(false);

  const onDynamicAuthSuccess = async ({ authToken }: any) => {
    try {
      const res = await fetch(`/api/auth/dynamic`, {
        method: "POST",
        body: JSON.stringify({ accessToken: authToken }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCookie("edenAuthToken", data.edenToken, {
        expires: new Date(parseCookie(data.edenToken).exp * 1000),
      }); // 'expires' is optional and sets the cookie expiration in days

      setFetchingToken(false);
    } catch (err) {
      console.log(err);
      setFetchingToken(false);
    }
  };

  const onAuthFlowOpen = () => {
    setFetchingToken(true);
  };

  const onLogOut = () => {
    if (hasCookie("edenAuthToken")) {
      deleteCookie("edenAuthToken");
    }
  };

  return (
    <DynamicContextProvider
      settings={{
        environmentId: "ae98f8db-5f81-4e4b-9536-a676f20dfbf6",
        walletConnectors: [EthereumWalletConnectors],
        eventsCallbacks: {
          onAuthSuccess: onDynamicAuthSuccess,
          onAuthFlowOpen: onAuthFlowOpen,
          onLogout: onLogOut,
        },
      }}
    >
      <DynamicSessionProvider fetchingToken={fetchingToken}>
        <ApolloProvider client={apolloClient}>
          <UserProvider>
            <CompanyProvider>{children}</CompanyProvider>
          </UserProvider>
        </ApolloProvider>
      </DynamicSessionProvider>
    </DynamicContextProvider>
  );
};
