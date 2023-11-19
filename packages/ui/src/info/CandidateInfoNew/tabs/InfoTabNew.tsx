// import { Members } from "@eden/package-graphql/generated";
import {
  Badge,
  CandidateTypeSkillMatch,
  EdenIconExclamation,
  // LongText,
  NodeList,
  // SocialMediaComp,
  UserBackground,
} from "@eden/package-ui";
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

export const InfoTabNew: FC<Props> = ({
  member,
  mostRelevantMemberNode,
  candidate,
}) => {
  const [experienceOpen, setExperienceOpen] = useState<number | null>(null);

  return (
    <>
      {member?.letterAndColor?.totalMatchPerc?.letter &&
        candidate?.analysisCandidateEdenAI?.background?.content && (
          <div className="mb-4 rounded-lg bg-white p-4 content-none">
            <div className="mb-3 flex items-center">
              <div className="bg-edenPink-300 mr-1 flex h-8 w-8 items-center justify-center rounded-full align-baseline">
                <EdenIconExclamation className="h-5 w-5" />
              </div>

              <h2 className="text-edenGreen-600">
                {"Eden's first impression"}
              </h2>
            </div>
            <div className="text-md font-normal leading-[22.4px] tracking-[-1.9%]">
              {candidate?.analysisCandidateEdenAI?.background?.content}
            </div>
          </div>
        )}

      {/* ---- Bio ---- */}
      {/* <div className="mb-6">
        <div className="border-edenGreen-300 mb-4 border-b px-4">
          <h3 className="text-edenGreen-500 mb-3">Bio</h3>
        </div>
        <LongText
          cutText={600}
          text={(member?.user?.bio as string) || ""}
          className={`text-edenGray-900 w-full whitespace-pre-wrap px-4 text-sm`}
          maxHeight={"10rem"}
        />
      </div> */}

      {/* ---- Background ---- */}
      {member?.user?.previousProjects &&
      member?.user.previousProjects.length ? (
        <div className="mb-10">
          <div className="border-edenGreen-300 border-b px-4">
            <h3 className="text-edenGreen-500 mb-3">Background</h3>
          </div>
          <div className="px-4">
            <UserBackground
              background={member?.user.previousProjects || []}
              setExperienceOpen={setExperienceOpen!}
              experienceOpen={experienceOpen!}
            />
          </div>
        </div>
      ) : null}

      {/* ---- other data ---- */}
      <section className="mb-10 px-12">
        <div className="grid grid-cols-12 gap-4">
          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Level</h3>
            </div>
            <div className="px-4">
              {member?.user?.experienceLevel?.total ? (
                <Badge
                  className="!text-white"
                  color="#7FA294"
                  text={
                    member?.user.experienceLevel?.total <= 3
                      ? "Junior"
                      : member?.user.experienceLevel?.total <= 6
                      ? "Mid"
                      : "Senior"
                  }
                />
              ) : (
                <span className="font-bold">-</span>
              )}
            </div>
          </section>

          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Yearly rate</h3>
            </div>
            <div className="px-4">
              {member?.user?.budget?.perHour !== null &&
              member?.user?.budget?.perHour !== undefined &&
              member?.user.budget?.perHour >= 0 ? (
                <p className="">
                  <span className="font-bold">
                    ${member.user.budget.perHour}
                  </span>
                  /year
                </p>
              ) : (
                <span className="">-</span>
              )}
            </div>
          </section>

          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Availability</h3>
            </div>
            <p className="px-4">
              {member?.user?.hoursPerWeek
                ? `${member?.user.hoursPerWeek} hrs\\week`
                : "unavailable"}
            </p>
          </section>

          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Location</h3>
            </div>
            <p className="px-4">
              {member?.user?.location ? `${member?.user.location}` : "-"}
            </p>
          </section>

          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Timezone</h3>
            </div>
            <p className="px-4">
              {member?.user?.timeZone ? `${member?.user.timeZone}` : "-"}
            </p>
          </section>

          <section className="bg-edenPink-300 col-span-4 w-full rounded-md py-3">
            <div className="border-edenGreen-300 mb-2 border-b px-4">
              <h3 className="text-edenGreen-500 mb-1">Notice</h3>
            </div>
            <p className="px-4">2 Weeks {`(hardcoded)`}</p>
          </section>
        </div>
      </section>

      {/* ---- skills ---- */}
      <section className="mb-10">
        <div className="border-edenGreen-300 mb-2 border-b px-4">
          <h3 className="text-edenGreen-500 mb-3">Top Skills</h3>
        </div>
        {mostRelevantMemberNode &&
        member &&
        member?.user?._id &&
        Object.keys(mostRelevantMemberNode).length > 0 &&
        mostRelevantMemberNode[member?.user._id] ? (
          <>
            <div className="ml-4 flex-wrap">
              {mostRelevantMemberNode[member?.user._id].nodes
                .slice(0, 7)
                .map((node: NodeDisplay, index: number) => (
                  <Badge
                    text={node?.nameRelevantNode || ""}
                    key={index}
                    // className={`bg-soilPurple/20 py-px text-xs`}
                    // className={`px-2 py-1 text-white rounded ${getBackgroundColorClass(node.score)}`}
                    // className={`px-2 py-1 text-white rounded bg-purple-400`}
                    cutText={100}
                  />
                ))}
            </div>
          </>
        ) : (
          <div className="col-1 p-2">
            <div className="ml-4 inline-flex flex-wrap">
              {member?.user?.nodes && member?.user.nodes.length > 0 && (
                <NodeList overflowNumber={7} nodes={member?.user.nodes} />
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};
