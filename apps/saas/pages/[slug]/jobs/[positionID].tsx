import { gql, useQuery } from "@apollo/client";
// import { UserContext } from "@eden/package-context";
import { Position } from "@eden/package-graphql/generated";
import { AppUserLayout, Button, Loading } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import Link from "next/link";
import { useRouter } from "next/router";
// import { signIn } from "next-auth/react";
// import { useContext, useState } from "react";
// import ReCAPTCHA from "react-google-recaptcha";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { BsStar } from "react-icons/bs";
import { GoTag } from "react-icons/go";
import { HiOutlineHeart, HiOutlineShare, HiOutlineUsers } from "react-icons/hi";
import { SlLocationPin } from "react-icons/sl";
import { TbMoneybag } from "react-icons/tb";
import { toast } from "react-toastify";

import type { NextPageWithLayout } from "../../_app";

const FIND_POSITION = gql`
  query ($fields: findPositionInput!) {
    findPosition(fields: $fields) {
      _id
      name
      status
      whoYouAre
      whatTheJobInvolves
      company {
        _id
        name
        slug
        description
        benefits
        employeesNumber
        tags
        whatsToLove
        mission
        insights {
          letter
          text
        }
        edenTake
        funding {
          name
          date
          amount
        }
        culture {
          tags
          description
        }
        benefits
        values
        founders
        glassdoor
      }
      generalDetails {
        yearlySalary
        officePolicy
        officeLocation
      }
    }
  }
`;

const PositionPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { positionID } = router.query;

  const {
    data: findPositionData,
    loading: findPositionIsLoading,
    // error: findPositionError,
  } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !positionID,
    ssr: false,
  });

  const position: Position = findPositionData?.findPosition;

  if (findPositionIsLoading)
    return (
      <div className="mt-20">
        <Loading title="Loading position" />
      </div>
    );

  return (
    <div>
      <section
        className="flex w-full justify-center py-24"
        style={{
          backgroundImage: "url(/banner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="grid w-4/5 max-w-4xl grid-cols-12 rounded-md bg-white p-10">
          <div className="col-span-5">
            <h1 className="text-edenGreen-600 mb-10">
              {`${position?.name}, ${position?.company?.name}`}
            </h1>
            <div className="mb-4">
              <TbMoneybag
                size={24}
                className="text-edenGreen-600 mr-3 inline-block"
              />
              <div className="bg-edenGreen-600 text-edenPink-300 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
                {`$ ${position?.generalDetails?.yearlySalary}`}
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <BsStar
                size={24}
                className="text-edenGreen-600 mr-3 inline-block"
              />
              <div className="text-edenGray-600 border-edenGray-300 ml-1 mr-3 flex items-center justify-center rounded-md border px-6 py-1.5">
                <h4 className="text-lg">?</h4>
              </div>
              <div>
                <h3 className="text-edenGreen-600">Matchstimate</h3>
                <p className="text-edenGray-500 text-xs">Login to see</p>
              </div>
            </div>
            <div className="mb-4">
              <SlLocationPin
                size={24}
                className="text-edenGreen-600 mr-3 inline-block"
              />
              <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                {position?.generalDetails?.officePolicy}
              </div>
              <div className="bg-edenGreen-600 text-edenPink-300 font-Moret mr-2 inline-block rounded-xl px-3 py-0.5 font-bold">
                {position?.generalDetails?.officeLocation}
              </div>
            </div>
          </div>
          <div className="border-edenGreen-300 col-span-7 border-l-2 pl-4">
            <img
              src={
                "https://storage.cloud.google.com/eden_companies_images/Tesla_logo.png"
              }
              className="h-20"
              alt={position?.company?.name || ""}
            />
            <p className="text-edenGray-900 mb-2 text-sm">
              {position?.company?.description}
            </p>
            <p className="text-edenGray-900 mb-2 text-sm">
              <HiOutlineUsers
                size={20}
                className="text-edenGreen-600 mr-2 inline-block"
              />
              {position?.company?.employeesNumber} employees
            </p>
            <p className="mb-2 text-sm">
              <GoTag
                size={24}
                className="text-edenGreen-600 mr-2 inline-block"
              />
              {position?.company?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="bg-edenGray-100 mr-2 inline rounded-md px-2 pb-1"
                >
                  {tag}
                </div>
              ))}
            </p>
            <div className="bg-edenPink-100 rounded-md p-4 text-sm">
              <div className="mb-2 flex">
                <div className="bg-edenGreen-300 mr-2 flex h-6 w-6 items-center justify-center rounded-full">
                  <HiOutlineHeart size={16} className="text-edenGreen-600" />
                </div>
                <h3 className="text-edenGreen-600">What&apos;s to love?</h3>
              </div>
              <p className="text-edenGray-700 text-xs">
                {position?.company?.whatsToLove}
              </p>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid w-4/5 max-w-4xl grid-cols-12 gap-x-8 px-8 py-16">
        {/* ---- POSITION DETAILS ---- */}
        <div className="col-span-12 md:col-span-6">
          <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">Role</h2>
            </div>
            <div className="border-edenGreen-300 px-6 py-4">
              <div className="border-edenGreen-300 mb-4 border-b-2">
                <h3 className="text-edenGreen-600 mb-2 font-semibold">
                  Who you are
                </h3>
                <p className="mb-4 text-xs">{position.whoYouAre}</p>
              </div>
              <div className="">
                <h3 className="text-edenGreen-600 mb-2 font-semibold">
                  What the job involves
                </h3>
                <p className="text-xs">{position.whatTheJobInvolves}</p>
              </div>
            </div>
          </section>

          {/* ---- SHARE & REPORT ---- */}
          <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md px-6 py-4">
            <div
              className="group flex w-fit cursor-pointer items-center"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://edenprotocol.app/${position.company?.slug}/jobs/${position._id}`
                );
                toast.success("Job link copied");
              }}
            >
              <HiOutlineShare
                size={24}
                className="text-edenGreen-600 group-hover:text-edenGreen-400 mr-2 inline"
              />
              <span className="group-hover:text-edenGray-500 group-hover:underline">
                Share this job
              </span>
            </div>
          </section>
        </div>

        <div className="col-span-12 md:col-span-6">
          {/* ---- YOU & THE ROLE ---- */}
          <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">You & the role</h2>
            </div>
            <div className="px-6 py-4">
              <div className="bg-edenPink-300 mx-auto flex h-8 w-8 items-center justify-center rounded-md">
                <AiOutlineEyeInvisible size={"1.4rem"} />
              </div>
              <h3 className="text-edenGreen-600 mb-4 text-center font-semibold">
                Upload your resume to unlock:
              </h3>
              <ul className="text-edenGray-900 list-disc pl-4 text-sm">
                <li className="mb-2"> If you’d be a good fit</li>
                <li className="mb-2">
                  What your strengths are for this opportunity
                </li>
                <li className="mb-2">
                  What your weaknesses are for this opportunity
                </li>
              </ul>

              <div className="mt-4 flex justify-center">
                <Link href={`/interview/${position._id}`}>
                  <Button
                    variant="secondary"
                    // onClick={() => {
                    //   router.push(`/interview/${position._id}`);
                    // }}
                  >
                    Upload CV
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* ---- COMPANY DETAILS ---- */}
          <section className="bg-edenPink-100 mb-8 overflow-hidden rounded-md">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">Company</h2>
            </div>
            <div className="px-6">
              {/* ---- MISSION ---- */}
              {position?.company?.mission && (
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600">Company Mission</h3>
                  <p className="text-xs">{position.company.mission}</p>
                </div>
              )}

              {/* ---- INSIGHTS ---- */}
              {position?.company?.insights &&
                position?.company?.insights.length > 0 && (
                  <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                    <h3 className="text-edenGreen-600">Insights</h3>
                    <div className="relative flex w-full flex-wrap">
                      {position?.company?.insights.map((insight, index) => (
                        <div
                          key={index}
                          className="mt-2 flex min-w-[50%] items-center"
                        >
                          <div className="bg-edenPink-300 mr-2 flex h-6 w-8 items-center justify-center rounded-md pb-px">
                            <span
                              className={classNames(
                                // getGrade(_category!.score! * 100).color,
                                "text-md"
                              )}
                            >
                              {insight?.letter}
                            </span>
                          </div>
                          <p className="text-2xs text-edenGray-700">
                            {insight?.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* ---- EDEN'S TAKE ---- */}
              {position?.company?.edenTake && (
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600">Eden&apos;s Take</h3>
                  <p className="text-xs">{position.company.edenTake}</p>
                </div>
              )}

              {/* ---- WIDGETS ---- */}
              <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                <h3 className="text-edenGreen-600 mb-4">Widgets</h3>

                {/* ---- FUNDING ---- */}
                {position?.company?.funding && (
                  <div className="mb-4 last:mb-0">
                    <h3 className="text-edenGreen-600 mb-2">Funding</h3>
                    <div className="bg-edenGreen-300 rounded-md p-4">
                      {position.company.funding.map((item, index) => (
                        <div
                          key={index}
                          className="mb-2 flex items-center justify-between last:mb-0"
                        >
                          <span className="text-white">{item?.date}</span>
                          <div className="bg-edenPink-400 h-2 w-2 rounded-full"></div>
                          <span className="text-white">{item?.amount}</span>
                          <div className="bg-edenGreen-600 text-edenPink-400 font-Moret inline-block rounded-xl px-3 py-0.5 font-bold">
                            {`$ ${position?.generalDetails?.yearlySalary}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* ---- CULTURE ---- */}
                {position?.company?.culture && (
                  <div className="mb-4 last:mb-0">
                    <h3 className="text-edenGreen-600 mb-2">
                      AI culture summary
                    </h3>
                    <div className="bg-edenGreen-300 rounded-md p-4">
                      <div className="mb-2 text-center">
                        {position?.company?.culture.tags &&
                          position?.company?.culture.tags?.map((tag, index) => (
                            <div
                              key={index}
                              className="bg-edenGreen-600 text-edenPink-400 font-Moret mr-2 inline inline rounded-md px-4 py-1 last:mr-0"
                            >
                              {tag}
                            </div>
                          ))}
                      </div>
                      <p className="text-sm text-white">
                        {position.company.culture.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ---- BENEFITS ---- */}
              {position?.company?.edenTake && (
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600">Benefits & perks</h3>
                  <p className="text-xs">{position.company.benefits}</p>
                </div>
              )}

              {/* ---- COMPANY VALUES ---- */}
              {position?.company?.values && (
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600">Company Values</h3>
                  <p className="text-xs">{position.company.values}</p>
                </div>
              )}

              {/* ---- FOUNDERS ---- */}
              {position?.company?.founders && (
                <div className="border-edenGreen-300 border-b-2 py-4 last:!border-0">
                  <h3 className="text-edenGreen-600">Founders</h3>
                  <p className="text-xs">{position.company.founders}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ---- FOOTER APPLY ---- */}
      <footer className="bg-edenGreen-600 fixed bottom-0 left-0 flex h-16 w-full items-center justify-center">
        <Link href={`/interview/${position._id}`}>
          <Button className="border-edenPink-400 !text-edenPink-400">
            Apply with AI
          </Button>
        </Link>
      </footer>
    </div>
  );
};

PositionPage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default PositionPage;
