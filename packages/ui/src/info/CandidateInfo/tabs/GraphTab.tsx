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
      {member?.letterAndColor?.totalMatchPerc?.letter && (
        <div className="  mt-4 flex  items-center  ">
          <div className=" flex items-center rounded-lg border-[1px] border-gray-300 bg-white px-4 py-4 ">
            <p
              className={`${member?.letterAndColor?.totalMatchPerc?.color} text-4xl font-black`}
            >
              {`${member?.letterAndColor?.totalMatchPerc?.letter}`}
            </p>
            {candidate?.analysisCandidateEdenAI?.background?.content && (
              <>
                <hr className="mx-2 my-0 h-8 border-gray-400" />
                <div className="">
                  <p className="text-lg font-bold">Eden First Impression 👀</p>

                  {candidate?.analysisCandidateEdenAI?.background?.content}
                </div>
              </>
            )}
          </div>
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
