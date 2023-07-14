import { gql, useQuery } from "@apollo/client";
import { Company } from "@eden/package-graphql/generated";
import { useRouter } from "next/router";
import React from "react";

// import { isAllServers, isEdenStaff } from "../../data";
import { CompanyContext } from "./CompanyContext";

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      slug
      positions {
        _id
        name
      }
    }
  }
`;

export interface CompanyProviderProps {
  children: React.ReactNode;
}

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const router = useRouter();

  const { data: dataFindCompany } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: router.query.slug,
      },
    },
    ssr: false,
    skip: !router.query.slug,
  });

  // useMemo(() => {
  //   if (dataFindCompany) {
  //   }
  // }, [dataFindCompany?.findCompanyFromSlug]);

  const injectContext: { company: Company | undefined } = {
    company: dataFindCompany?.findCompanyFromSlug,
  };

  return (
    <CompanyContext.Provider value={injectContext}>
      {children}
    </CompanyContext.Provider>
  );
};
