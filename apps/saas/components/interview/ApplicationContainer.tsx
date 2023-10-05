"use client";

import { Position } from "@eden/package-graphql/generated";
import { Badge } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import {
  BsFillFileEarmarkBarGraphFill,
  BsFillFileEarmarkMinusFill,
  BsFillFileEarmarkPlusFill,
} from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";

interface ApplicationStepContainerProps {
  titleRole: string;
  topSkills: any[];
  position: Position;
  content: {
    matchPercentage: number | null;
    improvementPoints: string | null;
    strongFit: string | null;
    growthAreas: string | null;
    experienceAreas: string | null;
  };
}

const ApplicationStepContainer = ({
  // eslint-disable-next-line no-unused-vars
  titleRole,
  // eslint-disable-next-line no-unused-vars
  topSkills,
  // eslint-disable-next-line no-unused-vars
  position,
  content,
}: ApplicationStepContainerProps) => {
  // const router = useRouter();
  // const { currentUser } = useContext(UserContext);

  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  // const today = new Date();

  const getMatchText = () => {
    if (content.matchPercentage! >= 80) {
      return "Very High";
    } else if (content.matchPercentage! >= 60) {
      return "High";
    } else if (content.matchPercentage! >= 40) {
      return "Average";
    } else if (content.matchPercentage! >= 20) {
      return "Low";
    } else if (content.matchPercentage! < 20) {
      return "Very Low";
    } else {
      return "";
    }
  };
  const matchText = getMatchText();

  const [openSections, setOpenSections] = useState<{
    areasToImprove: boolean;
    growth: boolean;
    strongSuit: boolean;
  }>({
    areasToImprove: true,
    growth: true,
    strongSuit: true,
  });

  return (
    <>
      <div>
        <div className="grid w-full grid-cols-12 gap-2">
          <div className="col-span-9 pt-8">
            <h1 className="text-edenGreen-600">
              Before you dive into the interview
            </h1>
            <p className="text-edenGray-900 mb-10 text-sm">
              A couple of quick notes to set you up for success
            </p>
            <section
              className="bg-edenPink-100 relative mb-2 cursor-pointer rounded-sm p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  areasToImprove: !openSections.areasToImprove,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.areasToImprove ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkMinusFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Missing from your resume
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Make sure to address this in your interview
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.areasToImprove ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.improvementPoints}
              </p>
            </section>
            <section
              className="border-edenGreen-100 relative mb-2 cursor-pointer border-b p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  growth: !openSections.growth,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.growth ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkBarGraphFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Your opportunity to grow
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Find out about the areas you can grow in
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.growth ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.growthAreas}
              </p>
            </section>
            <section
              className="border-edenGreen-100 relative mb-2 cursor-pointer border-b p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  strongSuit: !openSections.strongSuit,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.strongSuit ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkPlusFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                What already stands out about you
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Find out about the areas you are strong at
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.strongSuit ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.strongFit}
              </p>
            </section>
          </div>
          <div className="border-edenGreen-100 col-span-3 rounded-sm border">
            <section className="border-edenGreen-100 mb-2 rounded-md border-b p-4 text-center">
              <h2 className="text-edenGreen-600 mb-4 text-center">
                Probability of Passing
              </h2>
              <div className="border-edenGreen-400 text-edenGreen-600 font-Moret inline-block border px-3 py-1 text-center text-lg">
                {matchText.toUpperCase()}
              </div>
            </section>
            {(position?.generalDetails?.yearlySalary ||
              position?.generalDetails?.yearlySalary === 0) && (
              <section className="mb-2 p-4">
                <h3 className="text-edenGreen-600 mb-2">
                  <IoWallet size="1.3rem" className="mr-2 inline" />
                  Yearly Salary
                </h3>
                <p className="text-lg font-medium">
                  ${position?.generalDetails?.yearlySalary}
                </p>
              </section>
            )}
            {/* <section className="mb-2 p-4">
              <h3 className="text-edenGreen-600 mb-2">
                <BiCalendarExclamation
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Timeline
              </h3>
              <div>
                <div className="">
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[today.getMonth()]
                    } ${today.getDate()}`}</p>
                    <p className="text-sm">Recruiting + Eden AI Chat</p>
                  </div>
                  <BiChevronDown
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-auto"
                  />
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 3)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 3)
                    ).getDate()}`}</p>
                    <p className="text-sm">HR Interviews</p>
                  </div>
                  <BiChevronDown
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-auto"
                  />
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 14)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 14)
                    ).getDate()}`}</p>
                    <p className="text-sm">Onboarding</p>
                  </div>
                </div>
              </div>
            </section> */}
            <section className="mb-2 w-full p-4">
              <h3 className="text-edenGreen-600 mb-2">
                <FaStar
                  size="1.3rem"
                  color="#00462C"
                  className="-mt-1 mr-2 inline"
                />
                Your Top skills
              </h3>
              <div>
                {topSkills !== null &&
                  topSkills.map((skill: any, index: number) => (
                    <Badge key={index} text={skill} cutText={20} />
                  ))}
              </div>
            </section>
          </div>
        </div>
        {/* <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3 bg-edenGreen-100 mb-2 rounded-md p-4">
            <h2 className="text-center text-edenGreen-600 mb-6">
              Probability of passing
            </h2>
            <div className="bg-white text-center p-4 rounded-md">
              {matchText}
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-12 gap-2">
            <section className="w-full border border-edenGray-100 rounded-md bg-white p-4 col-span-12">
              <h3 className="text-edenGreen-600 mb-2">Your Top skills</h3>
              <div>
                {topSkills !== null &&
                  topSkills.map((skill: any, index: number) => (
                    <Badge key={index} text={skill} cutText={20} />
                  ))}
              </div>
            </section>
            <section className="w-full border border-edenGray-100 rounded-md bg-white mb-2 p-4 col-span-4">
              <h3 className="text-edenGreen-600 mb-2">Yearly Salary</h3>
              <p className="text-lg font-medium">
                ${position?.generalDetails?.yearlySalary}
              </p>
            </section>
            <section className="w-full border border-edenGray-100 rounded-md bg-white mb-2 p-4 col-span-8">
              <h3 className="text-edenGreen-600 mb-2">Timeline</h3>
              <div>
                <div className="flex flex-nowrap items-center">
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[today.getMonth()]
                    } ${today.getDate()}`}</p>
                    <p>Recruiting + Eden AI Chat</p>
                  </div>
                  <BiChevronRight
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-5"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 3)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 3)
                    ).getDate()}`}</p>
                    <p>HR Interviews</p>
                  </div>
                  <BiChevronRight
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-5"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 14)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 14)
                    ).getDate()}`}</p>
                    <p>Onboarding</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div> */}
        {/* <section className="h-64 w-full overflow-x-scroll whitespace-nowrap">
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Strong suit
            </h3>
            <p className="whitespace-pre-wrap">{content.strongFit}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Areas to improve
            </h3>
            <p className="whitespace-pre-wrap">{content.improvementPoints}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">Growth</h3>
            <p className="whitespace-pre-wrap">{content.growthAreas}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Personal Experience
            </h3>
            <p className="whitespace-pre-wrap">{content.experienceAreas}</p>
          </div>
        </section> */}
      </div>
    </>
  );
};

export default ApplicationStepContainer;
