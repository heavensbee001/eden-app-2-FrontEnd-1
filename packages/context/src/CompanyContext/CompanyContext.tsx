import { Company } from "@eden/package-graphql/generated";
import { createContext } from "react";

export interface CompanyContextType {
  company: Company | undefined;
  getCompanyFunc: () => void;
}

export const CompanyContext = createContext<CompanyContextType>({
  company: undefined,
  getCompanyFunc: () => {
    console.log("getCompanyFunc undefined");
  },
});
