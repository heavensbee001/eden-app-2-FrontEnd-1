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
        className="py-24 w-full flex justify-center"
        style={{
          backgroundImage: "url(/banner.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-4/5 max-w-4xl bg-white rounded-md p-10 grid grid-cols-12">
          <div className="col-span-5">
            <h1 className="text-edenGreen-600 mb-10">
              {`${position?.name}, ${position?.company?.name}`}
            </h1>
            <div className="mb-4">
              <TbMoneybag
                size={24}
                className="inline-block mr-3 text-edenGreen-600"
              />
              <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold">
                {`$ ${position?.generalDetails?.yearlySalary}`}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <BsStar
                size={24}
                className="inline-block mr-3 text-edenGreen-600"
              />
              <div className="text-edenGray-600 px-6 py-1.5 flex items-center justify-center border border-edenGray-300 rounded-md mr-3 ml-1">
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
                className="inline-block mr-3 text-edenGreen-600"
              />
              <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold mr-2">
                {position?.generalDetails?.officePolicy}
              </div>
              <div className="inline-block bg-edenGreen-600 text-edenPink-300 rounded-xl font-Moret px-3 py-0.5 font-bold mr-2">
                {position?.generalDetails?.officeLocation}
              </div>
            </div>
          </div>
          <div className="col-span-7 border-l-2 border-edenGreen-300 pl-4">
            <img
              src={
                "https://storage.cloud.google.com/eden_companies_images/Tesla_logo.png"
              }
              className="h-20"
              alt={position?.company?.name || ""}
            />
            <p className="text-edenGray-900 text-sm mb-2">
              {position?.company?.description}
            </p>
            <p className="text-edenGray-900 text-sm mb-2">
              <HiOutlineUsers
                size={20}
                className="inline-block mr-2 text-edenGreen-600"
              />
              {position?.company?.employeesNumber} employees
            </p>
            <p className="text-sm mb-2">
              <GoTag
                size={24}
                className="inline-block mr-2 text-edenGreen-600"
              />
              {position?.company?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="px-2 mr-2 bg-edenGray-100 rounded-md inline pb-1"
                >
                  {tag}
                </div>
              ))}
            </p>
            <div className="text-sm p-4 bg-edenPink-100 rounded-md">
              <div className="flex mb-2">
                <div className="bg-edenGreen-300 mr-2 rounded-full h-6 w-6 flex items-center justify-center">
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
      <div className="grid grid-cols-12 w-4/5 max-w-4xl gap-x-8 py-16 px-8 mx-auto">
        {/* ---- POSITION DETAILS ---- */}
        <div className="col-span-12 md:col-span-6">
          <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">Role</h2>
            </div>
            <div className="px-6 py-4 border-edenGreen-300">
              <div className="border-b-2 border-edenGreen-300 mb-4">
                <h3 className="text-edenGreen-600 font-semibold mb-2">
                  Who you are
                </h3>
                <p className="text-xs mb-4">{position.whoYouAre}</p>
              </div>
              <div className="">
                <h3 className="text-edenGreen-600 font-semibold mb-2">
                  What the job involves
                </h3>
                <p className="text-xs">{position.whatTheJobInvolves}</p>
              </div>
            </div>
          </section>

          {/* ---- SHARE & REPORT ---- */}
          <section className="bg-edenPink-100 rounded-md overflow-hidden px-6 py-4 mb-8">
            <div
              className="flex items-center group cursor-pointer w-fit"
              onClick={() => {
                navigator.clipboard.writeText(
                  `https://edenprotocol.app/${position.company?.slug}/jobs/${position._id}`
                );
                toast.success("Job link copied");
              }}
            >
              <HiOutlineShare
                size={24}
                className="mr-2 text-edenGreen-600 group-hover:text-edenGreen-400 inline"
              />
              <span className="group-hover:text-edenGray-500 group-hover:underline">
                Share this job
              </span>
            </div>
          </section>
        </div>

        <div className="col-span-12 md:col-span-6">
          {/* ---- YOU & THE ROLE ---- */}
          <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">You & the role</h2>
            </div>
            <div className="px-6 py-4">
              <div className="h-8 w-8 rounded-md bg-edenPink-300 flex items-center justify-center mx-auto">
                <AiOutlineEyeInvisible size={"1.4rem"} />
              </div>
              <h3 className="text-edenGreen-600 text-center font-semibold mb-4">
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

              <div className="flex justify-center mt-4">
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
          <section className="bg-edenPink-100 rounded-md overflow-hidden mb-8">
            <div className="bg-edenPink-300 px-6 py-4">
              <h2 className="text-edenGreen-600">Company</h2>
            </div>
            <div className="px-6">
              {/* ---- MISSION ---- */}
              {position?.company?.mission && (
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600">Company Mission</h3>
                  <p className="text-xs">{position.company.mission}</p>
                </div>
              )}

              {/* ---- INSIGHTS ---- */}
              {position?.company?.insights &&
                position?.company?.insights.length > 0 && (
                  <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                    <h3 className="text-edenGreen-600">Insights</h3>
                    <div className="relative w-full flex flex-wrap">
                      {position?.company?.insights.map((insight, index) => (
                        <div
                          key={index}
                          className="min-w-[50%] flex items-center mt-2"
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
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600">Eden&apos;s Take</h3>
                  <p className="text-xs">{position.company.edenTake}</p>
                </div>
              )}

              {/* ---- WIDGETS ---- */}
              <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                <h3 className="text-edenGreen-600 mb-4">Widgets</h3>

                {/* ---- FUNDING ---- */}
                {position?.company?.funding && (
                  <div className="mb-4 last:mb-0">
                    <h3 className="text-edenGreen-600 mb-2">Funding</h3>
                    <div className="bg-edenGreen-300 rounded-md p-4">
                      {position.company.funding.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center mb-2 last:mb-0"
                        >
                          <span className="text-white">{item?.date}</span>
                          <div className="h-2 w-2 bg-edenPink-400 rounded-full"></div>
                          <span className="text-white">{item?.amount}</span>
                          <div className="inline-block bg-edenGreen-600 text-edenPink-400 rounded-xl font-Moret px-3 py-0.5 font-bold">
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
                      <div className="text-center mb-2">
                        {position?.company?.culture.tags &&
                          position?.company?.culture.tags?.map((tag, index) => (
                            <div
                              key={index}
                              className="inline px-4 mr-2 last:mr-0 bg-edenGreen-600 text-edenPink-400 rounded-md inline py-1 font-Moret"
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
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600">Benefits & perks</h3>
                  <p className="text-xs">{position.company.benefits}</p>
                </div>
              )}

              {/* ---- COMPANY VALUES ---- */}
              {position?.company?.values && (
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600">Company Values</h3>
                  <p className="text-xs">{position.company.values}</p>
                </div>
              )}

              {/* ---- FOUNDERS ---- */}
              {position?.company?.founders && (
                <div className="border-b-2 border-edenGreen-300 last:!border-0 py-4">
                  <h3 className="text-edenGreen-600">Founders</h3>
                  <p className="text-xs">{position.company.founders}</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* ---- FOOTER APPLY ---- */}
      <footer className="bg-edenGreen-600 h-16 w-full fixed bottom-0 left-0 flex items-center justify-center">
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
