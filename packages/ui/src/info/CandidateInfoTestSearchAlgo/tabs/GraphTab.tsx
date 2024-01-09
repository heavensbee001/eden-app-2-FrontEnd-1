import {
  CandidateTypeSkillMatch,
  DynamicSearchMemberGraph,
  EdenIconExclamation,
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
      {candidate?.analysisCandidateEdenAI?.skills?.content && (
        <div className="bg-edenPink-100 mb-8 min-h-[3rem] rounded-md p-4">
          {member?.letterAndColor?.skill?.letter && (
            <div className="border-edenPink-300 float-right -mt-2 flex h-10 w-10 items-center justify-center rounded-full border-2 pb-[2px]">
              <span
                className={`${member?.letterAndColor?.totalMatchPerc?.color} text-3xl`}
              >
                {`${member?.letterAndColor?.skill?.letter}`}
              </span>
            </div>
          )}
          {candidate?.analysisCandidateEdenAI?.skills?.content && (
            <div className="">
              <div className="mb-3 flex items-center">
                <EdenIconExclamation className="mr-1 h-5 w-5  " />
                <h2 className="text-edenGreen-600">
                  Eden&apos;s{"  "}
                  <span className="font-Unica text-edenGray-900 text-md font-normal">
                    thoughts on skills
                  </span>
                </h2>
              </div>
              {candidate?.analysisCandidateEdenAI?.skills?.content}
            </div>
          )}
        </div>
      )}
      <div className="mt-2 h-[450px] w-full rounded-lg border-[1px] bg-white py-2">
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
