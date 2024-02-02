import { createContext } from "react";

export interface DynamicSessionContextType {
  fetchingToken: boolean;
  edenSession: any;
  logOut: () => void;
}

export const DynamicSessionContext = createContext<DynamicSessionContextType>({
  fetchingToken: false,
  edenSession: null,
  // eslint-disable-next-line no-empty-function
  logOut: () => {},
});
