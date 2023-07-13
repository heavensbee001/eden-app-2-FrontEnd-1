// import { Members } from "@eden/package-graphql/generated";
import {
  Badge,
  CandidateTypeSkillMatch,
  NodeList,
  ReadMore,
  // SocialMediaComp,
  TextLabel1,
  UserBackground,
} from "@eden/package-ui";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { FC, useState } from "react";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

interface Props {
  member?: CandidateTypeSkillMatch; // This was formerly accepting Members but now it needs the score letter; Definitely not good approach. Have to refactor this into util functions
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: any;
}

export const InfoTab: FC<Props> = ({
  member,
  mostRelevantMemberNode,
  candidate,
}) => {
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);
  const [seeMore, setSeeMore] = useState(false);

  console.log("candidate = 998", candidate);

  return (
    <>
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className=" mb-2 mt-4 flex  items-center  ">
          <div className=" flex items-center rounded-lg border-[1px] border-gray-300 bg-white px-4 py-4 ">
            <p
              className={`${member?.letterAndColor?.totalMatchPerc?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
            </p>
            {candidate?.analysisCandidateEdenAI?.background?.content && (
              <>
                <hr className=" mx-2 my-0 h-8 border-gray-400" />
                <div className="">
                  <p className="text-lg font-bold">Eden First Impression 👀</p>

                  {candidate?.analysisCandidateEdenAI?.background?.content}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className=" grid grid-cols-2">
        <div className="col-span-2 ">
          <div className="mb-2 flex flex-col items-start justify-center rounded-lg border-[1px] border-gray-300 bg-white px-4 py-6">
            <TextLabel1>🌸 Short bio</TextLabel1>
            {member?.user?.bio ? (
              <>
                <p className="font-Unica whitespace-pre-wrap font-normal">
                  {seeMore
                    ? member?.user.bio
                    : member?.user.bio.length > 600
                    ? member?.user.bio.substring(0, 600) + "..."
                    : member?.user.bio}
                </p>
                {member?.user.bio.length > 600 && (
                  <p
                    className="mt-1 w-full cursor-pointer text-center text-sm"
                    onClick={() => setSeeMore(!seeMore)}
                  >
                    {`see ${seeMore ? "less" : "more"}`}
                    <span>
                      {seeMore ? (
                        <ChevronUpIcon width={16} className="ml-2 inline" />
                      ) : (
                        <ChevronDownIcon width={16} className="ml-2 inline" />
                      )}
                    </span>
                  </p>
                )}
              </>
            ) : (
              <div className="flex w-full animate-pulse space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 rounded bg-slate-200"></div>
                  <div className="h-3 rounded bg-slate-200"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="col-2 p-2">
          <section className="mb-2 w-full text-left">
            <TextLabel1 className="text-xs">🔎 INTERESTS</TextLabel1>
            <div className="ml-4 inline-flex flex-wrap">
              {["Travelling", "Trading", "Community", "DAOs"].map(
                (preference: string, index: number) => (
                  <Badge
                    key={index}
                    text={preference}
                    colorRGB="224,151,232"
                    className={`font-Unica text-sm`}
                    closeButton={false}
                    cutText={16}
                  />
                )
              )}
            </div>
          </section>

          <section className="mb-2 w-full text-center">
            <div className="my-4 flex justify-center">
              {member?.links && member?.links.length > 0 && (
                <SocialMediaComp size="sm" links={member?.links} />
              )}
            </div>
          </section>
        </div> */}
      </div>
      <div className="mb-2 grid grid-cols-2 rounded-lg border-[1px] border-gray-300 bg-white px-2">
        {mostRelevantMemberNode &&
        member &&
        member?.user?._id &&
        Object.keys(mostRelevantMemberNode).length > 0 &&
        mostRelevantMemberNode[member?.user._id] ? (
          <>
            <div className="col-1 p-2">
              <section className="mb-2 w-full text-left">
                <TextLabel1 className="text-xs">🌺 TOP SKILLS</TextLabel1>
                <div className="ml-4  flex-wrap">
                  {mostRelevantMemberNode[member?.user._id].nodes
                    .slice(0, 7)
                    .map((node: NodeDisplay, index: number) => (
                      <Badge
                        text={node?.nameRelevantNode || ""}
                        key={index}
                        // className={`bg-soilPurple/20 py-px text-xs`}
                        // className={`px-2 py-1 text-white rounded ${getBackgroundColorClass(node.score)}`}
                        // className={`px-2 py-1 text-white rounded bg-purple-400`}
                        className={`rounded px-1 py-1 text-xs text-white ${node.color}`}
                        cutText={100}
                      />
                    ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="col-1 p-2">
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="text-xs">🌺 TOP SKILLS</TextLabel1>
              <div className="ml-4 inline-flex flex-wrap">
                {member?.user?.nodes && member?.user.nodes.length > 0 && (
                  <NodeList
                    overflowNumber={3}
                    nodes={member?.user.nodes}
                    colorRGB={`224,151,232`}
                  />
                )}
              </div>
            </section>
          </div>
        )}
        <div className="col-1 grid grid-cols-2">
          {/* First Column: Availability, Location, Timezone */}
          <div className="col-1 p-2">
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="mb-2 text-xs">⏳️ AVAILABILITY</TextLabel1>
              <p className="ml-4 font-bold text-slate-600">
                {member?.user?.hoursPerWeek
                  ? `${member?.user.hoursPerWeek} hrs\\week`
                  : "unavailable"}
              </p>
            </section>
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="mb-2 text-xs">🌍 Location</TextLabel1>
              <p className="ml-4 font-bold text-slate-600">
                {member?.user?.location ? `${member?.user.location}` : "-"}
              </p>
            </section>
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="mb-2 text-xs">🧭 Timezone</TextLabel1>
              </p>
              <div className="ml-4 inline-flex">
                <p className="font-bold text-slate-600">
                  {member?.user?.timeZone ? `${member?.user.timeZone}` : "-"}
                </p>
              </div>
            </section>
          </div>
          {/* Second Column: Hourly Rate, Level, Notice */}
          <div className="col-2 p-2">
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="text-xs">💰 Hourly rate</TextLabel1>
              </p>
              <div>
                {member?.user?.budget?.perHour !== null &&
                member?.user?.budget?.perHour !== undefined &&
                member?.user.budget?.perHour >= 0 ? (
                  <p className="ml-4 text-sm">
                    <span className="text-xl font-bold text-[#fcba03]">
                      ${member.user.budget.perHour}
                    </span>{" "}
                    / hour
                  </p>
                ) : (
                  <span className="ml-4 font-bold text-slate-600">-</span>
                )}
              </div>
            </section>
            <section className="mb-2 w-full text-left">
              <p>
                <TextLabel1 className="text-xs">⭐ Level</TextLabel1>
              </p>
              <div>
                {member?.user?.experienceLevel?.total ? (
                  <Badge
                    className="ml-4 text-sm"
                    colorRGB="151,232,163"
                    text={
                      member?.user.experienceLevel?.total <= 3
                        ? "Junior"
                        : member?.user.experienceLevel?.total <= 6
                        ? "Mid"
                        : "Senior"
                    }
                  />
                ) : (
                  <span className="ml-4 font-bold text-slate-600">-</span>
                )}
              </div>
            </section>
            <section className="mb-2 w-full text-left">
              <TextLabel1 className="text-xs">🍀 Notice</TextLabel1>
              <p className="ml-4">2 Weeks</p>
            </section>
          </div>
        </div>
      </div>
      {member?.user?.previousProjects &&
      member?.user.previousProjects.length ? (
        <section className=" w-full rounded-lg border-[1px] border-gray-300 bg-white px-4 py-4  text-left">
          <TextLabel1 className="text-xs">🍒 BACKGROUND</TextLabel1>
          <UserBackground
            background={member?.user.previousProjects || []}
            setExperienceOpen={setExperienceOpen!}
            experienceOpen={experienceOpen!}
          />
        </section>
      ) : null}
    </>
  );
};
