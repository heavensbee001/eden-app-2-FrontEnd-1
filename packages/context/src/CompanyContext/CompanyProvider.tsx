import { gql, useLazyQuery } from "@apollo/client";
import { Company } from "@eden/package-graphql/generated";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

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
  const [company, setCompany] = useState<Company | undefined>(undefined);

  // const { data: dataFindCompany } = useQuery(FIND_COMPANY_FROM_SLUG, {
  //   variables: {
  //     fields: {
  //       slug: router.query.slug,
  //     },
  //   },
  //   ssr: false,
  //   skip: !router.query.slug,
  // });

  const [getCompany, { data: dataFindCompany }] = useLazyQuery(
    FIND_COMPANY_FROM_SLUG,
    {
      variables: {
        fields: {
          slug: router.query.slug,
        },
      },
      ssr: false,
      fetchPolicy: "network-only",
    }
  );

  const getCompanyFunc = () => {
    getCompany();
  };

  useEffect(() => {
    getCompany();
  }, []);

  useMemo(() => {
    if (dataFindCompany?.findCompanyFromSlug) {
      setCompany(dataFindCompany?.findCompanyFromSlug);
    }
  }, [dataFindCompany?.findCompanyFromSlug]);

  const injectContext = {
    company,
    getCompanyFunc,
  };

  return (
    <CompanyContext.Provider value={injectContext}>
      {children}
    </CompanyContext.Provider>
  );
};
