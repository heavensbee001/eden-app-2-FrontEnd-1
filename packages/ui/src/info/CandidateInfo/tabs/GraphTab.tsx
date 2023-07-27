import {
  CandidateTypeSkillMatch,
  DynamicSearchMemberGraph,
} from "@eden/package-ui";

interface Props {
  member: CandidateTypeSkillMatch;
  candidate?: any;
}

export const GraphTab: React.FC<Props> = ({ member, candidate }: Props) => {
  if (!member) return null;

  return (
    <div className="flex flex-col items-center ">
      {/* {member?.letterAndColor?.skill?.letter && (
        <div className="relative">
          <div className="absolute left-0 top-0 rounded-lg bg-white px-4 py-6 shadow-lg">
            <p className="text-lg font-bold">Skill Score:</p>
            <p
              className={` ${member?.letterAndColor?.skill?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.skill?.letter}`}
            </p>
          </div>
        </div>
      )} */}
      {member?.letterAndColor?.skill?.letter && (
        <div className="bg-edenPink-100 mb-8 min-h-[3rem] rounded-md p-4">
          <p
            className={`${member?.letterAndColor?.skill?.color} float-right -mt-2 text-3xl`}
          >
            {`${member?.letterAndColor?.skill?.letter}`}
          </p>
          {candidate?.analysisCandidateEdenAI?.fitRequirements?.content && (
            <div className="">
              <h2 className="text-edenGreen-600 mb-3">
                Eden&apos;s thoughts on skills
              </h2>

              {candidate?.analysisCandidateEdenAI?.fitRequirements?.content}
            </div>
          )}
        </div>
      )}
      <div className="mt-2 h-[900px] w-full rounded-lg border-[1px] bg-white py-36">
        <DynamicSearchMemberGraph
          memberID={member?.user?._id!}
          nodesID={
            member?.user?.nodes?.map((_node) => _node?.nodeData?._id!) || []
          }
          disableZoom={true}
          graphType={"KG_AI2"}
        />
      </div>
    </div>
  );
};
