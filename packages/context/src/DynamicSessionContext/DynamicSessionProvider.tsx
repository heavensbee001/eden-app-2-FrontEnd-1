import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { getCookie, hasCookie } from "cookies-next";
import React, { useMemo } from "react";

import { parseCookie } from "../../../ui/utils";
// import { isAllServers, isEdenStaff } from "../../data";
import { DynamicSessionContext } from "./DynamicSessionContext";

export interface DynamicSessionProviderProps {
  children: React.ReactNode;
  fetchingToken: boolean;
}

export const DynamicSessionProvider = ({
  children,
  fetchingToken,
}: DynamicSessionProviderProps) => {
  const { handleLogOut } = useDynamicContext();
  const [edenSession, setEdenSession] = React.useState<any>(null);

  useMemo(() => {
    if (getCookie("edenAuthToken")) {
      setEdenSession(parseCookie(getCookie("edenAuthToken")!));
    } else {
      setEdenSession(null);
    }
  }, [getCookie("edenAuthToken")]);

  useMemo(() => {
    if (!hasCookie("edenAuthToken") && !fetchingToken) {
      handleLogOut();
    }
  }, [hasCookie("edenAuthToken"), fetchingToken]);

  const injectContext = {
    fetchingToken,
    edenSession,
  };

  return (
    <DynamicSessionContext.Provider value={injectContext}>
      {children}
    </DynamicSessionContext.Provider>
  );
};
