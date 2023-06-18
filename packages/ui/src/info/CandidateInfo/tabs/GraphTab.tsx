import {
  CandidateTypeSkillMatch,
  DynamicSearchMemberGraph,
} from "@eden/package-ui";

interface Props {
  member: CandidateTypeSkillMatch;
}

export const GraphTab: React.FC<Props> = ({ member }: Props) => {
  if (!member) return null;

  return (
    <>
      {member?.letterAndColor?.skill?.letter && (
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
      )}
      <div className="mt-3 h-[500px] w-full">
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
