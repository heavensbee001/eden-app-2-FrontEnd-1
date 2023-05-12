import { useQuery } from "@apollo/client";
import { FIND_COMPANY_FULL } from "@eden/package-graphql";
import { CandidateType } from "@eden/package-graphql/generated";
import {
  AppUserLayout,
  Button,
  CandidateInfo,
  CandidatesTableList,
  GridItemSix,
  GridLayout,
  TrainQuestionsEdenAI,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { NextPageWithLayout } from "../_app";

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

const CompanyCRM: NextPageWithLayout = () => {
  const router = useRouter();
  const { companyID } = router.query;
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserScore, setSelectedUserScore] = useState<number | null>(
    null
  );
  const [selectedUserSummaryQuestions, setSelectedUserSummaryQuestions] =
    useState<any[]>([]);

  const [questions, setQuestions] = useState<Question[]>([]);

  const [trainModalOpen, setTrainModalOpen] = useState(false);
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
      setCandidates(data.findCompany.candidates);
      const questionPrep: Question[] = [];

      data.findCompany.questionsToAsk.map((question: any) => {
        console.log("question = ", question);
        if (question.question == null) {
        } else {
          questionPrep.push({
            _id: question.question._id,
            content: question.question.content,
            bestAnswer: question.bestAnswer,
          });
        }
      });

      setQuestions(questionPrep);
    },
  });

  const handleRowClick = (user: CandidateType) => {
    if (user.user?._id) setSelectedUserId(user.user?._id);
    if (user.overallScore) setSelectedUserScore(user.overallScore);
    if (user.summaryQuestions)
      setSelectedUserSummaryQuestions(user.summaryQuestions);
  };

  const handleTrainButtonClick = () => {
    setTrainModalOpen(true);
  };

  const handleCloseTrainModal = () => {
    setTrainModalOpen(false);
  };

  return (
    <GridLayout className="">
      <GridItemSix>
        <div className="">
          <Button
            className="mb-4 ml-auto"
            variant="secondary"
            onClick={handleTrainButtonClick}
          >
            Train EdenAI AI
          </Button>
          {/* <Button
            variant="secondary"
            onClick={() => {
              router.push(`/train-ai/${companyID}`);
            }}
          >
            Train AI
          </Button> */}
          <CandidatesTableList
            candidatesList={candidates}
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
                <div className="transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:w-full sm:max-w-lg">
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
        <div className="scrollbar-hide -my-4 ml-1 h-[calc(100vh-4rem)] w-[calc(100%+1rem)] overflow-y-scroll bg-white shadow-md">
          {selectedUserId ? (
            <CandidateInfo
              memberID={selectedUserId || ""}
              percentage={selectedUserScore}
              summaryQuestions={selectedUserSummaryQuestions}
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
