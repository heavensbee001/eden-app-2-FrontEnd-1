import { createContext } from "react";

export interface DynamicSessionContextType {
  fetchingToken: boolean;
  edenSession: any;
}

export const DynamicSessionContext = createContext<DynamicSessionContextType>({
  fetchingToken: false,
  edenSession: null,
});
