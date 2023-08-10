import { gql, useMutation } from "@apollo/client";
import { Mutation } from "@eden/package-graphql/generated";
import { Dispatch, SetStateAction, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";

import { Button } from "../../elements";

const ADD_QUESTIONS_TO_POSITION = gql`
  mutation ($fields: addQuestionsToAskPositionInput) {
    addQuestionsToAskPosition(fields: $fields) {
      _id
      name
      candidates {
        overallScore
        user {
          _id
          discordName
          discordAvatar
        }
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
          category
        }
      }
    }
  }
`;

export type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

type Props = {
  questions: Question[];
  positionID?: string | string[] | undefined;
  // eslint-disable-next-line no-unused-vars
  setQuestions: Dispatch<SetStateAction<any[]>>;
  // eslint-disable-next-line no-unused-vars
  setTrainModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const TrainQuestionsEdenAI = ({
  questions = [],
  positionID,
  setQuestions,
  setTrainModalOpen,
}: Props) => {
  const [updateQuestionsPosition] = useMutation(ADD_QUESTIONS_TO_POSITION, {
    onCompleted({ updateNodesToMember }: Mutation) {
      console.log("updateNodesToMember = ", updateNodesToMember);
    },
    // skip: positionID == "" || positionID == null,
  });

  const [newQuestion, setNewQuestion] = useState("");

  const handleQuestionAdd = () => {
    if (newQuestion.trim() !== "") {
      // const newId = questions.length + 1;
      const newId = "";

      setQuestions([
        ...questions,
        { _id: newId, content: newQuestion, bestAnswer: "" },
      ]);
      setNewQuestion("");
    }
  };

  const handleSaveChanges = () => {
    let positionID_ = "";

    if (Array.isArray(positionID)) {
      if (positionID.length > 0) {
        positionID_ = positionID[0];
      }
    } else {
      if (positionID != undefined) {
        positionID_ = positionID;
      }
    }
    if (positionID_ != "") {
      updateQuestionsPosition({
        variables: {
          fields: {
            positionID: positionID_,
            questionsToAsk: questions.map((question) => {
              if (question._id) {
                return {
                  questionID: question._id,
                  bestAnswer: question.bestAnswer,
                  questionContent: question.content,
                };
              } else {
                return {
                  bestAnswer: question.bestAnswer,
                  questionContent: question.content,
                };
              }
            }),
          },
        },
      });
    }
    setTrainModalOpen(false);
  };

  return (
    <div className="scrollbar-hide h-[70vh] overflow-y-scroll p-6 pb-32">
      <h1 className="mb-4 text-2xl font-bold">Train Questions for Eden AI</h1>
      <ul className="space-y-2">
        {questions.map((question) => (
          <li key={question._id}>
            <p className="font-bold text-slate-600">{question.content}</p>
            <input
              type="text"
              className="mb-2 w-full rounded border px-2 py-1"
              placeholder="Enter the preferred answer"
              value={question.bestAnswer}
              onChange={(e) => {
                const newQuestions = [...questions];
                const index = newQuestions.findIndex(
                  (q) => q._id === question._id
                );

                newQuestions[index].bestAnswer = e.target.value;
                setQuestions(newQuestions);
              }}
            />
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 right-0 z-20 w-full bg-white px-6 pb-6">
        <div className="mb-4 mt-4 flex w-full items-center">
          <input
            type="text"
            className="mr-2 w-[calc(100%-3rem)] rounded border px-2 py-1"
            placeholder="Enter a new question"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />

          <BsPlusCircleFill
            size={28}
            className="ml-auto cursor-pointer text-blue-500 hover:text-blue-400"
            onClick={handleQuestionAdd}
          />
        </div>
        <Button
          className="mx-auto"
          variant={"primary"}
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
