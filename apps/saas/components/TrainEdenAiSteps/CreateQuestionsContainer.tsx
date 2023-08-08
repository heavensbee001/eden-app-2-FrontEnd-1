"use-client";

import { gql, useMutation } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Members, QuestionType } from "@eden/package-graphql/generated";
import { Button, EdenAiProcessingModalContained } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiPencil } from "react-icons/hi";
import { RiDeleteBin2Line } from "react-icons/ri";

// const ADD_QUESTIONS_TO_POSITION = gql`
//   mutation ($fields: addQuestionsToAskPositionInput) {
//     addQuestionsToAskPosition(fields: $fields) {
//       _id
//       name
//       candidates {
//         overallScore
//         user {
//           _id
//           discordName
//           discordAvatar
//         }
//       }
//       questionsToAsk {
//         bestAnswer
//         question {
//           _id
//           content
//         }
//       }
//     }
//   }
// `;

export const POSITION_SUGGEST_QUESTIONS = gql`
  mutation ($fields: positionSuggestQuestionsAskCandidateInput!) {
    positionSuggestQuestionsAskCandidate(fields: $fields) {
      success
      questionSuggest {
        question
        IDCriteria
        category
      }
    }
  }
`;

type QuestionSuggest = {
  question: string;
  IDCriteria?: string;
};

type QuestionGroupedByCategory = {
  [category: string]: QuestionSuggest[];
};

interface QuestionSuSQL {
  category: string;
  question: string;
  IDCriteria: string;
}

interface ICreateQuestions {
  // eslint-disable-next-line no-unused-vars
  onChange: (data: QuestionType[]) => void;
}

