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
    <>
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
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className="relative flex items-center">
          <div className="absolute left-0 top-0 flex items-center rounded-lg bg-white px-4 py-6 shadow-lg">
            <p className="mr-4 text-lg font-bold">Total Score:</p>
            <p
              className={`${member?.letterAndColor?.totalMatchPerc?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
            </p>
            {candidate?.analysisCandidateEdenAI?.skills?.content && (
              <>
                <hr className="mx-4 my-0 h-8 border-gray-400" />
                <div>
                  <p className="text-lg font-bold">
                    Eden’s Thoughts on Skill Match 🤲
                  </p>
                  <p className="text-sm">
                    {candidate?.analysisCandidateEdenAI?.skills?.content
                      ?.length > 300
                      ? `${candidate?.analysisCandidateEdenAI?.skills?.content?.substr(
                          0,
                          300
                        )}...`
                      : candidate?.analysisCandidateEdenAI?.skills?.content}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="mt-3 h-[900px] w-full py-36">
        <DynamicSearchMemberGraph
          memberID={member?.user?._id!}
          nodesID={
            member?.user?.nodes?.map((_node) => _node?.nodeData?._id!) || []
          }
          disableZoom={true}
          graphType={"KG_AI2"}
        />
      </div>
    </>
  );
};
