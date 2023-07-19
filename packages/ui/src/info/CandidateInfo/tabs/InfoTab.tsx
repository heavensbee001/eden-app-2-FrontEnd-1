// import { Members } from "@eden/package-graphql/generated";
import {
  Badge,
  CandidateTypeSkillMatch,
  LongText,
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

  // console.log("candidate = 998", candidate);

  return (
    <>
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className="p-4 bg-edenPink-100 rounded-md mb-8 min-h-[3rem]">
          <p
            className={`${member?.letterAndColor?.totalMatchPerc?.color} text-3xl font-bold float-right -mt-2`}
          >
            {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
          </p>
          {candidate?.analysisCandidateEdenAI?.fitRequirements?.content && (
            <div className="">
              <h2 className="text-edenGreen-600 mb-3">Eden First Impression</h2>

              {candidate?.analysisCandidateEdenAI?.background?.content}
            </div>
          )}
        </div>
      )}

      {/* ---- Bio ---- */}
      <div className="mb-10">
        <div className="px-4 mb-4 border-b border-edenGreen-300">
          <h3 className="mb-3 text-edenGreen-500">Bio</h3>
        </div>
        <LongText
          cutText={600}
          text={(member?.user?.bio as string) || ""}
          className={`px-4 whitespace-pre-wrap text-sm text-edenGray-900 w-full`}
          maxHeight={"10rem"}
        />
      </div>

      {/* ---- Skills and other data ---- */}
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
