import { Company } from "@eden/package-graphql/generated";
import { createContext } from "react";

export interface CompanyContextType {
  company: Company | undefined;
}

export const CompanyContext = createContext<CompanyContextType>({
  company: undefined,
});
