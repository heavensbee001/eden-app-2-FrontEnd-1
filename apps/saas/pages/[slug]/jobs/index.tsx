import { CompanyContext, UserContext } from "@eden/package-context";
import { Maybe, Position } from "@eden/package-graphql/generated";
import { AppUserLayout, Badge, Button, SEO } from "@eden/package-ui";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { useContext } from "react";
import { IconPickerItem } from "react-fa-icon-picker";

import type { NextPageWithLayout } from "../../_app";

const HomePage: NextPageWithLayout = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const { company } = useContext(CompanyContext);
  const { currentUser } = useContext(UserContext);

  return (
    <>
      <SEO />
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
      <section className="w-full mb-4">
        <div className="bg-edenGreen-600 w-full h-48"></div>
      </section>
      <div className="w-[67%] px-8">
        {!currentUser && (
          <section className="bg-edenPink-100 rounded-md p-4 mb-4">
            <h2 className="text-edenGreen-600 mb-2">
              Login to chat with Eden!
            </h2>
            <p className="mb-4 text-sm text-edenGray-900">
              Login to unleash the power of Eden - she can understand you and
              become your no1 companion in helping you find your dream job
            </p>
            <Button
              onClick={() => {
                signIn("google", { callbackUrl: router.asPath });
              }}
            >
              Log in with Google
            </Button>
          </section>
        )}
        <section className="">
          <h3 className="mb-2">Open opportunities</h3>
          <div className="w-full -m-2">
            {company?.positions?.map((position: Maybe<Position>, index) => (
              <div
                key={index}
                className="bg-white relative cursor-pointer transition-all hover:scale-[101%] w-[calc(50%-2rem)] min-w-[20rem] inline-block m-2 p-4 border border-edenGray-100 rounded-md align-top"
              >
                <div className="absolute left-4 top-4 rounded-md h-12 w-12 bg-edenPink-400 flex items-center justify-center pl-px mr-4">
                  <IconPickerItem
                    icon={position?.icon || "FaCode"}
                    size={"2rem"}
                    color="#00462C"
                  />
                </div>
                <div className="pl-16">
                  <p className="font-medium text-edenGray-900">
                    {position?.name}
                  </p>
                  <p className="text-edenGray-900">{position?.company?.name}</p>
                  <p className="text-sm text-edenGray-900">
                    {position?.generalDetails?.officePolicy &&
                      position?.generalDetails?.officePolicy}
                    {position?.generalDetails?.contractType &&
                      " • " + position?.generalDetails?.contractType}
                  </p>
                  {(!!position?.generalDetails?.yearlySalary ||
                    position?.generalDetails?.yearlySalary === 0) && (
                    <p className="text-xs text-edenGray-500">
                      ${position?.generalDetails?.yearlySalary}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="absolute top-48 right-8 w-[calc(33%-4rem)] bg-edenGreen-100 p-4 rounded-md">
        <Button variant="secondary" className="float-right">
          Post a magic job
        </Button>
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
              <p className="text-xs">{company?.description}</p>
            )}
            <div className="bg-white rounded-md px-3 py-2 mr-2 inline-block leading-none text-edenGray-700">
              <p className="text-xs">Pre-vetted Candidates</p>
              <span className="font-medium text-sm leading-none text-edenGray-900">
                {company?.candidatesNum}
              </span>
            </div>
            <div className="bg-white rounded-md px-3 py-2 mr-2 inline-block leading-none text-edenGray-700">
              <p className="text-xs">Combined Skills</p>
              <span className="font-medium text-sm leading-none text-edenGray-900">
                {company?.skillsNum}
              </span>
            </div>
          </div>

          {company?.description && (
            <div className="mb-4">
              <h3>About us</h3>
              <p className="text-xs">{company?.description}</p>
            </div>
          )}

          <h2 className="text-edenGreen-600">
            Talent Pools active in {company?.name ? company?.name : "community"}
          </h2>
          {company?.positions?.slice(0, 5).map((position, index) => (
            <Badge
              key={index}
              text={position?.name || ""}
              cutText={22}
              className="border border-edenGray-500 text-edenGreen-600"
            />
          ))}
          {company?.positions && company?.positions?.length > 6 && (
            <p className="text-edenGray-500 text-xs">and more...</p>
          )}
        </div>
      </section>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;
