import { useQuery } from "@apollo/client";
import {
  FIND_POSITION_LIGHT,
  FIND_TALENT_LIST,
  MATCH_NODES_MEMBERS_AI4,
} from "@eden/package-graphql";
import { CandidateType, TalentListType } from "@eden/package-graphql/generated";
import {
  CandidateInfo,
  CandidatesTableList,
  ListModeEnum,
  Question,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { NextPageWithLayout } from "../_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface CandidateTypeSkillMatch extends CandidateType {
  skillMatch: number;
}

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

const TalentListPublicPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { talentListID } = router.query;

  const [positionID, setPositionID] = useState<string | null>(null);

  const [candidates, setCandidates] = useState<CandidateTypeSkillMatch[]>([]);

  const [nodeIDsPosition, setNodeIDsPosition] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] = useState<number | null>(
    null
  );
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const [currentTalentList, setCurrentTalentList] = useState<TalentListType>();

  const {
    // data: findPositionData,
    loading: findPositionIsLoading,
    // error: findPositionError,
  } = useQuery(FIND_POSITION_LIGHT, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !Boolean(positionID),
    ssr: false,
    onCompleted: (data: any) => {
      setCandidates(data.findPosition.candidates);

      setCandidatesFromTalentList(data.findPosition.candidates);

      const questionPrep: Question[] = [];

      data.findPosition.questionsToAsk.map((question: any) => {
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });

      const nodesID = data.findPosition?.nodes?.map((node: any) => {
        return node?.nodeData?._id;
      });

      setNodeIDsPosition(nodesID);
    },
  });

  const {} = useQuery(FIND_TALENT_LIST, {
    variables: {
      fields: {
        _id: talentListID,
      },
    },
    skip: !Boolean(talentListID),
    ssr: false,
    onCompleted: (data: any) => {
      setPositionID(data.findUserTalentListPosition.positionID);
      setCandidates(data.findUserTalentListPosition.talent);
      setCurrentTalentList(data.findUserTalentListPosition);

      setCandidatesFromTalentList(data.findUserTalentListPosition.talent);
    },
  });

  const handleRowClick = (user: CandidateType) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.overallScore) setSelectedUserScore(user.overallScore);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);
  };

  const [mostRelevantMemberNode, setMostRelevantMemberNode] =
    useState<relevantNodeObj>({});

  const {} = useQuery(MATCH_NODES_MEMBERS_AI4, {
    variables: {
      fields: {
        nodesID: nodeIDsPosition,
        membersIDallow: candidatesFromTalentList?.map((userData: any) => {
          return userData?.user?._id;
        }),
        weightModules: [
          { type: "node_Skill", weight: 70 },
          { type: "node_Category", weight: 20 },
          { type: "node_Group", weight: 5 },
          { type: "node_total", weight: 50 },
          { type: "budget_total", weight: 80 },
          { type: "availability_total", weight: 85 },
          { type: "experience_total", weight: 85 },
          { type: "everythingElse_total", weight: 50 },
        ],
      },
    },
    skip: candidatesFromTalentList.length === 0 || nodeIDsPosition.length === 0,
    ssr: false,
    onCompleted: (data) => {
      // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

      // -------------- Get the Candidates of the page ------------
      const memberScoreObj: { [key: string]: number } = {};

      data.matchNodesToMembers_AI4.forEach((memberT: any) => {
        const keyN = memberT?.member?._id;

        if (memberScoreObj[keyN] == undefined) {
          console.log(keyN + " was undefined");
          memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
        }
      });

      const candidatesNew: CandidateTypeSkillMatch[] = [];

      for (let i = 0; i < candidatesFromTalentList.length; i++) {
        const userID = candidatesFromTalentList[i]?.user?._id;

        if (userID && memberScoreObj[userID]) {
          console.log({ userID, mem: memberScoreObj[userID] });
          candidatesNew.push({
            ...candidatesFromTalentList[i],
            skillMatch: memberScoreObj[userID],
          });
        } else {
          candidatesNew.push({
            ...candidatesFromTalentList[i],
          });
        }
      }
      setCandidatesFromTalentList(candidatesNew);
      setCandidates(candidatesNew);
      // -------------- Get the Candidates of the page ------------

      // --------------- Find the related nodes Score and color -----------

      const mostRelevantMemberNodeT: relevantNodeObj = {};

      for (let i = 0; i < data?.matchNodesToMembers_AI4?.length; i++) {
        const infoN = data.matchNodesToMembers_AI4[i];

        const userID: string = infoN?.member?._id;

        if (userID && !mostRelevantMemberNodeT[userID]) {
          mostRelevantMemberNodeT[userID] = {
            nodes: [],
          };
        }

        const nodesPercentageT = infoN?.nodesPercentage;

        const nodesNew: NodeDisplay[] = [];

        interface RelevantMemberObj {
          [key: string]: boolean;
        }
        const mostRelevantMemberObj: RelevantMemberObj = {};

        const mostRelevantMemberNodes = [];

        for (let j = 0; j < nodesPercentageT?.length; j++) {
          const node = nodesPercentageT[j];

          // Take only the first mostRelevantMemberNodes, which has the heighers probability, later I can be more creative
          let mostRelevantMemberNode = null;

          if (
            node?.mostRelevantMemberNodes !== undefined &&
            node?.mostRelevantMemberNodes?.length > 0
          ) {
            let i = 0;
            let relNode;

            while (
              mostRelevantMemberNode == null &&
              i < node?.mostRelevantMemberNodes.length
            ) {
              relNode = node?.mostRelevantMemberNodes[i];

              if (
                relNode?.node?._id != undefined &&
                !mostRelevantMemberObj[relNode?.node?._id]
              ) {
                mostRelevantMemberNode = relNode;
                mostRelevantMemberObj[relNode?.node?._id] = true;
              } else {
                i++;
              }
            }

            if (mostRelevantMemberNode == null) continue;
          }

          let colorT = "bg-purple-100";

          if (
            mostRelevantMemberNode?.score != null &&
            mostRelevantMemberNode?.score != undefined
          ) {
            if (mostRelevantMemberNode?.score > 60) {
              colorT = "bg-purple-500";
            } else if (mostRelevantMemberNode?.score > 30) {
              colorT = "bg-purple-400";
            } else if (mostRelevantMemberNode?.score > 13) {
              colorT = "bg-purple-300";
            } else if (mostRelevantMemberNode?.score > 5) {
              colorT = "bg-purple-200";
            }
          }

          mostRelevantMemberNodes.push({
            searchNode: node?.node,
            MemberRelevantnode: mostRelevantMemberNode?.node,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });

          nodesNew.push({
            nameOriginalNode: nodesPercentageT[j]?.node?.name,
            nameRelevantNode: mostRelevantMemberNode?.node?.name,
            score: mostRelevantMemberNode?.score,
            color: colorT,
          });
        }

        nodesNew.sort((a, b) => b.score - a.score); // sort based on score

        mostRelevantMemberNodeT[userID].nodes = nodesNew;
      }

      setMostRelevantMemberNode(mostRelevantMemberNodeT);

      // --------------- Find the related nodes Score and color -----------
    },
  });

  return (
    <div className="bg-background container mx-auto max-w-screen-2xl flex-grow px-2 py-4 sm:px-5">
      <div
        className={classNames(
          `z-20 transition-all duration-200 ease-in-out`,
          selectedUserId ? "w-[calc(50%-1rem)]" : "w-full"
        )}
      >
        <div className="mb-4 flex h-10 items-center">
          <h1 className="mr-6 text-2xl font-medium">
            {currentTalentList?.name
              ? `Talent List: ${currentTalentList?.name}`
              : "Talent List"}
          </h1>
        </div>
        <div className="grid grid-flow-row">
          <CandidatesTableList
            candidateIDRowSelected={selectedUserId || null}
            candidatesList={candidatesFromTalentList}
            fetchIsLoading={findPositionIsLoading}
            setRowObjectData={handleRowClick}
            listMode={ListModeEnum.list}
          />
        </div>
      </div>
      <div
        className={classNames(
          "absolute right-0 top-0 z-20 transform overflow-y-scroll transition-all duration-200 ease-in-out",
          selectedUserId ? "w-[50vw]" : "w-0"
        )}
      >
        <div className="scrollbar-hide h-[calc(100vh-4rem)] overflow-y-scroll bg-white shadow-md">
          {/* {selectedUserId ? ( */}
          <CandidateInfo
            key={selectedUserId || ""}
            memberID={selectedUserId || ""}
            percentage={selectedUserScore}
            summaryQuestions={selectedUserSummaryQuestions}
            mostRelevantMemberNode={mostRelevantMemberNode}
            candidate={candidates?.find(
              (candidate) =>
                candidate?.user?._id?.toString() == selectedUserId?.toString()
            )}
            onClose={() => {
              setSelectedUserId(null);
            }}
          />
          {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
        </div>
      </div>
      <div
        className={classNames(
          "absolute right-0 top-0 z-20 transform overflow-y-scroll transition-all duration-200 ease-in-out",
          router.query.candidate1 && router.query.candidate2
            ? "w-[100vw]"
            : "w-0"
        )}
      >
        {router.query.candidate1 && router.query.candidate2 && (
          <>
            <div className="scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll border-r border-gray-300 bg-white">
              {/* {router.query.candidate1 ? ( */}
              <CandidateInfo
                key={(router.query.candidate1 as string) || ""}
                memberID={(router.query.candidate1 as string) || ""}
                percentage={selectedUserScore}
                summaryQuestions={selectedUserSummaryQuestions}
                mostRelevantMemberNode={mostRelevantMemberNode}
                candidate={candidates?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    router.query.candidate1?.toString()
                )}
                onClose={() => {
                  router.push(
                    {
                      pathname: "/dashboard/" + positionID,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
              {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
            </div>
            <div className="scrollbar-hide relative inline-block h-[calc(100vh-4rem)] w-1/2 overflow-y-scroll bg-white">
              {/* {router.query.candidate2 ? ( */}
              <CandidateInfo
                key={(router.query.candidate2 as string) || ""}
                memberID={(router.query.candidate2 as string) || ""}
                percentage={selectedUserScore}
                summaryQuestions={selectedUserSummaryQuestions}
                mostRelevantMemberNode={mostRelevantMemberNode}
                candidate={candidates?.find(
                  (candidate) =>
                    candidate?.user?._id?.toString() ==
                    router.query.candidate2?.toString()
                )}
                onClose={() => {
                  router.push(
                    {
                      pathname: "/dashboard/" + positionID,
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              />
              {/* ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TalentListPublicPage;
