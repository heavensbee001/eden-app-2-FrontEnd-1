import {
  AppUserLayout,
  Button,
  Card,
  LeftToggleMenu,
  ProgressCircle,
  SEO,
  TextLabel1,
} from "@eden/package-ui";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineLink } from "react-icons/hi";

import type { NextPageWithLayout } from "../../_app";

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
      _id
      name
      positions {
        _id
        name
      }
    }
  }
`;

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { companyID } = router.query;
  const [notificationOpen, setNotificationOpen] = useState(false);

  const {
    data: findCompanyData,
    // error: findCompanyError,
  } = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: !companyID,
  });

  const handleCopyLink = (positionID: string) => {
    // const url = window.location.href;
    const url = window.location.origin + "/interview/" + positionID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

  return (
    <>
      <SEO />
      {findCompanyData?.findCompany && (
        <div className="w-full p-8">
          <LeftToggleMenu defaultVisible={true}>
            <div className="px-4 py-2">
              <h2>{findCompanyData?.findCompany?.name}</h2>
              <ul>
                <li>positions</li>
              </ul>
              <hr className="my-2" />
              <h2>Quick directory</h2>
              <ul className="list-disc">
                <li>
                  <Link href={"/interview/644e052ca7177f51e7c27b77"}>
                    Interview
                  </Link>
                </li>
                <li>
                  <Link href={"/dashboard/644e052ca7177f51e7c27b77"}>
                    Position Dashboard
                  </Link>
                </li>
                <li>
                  <Link href={"/train-ai/644e052ca7177f51e7c27b77"}>
                    Position Train AI
                  </Link>
                </li>
              </ul>
            </div>
          </LeftToggleMenu>
          <div className="mx-auto max-w-3xl">
            <section className="w-full">
              <h3 className="mb-4">Positions</h3>
              <div className="grid w-full grid-cols-3 gap-2">
                {findCompanyData?.findCompany.positions.map(
                  (position: any, index: number) => (
                    <Card
                      key={index}
                      className="cursor-pointer bg-white p-2 transition-all duration-200 ease-out hover:scale-[102%] hover:shadow-md hover:shadow-[rgba(116,250,109,0.4)]"
                    >
                      <div
                        onClick={() =>
                          router.push(`/dashboard/${position._id}`)
                        }
                      >
                        <h4 className="text-center">{position.name}</h4>
                        <hr />
                        <p className="mb-4 text-center text-sm">
                          Average time of interview: {12}min
                        </p>
                        <div className="mb-4">
                          <div className="flex w-[30%] flex-col items-center">
                            <ProgressCircle size={60} progress={40} />
                            <p className="text-center text-xs text-gray-400">
                              interviewed
                            </p>
                          </div>
                        </div>
                        <p className="mb-2 text-center">
                          <TextLabel1>Match quality</TextLabel1>
                        </p>
                        <div className="mb-4 grid grid-cols-3 gap-2 pt-1">
                          <div className="rounded-md bg-gray-100 text-center">
                            <p className="mb-1 text-sm">Over 90%</p>
                            <p>{14}</p>
                            <p className="text-xs">candidates</p>
                          </div>
                          <div className="rounded-md bg-gray-100 text-center">
                            <p className="mb-1 text-sm">Over 70%</p>
                            <p>{14}</p>
                            <p className="text-xs">candidates</p>
                          </div>
                          <div className="rounded-md bg-gray-100 text-center">
                            <p className="mb-1 text-sm">Over 50%</p>
                            <p>{14}</p>
                            <p className="text-xs">candidates</p>
                          </div>
                        </div>
                        <div>
                          <Button
                            size="sm"
                            className="bg-soilBlue border-soilBlue relative mx-auto flex w-[75%] items-center !text-sm text-white"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyLink(position._id);
                            }}
                          >
                            <div className="flex w-full items-center justify-center">
                              {!notificationOpen ? (
                                <>
                                  <HiOutlineLink className="mr-1" />
                                  <span>interview link</span>
                                </>
                              ) : (
                                <span className="text-sm">Link copied!</span>
                              )}
                            </div>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { gql, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
