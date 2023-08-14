import { CompanyContext } from "@eden/package-context";
import { Maybe, Position } from "@eden/package-graphql/generated";
import { AppUserLayout, Button, SEO } from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext } from "react";
import { IconPickerItem } from "react-fa-icon-picker";

import type { NextPageWithLayout } from "../../_app";

const HomePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { company } = useContext(CompanyContext);

  return (
    <>
      <SEO />
      <div className="w-[67vw] p-8 pt-12">
        <section className="mb-8">
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
        <section className="">
          <h3 className="mb-2">Open opportunities</h3>
          <div className="w-full -m-2">
            {company?.positions?.map((position: Maybe<Position>, index) => (
              <div
                key={index}
                className="cursor-pointer transition-all hover:scale-[101%] hover:bg-edenGreen-100 w-[calc(50%-2rem)] min-w-[20rem] inline-block m-2 p-4 border border-edenGray-100 rounded-md align-top"
              >
                <div className="float-left rounded-md h-12 w-12 bg-edenPink-400 flex items-center justify-center pl-px mr-4">
                  <IconPickerItem
                    icon={position?.icon || "FaCode"}
                    size={"2rem"}
                    color="#00462C"
                  />
                </div>
                <div>
                  <h3>
                    {position?.name} @ {position?.company?.name}
                  </h3>
                  <p>
                    {position?.generalDetails?.officePolicy}
                    {" • "}
                    {position?.generalDetails?.contractType}
                    {/* {" • "}
                {position?.company?.name} */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="fixed top-8 right-8 w-[calc(33vw-4rem)] bg-edenGreen-100 p-4">
        <Button className="float-right">Post a magic job</Button>
      </section>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;
