import { useQuery } from "@apollo/client";
import { FIND_NODES } from "@eden/package-graphql";
import { Maybe, Node, NodesType } from "@eden/package-graphql/generated";
import { Loading } from "@eden/package-ui";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";

import { SelectNodesBox } from "../SelectNodesBox";

export interface ISelectNodesProps {
  selectedNodes?: Maybe<Maybe<NodesType>[]>;
  nodeType: string;
  // onChangeNodeID?: React.Dispatch<React.SetStateAction<string[]>>;
  // eslint-disable-next-line no-unused-vars
  onChangeNodes?: (val: Maybe<Node | undefined>[]) => void;
}

export const SelectNodes = ({
  selectedNodes = [],
  nodeType,
  // onChangeNodeID,
  onChangeNodes,
}: ISelectNodesProps) => {
  const [nodes, setNodes] = useState<Maybe<Node | undefined>[]>(
    selectedNodes?.map((node) => node?.nodeData) || []
  );

  const { data: nodesData } = useQuery(FIND_NODES, {
    variables: {
      fields: {
        node: nodeType,
      },
    },
    context: { serviceName: "soilservice" },
    skip: !nodeType,
  });

  useEffect(() => {
    // console.log("change of state", nodes);
    if (onChangeNodes) onChangeNodes(nodes);
  }, [nodes]);

  return (
    <div className="flex w-full flex-wrap justify-center gap-1">
      {nodesData?.findNodes ? (
        !isEmpty(nodesData) &&
        nodesData?.findNodes?.map((item: Node, index: number) => {
          const _selectedNodes = nodes!.filter((node) =>
            node!?.aboveNodes?.some((aboveNode) => aboveNode?._id === item._id)
          );

          return (
            <SelectNodesBox
              multiple
              key={index}
              defaultValues={_selectedNodes}
              caption={item?.name || ""}
              items={item?.subNodes}
              onChange={(val: Maybe<Node | undefined>[]) => {
                if (onChangeNodes && nodes)
                  setNodes(
                    nodes && nodes.length > 0 ? [...nodes, ...val] : val
                  );
              }}
            />
          );
        })
      ) : (
        <Loading />
      )}
    </div>
  );
};