export const CreateQuestions = ({ onChange }: ICreateQuestions) => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();

  // const [scraping, setScraping] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [editQuestionIndex, setEditQuestionIndex] =
    useState<number | null>(null);
  // const [scrapingSave, setScrapingSave] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionGroupedByCategory>({});

  useEffect(() => {
    setEditQuestionIndex(null);
  }, [index]);

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number,
    category: string
  ): void => {
    const { name, value } = event.target;

    setQuestions((prevQuestions) => {
      const newQuestions: QuestionGroupedByCategory = { ...prevQuestions };

      newQuestions[category] = newQuestions[category].map((question, i) => {
        if (i === index) {
          return {
            ...question,
            [name]: value,
          };
        }
        return question;
      });

      return newQuestions;
    });
  };

  const handleAddQuestion = (category: string) => {
    setEditQuestionIndex(questions[category].length);
    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: [
        ...prevQuestions[category],
        { question: "", IDCriteria: `b${prevQuestions[category].length + 1}` },
      ],
    }));
  };

  const handleDeleteQuestion = (category: string, position: number) => {
    const _newArr = [...questions[category]];

    _newArr.splice(position, 1);

    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: _newArr,
    }));
  };

  const handleEditQuestion = (position: number) => {
    setEditQuestionIndex(position);
  };

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  const { positionID } = router.query;

  const [positionSuggestQuestionsAskCandidate, { loading: loadingQuestions }] =
    useMutation(POSITION_SUGGEST_QUESTIONS, {
      onCompleted({ positionSuggestQuestionsAskCandidate }) {
        // console.log(
        //   "positionSuggestQuestionsAskCandidate = ",
        //   positionSuggestQuestionsAskCandidate
        // );

        // setScraping(false);

        // setQuestions(positionSuggestQuestionsAskCandidate.questionSuggest);

        const questionsWithCategory: QuestionGroupedByCategory = {};

        positionSuggestQuestionsAskCandidate.questionSuggest.forEach(
          (q: QuestionSuSQL) => {
            if (questionsWithCategory[q.category] == undefined) {
              questionsWithCategory[q.category] = [];
            }

            questionsWithCategory[q.category].push({
              question: q.question,
              IDCriteria: q.IDCriteria,
            });
          }
        );

        // console.log("questionsWithCategory = ", questionsWithCategory);
        setQuestions(questionsWithCategory);
      },
    });

  // // eslint-disable-next-line no-unused-vars
  // const handleClick = () => {
  //   console.log("change =");

  //   setScraping(true);

  //   positionSuggestQuestionsAskCandidate({
  //     variables: {
  //       // fields: { message: textResponse, userID: currentUser?._id },
  //       fields: {
  //         positionID: positionID,
  //       },
  //     },
  //   });
  // };

  useEffect(() => {
    // setScraping(true);

    positionSuggestQuestionsAskCandidate({
      variables: {
        // fields: { message: textResponse, userID: currentUser?._id },
        fields: {
          positionID: positionID,
        },
      },
    });
    // return () => {
    //   setScraping(false);
    // };
  }, []);

  // console.log("questionsSuggest = ", questionsSuggest);

  // const [updateQuestionsPosition] = useMutation(ADD_QUESTIONS_TO_POSITION, {
  //   // eslint-disable-next-line no-unused-vars
  //   onCompleted({ updateNodesToMember }: Mutation) {
  //     // console.log("updateNodesToMember = ", updateNodesToMember);
  //     setScrapingSave(false);
  //   },
  //   // skip: positionID == "" || positionID == null,
  // });

  // const handleSaveChanges = () => {
  //   let positionID_ = "";

  //   if (Array.isArray(positionID)) {
  //     if (positionID.length > 0) {
  //       positionID_ = positionID[0];
  //     }
  //   } else {
  //     if (positionID != undefined) {
  //       positionID_ = positionID;
  //     }
  //   }
  //   if (positionID_ != "") {
  //     setScrapingSave(true);

  //     const questionsToAsk: any[] = [];

  //     // Object.keys(questions).forEach((category) => {
  //     for (const category in questions) {
  //       const categoryQuestions = questions[category];

  //       for (let j = 0; j < categoryQuestions.length; j++) {
  //         const question = categoryQuestions[j];

  //         questionsToAsk.push({
  //           questionContent: question.question,
  //           bestAnswer: "",
  //         });
  //       }
  //     }
  //     updateQuestionsPosition({
  //       variables: {
  //         fields: {
  //           positionID: positionID_,
  //           questionsToAsk: questionsToAsk,
  //         },
  //       },
  //     });
  //   }
  // };

  useEffect(() => {
    const _mappedQuestions: QuestionType[] = [];

    for (const category in questions) {
      const categoryQuestions = questions[category];

      for (let j = 0; j < categoryQuestions.length; j++) {
        const question = categoryQuestions[j];

        _mappedQuestions.push({
          question: { _id: question.IDCriteria, content: question.question },
          bestAnswer: "",
        });
      }
    }

    onChange(_mappedQuestions);
  }, [questions]);

  return (
    <div className="w-full">
      {loadingQuestions && (
        <EdenAiProcessingModalContained
          open={loadingQuestions}
          title="Generating optimal interview"
        >
          <div className="text-center">
            <p>
              {`I've done 1000s of interviews and I'm currently cross-referencing the best seed questions to ask based on everything you've just told me. You'll be able to add, delete & adapt of course!`}
            </p>
          </div>
        </EdenAiProcessingModalContained>
      )}
      {/* <Button
        className="absolute bottom-8 right-8 z-30 mx-auto"
        variant={"primary"}
        loading={scrapingSave}
        onClick={() => handleSaveChanges()}
      >
        Save Changes
      </Button> */}
      <div className="">
        <Tab.Group
          defaultIndex={index}
          onChange={(index: number) => {
            setIndex(index);
          }}
        >
          <Tab.List className="border-edenGreen-300 flex h-8 w-full border-b">
            {Object.keys(questions).map((category, _index) => (
              <Tab
                key={_index}
                className={({ selected }) =>
                  classNames(
                    "text-edenGreen-400 scrollbar-hide -mb-px overflow-x-scroll whitespace-nowrap px-3 pb-2 text-xs",
                    selected
                      ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                      : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                  )
                }
              >
                {category.toUpperCase()}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {Object.keys(questions).map((category, _index) => (
              <Tab.Panel key={_index}>
                <div className="px-4 py-4">
                  {questions[category].map((question, __index) => (
                    <div
                      key={`${category}_${__index}`}
                      className="relative mb-3 flex"
                    >
                      <textarea
                        name="question"
                        disabled={editQuestionIndex !== __index}
                        defaultValue={question.question.toString()}
                        onChange={(event) =>
                          handleQuestionChange(event, __index, category)
                        }
                        className={classNames(
                          "w-10/12 resize-none bg-transparent px-2",
                          editQuestionIndex === __index
                            ? "border-edenGray-200 border-box rounded-md border"
                            : ""
                        )}
                      />
                      <Button
                        variant="tertiary"
                        onClick={() => {
                          handleEditQuestion(__index);
                        }}
                        className="bg-edenGreen-200 hover:bg-edenGreen-100 hover:text-edenGreen-400 text-edenGreen-500 ml-auto flex h-6 w-6 items-center justify-center rounded-md !p-0"
                      >
                        <HiPencil size={16} />
                      </Button>
                      <Button
                        variant="tertiary"
                        onClick={() => handleDeleteQuestion(category, __index)}
                        className="!bg-edenPink-300 text-utilityRed ml-2 flex h-6 w-6 items-center justify-center rounded-md !p-0 hover:opacity-60"
                      >
                        <RiDeleteBin2Line size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="tertiary"
                  onClick={() => handleAddQuestion(category)}
                  className="float-right text-sm"
                >
                  + Add a Question
                </Button>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
