import { useQuery } from "@apollo/client";
import {
  FIND_COMPANY_FULL,
  MATCH_NODES_MEMBERS_AI4,
} from "@eden/package-graphql";
import { CandidateType, TalentListType } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Button,
  CandidateInfo,
  CandidatesTableList,
  Dropdown,
  GridItemSix,
  GridLayout,
  TrainQuestionsEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { MdIosShare } from "react-icons/md";

import { NextPageWithLayout } from "../_app";

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

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

const CompanyCRM: NextPageWithLayout = () => {
  const router = useRouter();
  const { companyID } = router.query;

  const [candidates, setCandidates] = useState<CandidateTypeSkillMatch[]>([]);

  const [nodeIDsCompany, setNodeIDsCompany] = useState<string[]>([]);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] = useState<number | null>(
    null
  );
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [trainModalOpen, setTrainModalOpen] = useState(false);

  const [talentListsAvailables, setTalentListsAvailables] = useState<
    TalentListType[]
  >([]);

  const [talentListSelected, setTalentListSelected] =
    useState<TalentListType>();

  const [candidatesFromTalentList, setCandidatesFromTalentList] = useState<
    CandidateTypeSkillMatch[]
  >([]);

  const {
    // data: findCompanyData,
    loading: findCompanyIsLoading,
    // error: findCompanyError,
  } = useQuery(FIND_COMPANY_FULL, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: !Boolean(companyID),
    ssr: false,
    onCompleted: (data: any) => {
      const talentListsNames: TalentListType[] =
        data.findCompany.talentList.map((list: TalentListType) => list);

      setTalentListsAvailables(talentListsNames);

      setCandidates(data.findCompany.candidates);

      setCandidatesFromTalentList(data.findCompany.candidates);

      const questionPrep: Question[] = [];

      data.findCompany.questionsToAsk.map((question: any) => {
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });

      const nodesID = data.findCompany?.nodes?.map((node: any) => {
        return node?.nodeData?._id;
      });

      setNodeIDsCompany(nodesID);

      setQuestions(questionPrep);
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
        nodesID: nodeIDsCompany,
        membersIDallow: candidates?.map((userData: any) => {
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
    skip: candidates.length == 0 || nodeIDsCompany.length == 0,

    onCompleted: (data) => {
      // from data.matchNodesToMembers_AI4 change it to an object with member._id as the key

      // -------------- Get the Candidates of the page ------------
      const memberScoreObj: { [key: string]: number } = {};

      data.matchNodesToMembers_AI4.forEach((memberT: any) => {
        const keyN = memberT?.member?._id;

        if (memberScoreObj[keyN] == undefined) {
          memberScoreObj[keyN] = memberT?.matchPercentage?.totalPercentage;
        }
      });

      const candidatesNew: CandidateTypeSkillMatch[] = [];

      for (let i = 0; i < candidates.length; i++) {
        const userID = candidates[i]?.user?._id;

        if (userID && memberScoreObj[userID]) {
          candidatesNew.push({
            ...candidates[i],
            skillMatch: memberScoreObj[userID],
          });
        }
      }
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
            node?.mostRelevantMemberNodes != undefined &&
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

  const handleTrainButtonClick = () => {
    setTrainModalOpen(true);
  };

  const handleCloseTrainModal = () => {
    setTrainModalOpen(false);
  };

  const handleSelectedTalentList = (list: TalentListType) => {
    console.log({ list });

    const candidatesOnTalentListSelected: CandidateTypeSkillMatch[] = [];

    for (let i = 0; i < candidates.length; i++) {
      for (let j = 0; j < list.talent!.length; j++) {
        if (candidates[i].user?._id === list.talent![j]!.user!._id) {
          candidatesOnTalentListSelected.push(candidates[i]);
        }
      }
    }

    setCandidatesFromTalentList(candidatesOnTalentListSelected);

    setTalentListSelected(list);
  };

  return (
    <GridLayout className="">
      <GridItemSix>
        <div className="grid grid-flow-row">
          <div className="grid grid-flow-col grid-cols-3">
            <div className="col-span-2 grid grid-flow-row grid-cols-2 grid-rows-1">
              <Dropdown
                items={talentListsAvailables}
                multiple={false}
                placeholder="No list selected"
                onSelect={handleSelectedTalentList}
                value={talentListSelected?.name || ""}
              />
              <>
                {!talentListSelected ? (
                  <Button className="mb-4 ml-auto" variant="secondary">
                    Create New List
                  </Button>
                ) : (
                  <div className="grid grid-cols-3 grid-rows-1 justify-items-center gap-4">
                    <MdIosShare
                      size={36}
                      className="mt-2 cursor-pointer rounded-full p-1 hover:border-2 hover:border-gray-500 "
                    />
                    <Button
                      className="mb-4 ml-auto pt-2"
                      variant="secondary"
                      size="md"
                    >
                      Edit
                    </Button>
                    <Button
                      className="mb-4 ml-auto min-w-fit"
                      variant="secondary"
                    >
                      Create New List
                    </Button>
                  </div>
                )}
              </>
            </div>
            <Button
              className="mb-4 ml-auto pt-2"
              variant="secondary"
              onClick={handleTrainButtonClick}
            >
              Train EdenAI AI
            </Button>
          </div>
          <CandidatesTableList
            candidatesList={candidatesFromTalentList}
            fetchIsLoading={findCompanyIsLoading}
            setRowObjectData={handleRowClick}
          />
          {trainModalOpen ? (
            <div className="fixed inset-0 z-30 overflow-y-auto">
              <div className="flex min-h-screen items-center justify-center px-4">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={handleCloseTrainModal}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-xl">
                  <TrainQuestionsEdenAI
                    questions={questions}
                    companyID={companyID}
                    setQuestions={setQuestions}
                    setTrainModalOpen={setTrainModalOpen}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </GridItemSix>
      <GridItemSix className="relative">
        <div className="scrollbar-hide my-4 ml-1 h-[calc(100vh-4rem)] w-[calc(100%+1rem)] overflow-y-scroll bg-white shadow-md">
          {selectedUserId ? (
            <CandidateInfo
              memberID={selectedUserId || ""}
              percentage={selectedUserScore}
              summaryQuestions={selectedUserSummaryQuestions}
              mostRelevantMemberNode={mostRelevantMemberNode}
            />
          ) : (
            <div className="w-full pt-20 text-center">
              <p className="text-gray-400">Select a candidate</p>
            </div>
          )}
        </div>
      </GridItemSix>
    </GridLayout>
  );
};

CompanyCRM.getLayout = (page: any) => <AppUserLayout>{page}</AppUserLayout>;

export default CompanyCRM;
