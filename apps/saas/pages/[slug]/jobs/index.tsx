import { gql, useQuery } from "@apollo/client";
import { CompanyContext, UserContext } from "@eden/package-context";
import { Maybe, Position } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Badge,
  Button,
  // EdenIconExclamation,
  // EdenTooltip,
  SEO,
} from "@eden/package-ui";
// import { classNames } from "@eden/package-ui/utils";
import Head from "next/head";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useContext } from "react";
import { IconPickerItem } from "react-fa-icon-picker";

import type { NextPageWithLayout } from "../../_app";

export const FIND_POSITIONS_OF_COMMUNITY = gql`
  query Query($fields: findPositionsOfCommunityInput) {
    findPositionsOfCommunity(fields: $fields) {
      _id
      name
      status
      icon
      company {
        _id
        name
      }
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const FAKE_MATCHSTIMATES = [
  {
    grade: "HIGH",
    text: "Your previous experience at Humain.ai as a product designer makes you a very likely fit. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
  {
    grade: "MEDIUM",
    text: "Your previous experience at Humain.ai as a product designer makes you a medium fit. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
  {
    grade: "LOW",
    text: "You're not a strong fit for this opportunity. Be sure to mention how your ideas ended up having a huge impact on the direction of the company.",
  },
];

const HomePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const { company } = useContext(CompanyContext);
  const { currentUser } = useContext(UserContext);
  const { data: findPositionsOfCommunityData } = useQuery(
    FIND_POSITIONS_OF_COMMUNITY,
    {
      variables: {
        fields: {
          communityID: company?._id,
        },
      },
      skip: !company,
    }
  );

  const handlePostJobClick = () => {
    if (!currentUser) {
      signIn("google", {
        callbackUrl: router.asPath,
      });
    } else if (
      currentUser?.companies &&
      currentUser?.companies[0] &&
      currentUser?.companies[0].company?.slug
    ) {
      router.push(`/${currentUser?.companies[0].company?.slug}/dashboard`);
    } else {
      router.push(`/pricing?community=${company?._id}`);
    }
  };

  return (
    <>
      <SEO />
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>
      <div className="w-[67%] px-8 pt-12">
        <section className="mb-4">
          <h1 className="text-edenGreen-600">
            {company?.name}
            {"'s magic job board"}
          </h1>
          <p>
            {
              "Let's build the frontiers of the new web with frens of frens & their frens as well."
            }
          </p>
        </section>
      </div>
      <section className="mb-4 w-full">
        <div
          className="bg-edenGreen-600 h-48 w-full bg-cover bg-center"
          style={{
            backgroundImage:
              company?.slug === "D_D" || company?.slug === "tesla10"
                ? "url(/d_d_banner.jpg)"
                : "",
          }}
        ></div>
      </section>
      <div className="w-[67%] px-8">
        {!currentUser && (
          <section className="bg-edenPink-100 mb-4 rounded-md p-4">
            <h2 className="text-edenGreen-600 mb-2">
              Login to chat with Eden!
            </h2>
            <p className="text-edenGray-900 mb-4 text-sm">
              Login to unleash the power of Eden - she can understand you and
              become your no1 companion in helping you find your dream job
            </p>
            <Button
              onClick={() => {
                // signIn("google", { callbackUrl: router.asPath });
                router.push("/signup");
              }}
            >
              Sign up
            </Button>
          </section>
        )}
        <section className="">
          <h3 className="mb-2">Open opportunities</h3>
          <div className="-m-2 w-full">
            {findPositionsOfCommunityData
              ?.findPositionsOfCommunity!.filter(
                (_position: Position) =>
                  _position?.status !== "ARCHIVED" &&
                  _position?.status !== "DELETED"
              )
              ?.map((position: Maybe<Position>, index: number) => {
                // const randMatchstimate =
                //   FAKE_MATCHSTIMATES[Math.round(Math.random() * 2)];

                return (
                  <div
                    key={index}
                    className="border-edenGray-100 relative m-2 inline-block w-[calc(50%-2rem)] min-w-[20rem] cursor-pointer rounded-md border bg-white p-4 align-top transition-all"
                    onClick={() => {
                      if (currentUser)
                        router.push(`/interview/${position?._id}`);
                    }}
                  >
                    {/* <div className="absolute -right-2 -top-1">
                      <EdenTooltip
                        id={`tradeoff-${index}`}
                        delayHide={currentUser ? 0 : 300}
                        clickable={currentUser ? false : true}
                        innerTsx={
                          <div className="w-60 pt-2">
                            <div
                              className={classNames(
                                "absolute right-2 top-2 rounded-sm border px-2",
                                currentUser
                                  ? "border-edenGreen-500"
                                  : "border-edenGray-500"
                              )}
                            >
                              <h3
                                className={classNames(
                                  currentUser
                                    ? "text-edenGreen-600"
                                    : "text-edenGray-500 font-Unica px-2 font-normal"
                                )}
                              >
                                {currentUser ? randMatchstimate.grade : "?"}
                              </h3>
                            </div>
                            {currentUser ? (
                              <p>{randMatchstimate.text}</p>
                            ) : (
                              <>
                                <p className="mb-4">
                                  {`Sign up to the ${position?.company?.name} talent oasis to see if you'd be a good fit for this role & get the very best matches delivered straight to your telegram.`}
                                </p>
                                <Button
                                  onClick={() => {
                                    signIn("google", {
                                      callbackUrl: router.asPath,
                                    });
                                  }}
                                  variant="secondary"
                                  className="flex h-6 items-center justify-center !py-0 px-2"
                                >
                                  Sign up
                                </Button>
                              </>
                            )}
                          </div>
                        }
                        title="matchstimate"
                        place="top"
                        effect="solid"
                        backgroundColor="white"
                        border
                        borderColor="#e5e7eb"
                        padding="0.5rem"
                        containerClassName="w-full"
                      >
                        <div className="bg-edenPink-200 h-5 w-5 rounded-full p-1 shadow">
                          <EdenIconExclamation className="h-full w-full" />
                        </div>
                      </EdenTooltip>
                    </div> */}
                    <div className="bg-edenPink-400 absolute left-4 top-4 mr-4 flex h-12 w-12 items-center justify-center rounded-md pl-px">
                      <IconPickerItem
                        icon={position?.icon || "FaCode"}
                        size={"2rem"}
                        color="#00462C"
                      />
                    </div>
                    <div className="pl-16">
                      <p className="text-edenGray-900 font-medium">
                        {position?.name}
                      </p>
                      <p className="text-edenGray-900">
                        {position?.company?.name}
                      </p>
                      <p className="text-edenGray-900 text-sm">
                        {position?.generalDetails?.officePolicy &&
                          position?.generalDetails?.officePolicy}
                        {position?.generalDetails?.contractType &&
                          " • " + position?.generalDetails?.contractType}
                      </p>
                      {(!!position?.generalDetails?.yearlySalary ||
                        position?.generalDetails?.yearlySalary === 0) && (
                        <p className="text-edenGray-500 text-xs">
                          ${position?.generalDetails?.yearlySalary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      </div>
      <section className="absolute top-48 right-8 w-[calc(33%-4rem)] bg-edenGreen-100 p-4 rounded-md">
        {company && (
          <Button
            variant="secondary"
            className="float-right"
            onClick={handlePostJobClick}
          >
            {!currentUser ? "Login to post a job" : "Post a magic job"}
          </Button>
        )}
        <div className="pt-16 pb-4">
          <div className="mb-4">
            {company?.name ? (
              <h2 className="text-edenGreen-600 mb-2">{`${company?.name}`}</h2>
            ) : (
              <h2 className="text-edenGreen-600 mb-2">
                Community talent oasis
              </h2>
            )}
            {!!company?.description && (
              <p className="mb-4 whitespace-pre-wrap text-xs">
                {company?.description}
              </p>
            )}
            <div className="text-edenGray-700 mr-2 inline-block rounded-md bg-white px-3 py-2 leading-none">
              <p className="text-xs">Pre-vetted Candidates</p>
              <span className="text-edenGray-900 text-sm font-medium leading-none">
                {company?.candidatesNum}
              </span>
            </div>
            <div className="text-edenGray-700 mr-2 inline-block rounded-md bg-white px-3 py-2 leading-none">
              <p className="text-xs">Combined Skills</p>
              <span className="text-edenGray-900 text-sm font-medium leading-none">
                {company?.skillsNum}
              </span>
            </div>
          </div>

          {/* {company?.description && (
            <div className="mb-4">
              <h3>About us</h3>
              <p className="text-xs">{company?.description}</p>
            </div>
          )} */}

          <h2 className="text-edenGreen-600">
            Talent Pools active in {company?.name ? company?.name : "community"}
          </h2>
          {company?.positions
            ?.filter(
              (_position) =>
                _position?.status !== "ARCHIVED" &&
                _position?.status !== "DELETED"
            )
            .slice(0, 5)
            .map((position, index) => (
              <Badge
                key={index}
                text={position?.name || ""}
                cutText={22}
                className="border-edenGray-500 text-edenGreen-600 border"
              />
            ))}
          {company?.positions &&
            company?.positions!.filter(
              (_position) =>
                _position?.status !== "ARCHIVED" &&
                _position?.status !== "DELETED"
            ).length > 6 && (
              <p className="text-edenGray-500 text-xs">and more...</p>
            )}
        </div>
      </section>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;
