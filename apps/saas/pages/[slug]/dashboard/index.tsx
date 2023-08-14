import { gql, useMutation, useQuery } from "@apollo/client";
import { CompanyContext } from "@eden/package-context";
import {
  AppUserLayout,
  Button,
  EdenAiProcessingModal,
  SEO,
} from "@eden/package-ui";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { useContext, useMemo, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";

import type { NextPageWithLayout } from "../../_app";

const UPDATE_POSITION = gql`
  mutation ($fields: updatePositionInput!) {
    updatePosition(fields: $fields) {
      _id
    }
  }
`;

const FIND_COMPANY_FROM_SLUG = gql`
  query ($fields: findCompanyFromSlugInput) {
    findCompanyFromSlug(fields: $fields) {
      _id
      name
      slug
      positions {
        _id
        name
        talentList {
          _id
          name
        }
      }
    }
  }
`;

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { getCompanyFunc } = useContext(CompanyContext);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [updatePositionLoading, setUpdatePositionLoading] =
    useState<boolean>(false);

  const { data: findCompanyData } = useQuery(FIND_COMPANY_FROM_SLUG, {
    variables: {
      fields: {
        slug: router.query.slug,
      },
    },
    onCompleted(_findCompanyData) {
      if (
        !_findCompanyData?.findCompanyFromSlug?.positions ||
        _findCompanyData?.findCompanyFromSlug?.positions?.length === 0
      ) {
        setCompanyLoading(false);
      }
    },
  });

  useMemo(() => {
    if (
      companyLoading &&
      findCompanyData?.findCompanyFromSlug?.positions &&
      findCompanyData?.findCompanyFromSlug?.positions?.length > 0
    ) {
      router.push(
        `/${findCompanyData?.findCompanyFromSlug?.slug}/dashboard/${findCompanyData?.findCompanyFromSlug?.positions[0]?._id}`
      );
    } else if (companyLoading && findCompanyData?.findCompanyFromSlug) {
      setCompanyLoading(false);
    }
  }, [findCompanyData?.findCompanyFromSlug?.positions]);

  const [updatePosition] = useMutation(UPDATE_POSITION, {
    onCompleted(updatePositionData) {
      getCompanyFunc();
      router
        .push(
          `/${findCompanyData?.findCompanyFromSlug?.slug}/dashboard/${updatePositionData.updatePosition._id}/train-eden-ai`
        )
        .then(() => {
          setUpdatePositionLoading(false);
        });
    },
    onError() {
      setUpdatePositionLoading(false);
    },
  });

  const handleCreatePosition = () => {
    const randId = uuidv4();

    setUpdatePositionLoading(true);

    updatePosition({
      variables: {
        fields: {
          name: `New Opportunity ${randId}`,
          companyID: findCompanyData?.findCompanyFromSlug?._id,
        },
      },
    });
  };

  return (
    <>
      <SEO />
      {!companyLoading && (
        <div className="mx-auto max-w-4xl pt-20 text-center">
          <h1 className="text-edenGreen-500 mb-4">Welcome to Eden</h1>
          <p className="mb-8">
            You have no open opportunities yet!
            <br />
            Start creating your first opportunity here:
          </p>
          <Button
            className={"mx-auto flex items-center whitespace-nowrap"}
            onClick={handleCreatePosition}
          >
            <BiPlus size={"1.3rem"} className="" />
            <span className="font-Moret ml-1">Add Opportunity</span>
          </Button>

          <EdenAiProcessingModal
            title="Creating position"
            open={updatePositionLoading}
          ></EdenAiProcessingModal>
        </div>
      )}
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
