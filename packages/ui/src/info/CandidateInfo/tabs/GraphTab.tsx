import { Members } from "@eden/package-graphql/generated";
import { DynamicSearchMemberGraph } from "@eden/package-ui";

interface Props {
  member: Members;
  selectedUserScoreLetter?: any;
}

export const GraphTab: React.FC<Props> = ({
  member,
  selectedUserScoreLetter,
}: Props) => {
  if (!member) return null;

  return (
    <>
      {selectedUserScoreLetter?.skill?.letter && (
        <div className="relative">
          <div className="absolute left-0 top-0 rounded-lg bg-white px-4 py-6 shadow-lg">
            <p className="text-lg font-bold">Skill Score:</p>
            <p
              className={` ${selectedUserScoreLetter?.skill?.color} text-4xl font-black`}
            >
              {`${selectedUserScoreLetter?.skill?.letter}`}
            </p>
          </div>
        </div>
      )}
      <div className="mt-3 h-[500px] w-full">
        <DynamicSearchMemberGraph
          memberID={member._id!}
          nodesID={member.nodes?.map((_node) => _node?.nodeData?._id!) || []}
          disableZoom={true}
          graphType={"KG_AI2"}
        />
      </div>
    </>
  );
};
