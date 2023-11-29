"use-client";

import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, EdenAiProcessingModal, Modal } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { RiDeleteBin2Line } from "react-icons/ri";

export const FIND_SCORE_CARDS = gql`
  query FindCardMemories($fields: findCardMemoriesInput) {
    findCardMemories(fields: $fields) {
      _id
      content
      scoreCriteria
      authorCard {
        userID
      }
      type
      priority
    }
  }
`;

export const ADD_EDIT_SCORE_CARDS = gql`
  mutation EditCardMemory($fields: editCardMemoryInput) {
    editCardMemory(fields: $fields) {
      _id
      content
      scoreCriteria
      connectedCards {
        card {
          _id
          content
        }
      }
    }
  }
`;

export const DELETE_SCORE_CARD = gql`
  mutation DeleteCardMemory($fields: deleteCardMemoryInput) {
    deleteCardMemory(fields: $fields) {
      _id
      content
    }
  }
`;

type QuestionSuggest = {
  content: string;
  authorCard?: { userID: string };
  scoreCriteria?: string;
  priority: number;
  type: string;
  _id: string;
};

type QuestionGroupedByCategory = {
  [category: string]: QuestionSuggest[];
};

type BatchCardType = {
  cardMemoryID?: string;
  content: string;
  scoreCriteria: string;
  type?: string;
  priority?: number;
};

interface Category {
  name: string;
  bullets: string[];
}

interface IProfileQuestionsContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
  // eslint-disable-next-line no-unused-vars
  onLastStep: (isLastStep: boolean) => void;
}

export const ProfileQuestionsContainer = ({
  onChange,
  onLastStep,
}: IProfileQuestionsContainerProps) => {
  // const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const editTextareaRef = useRef(null);

  const types = ["TECHNICAL_SKILLS", "BEHAVIOR", "EXPERIENCE", "CORE_VALUES"];

  const [index, setIndex] = useState<number>(0);
  const [editQuestionIndex, setEditQuestionIndex] = useState<number | null>(
    null
  );
  const [isAddQuestion, setIsAddQuestion] = useState<boolean>(false);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState<number | null>(
    null
  );
  const [questions, setQuestions] = useState<QuestionGroupedByCategory>({});
  const [originalQuestions, setOriginalQuestions] =
    useState<QuestionGroupedByCategory>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const { positionID } = router.query;

  const [deleteScoreCardMutation] = useMutation(DELETE_SCORE_CARD);
  const [addEditScoreCardsMutation] = useMutation(ADD_EDIT_SCORE_CARDS, {
    onCompleted: () => {
      setSubmitting(false);
      console.log("Success");
      setIndex(index + 1);
    },
    onError: () => {
      setIndex(index + 1);
      console.log("Failure");
      setSubmitting(false);
    },
  });

  const useOutside = (ref: any, callback: any) => {
    useEffect(() => {
      const handleClickOutside = (event: { target: any }) => {
        if (ref.current && !ref.current.contains(event.target)) callback();
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [callback, ref]);
  };

  useOutside(editTextareaRef, () => {
    if (isAddQuestion && editQuestionIndex) {
      const _newArr = [...questions[types[index]]];

      if (_newArr[editQuestionIndex].content === "") {
        _newArr.splice(editQuestionIndex, 1);

        setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
          ...prevQuestions,
          [types[index]]: _newArr,
        }));
      }
    }
    setEditQuestionIndex(null);
  });

  const { loading: findScorecardsLoading } = useQuery(FIND_SCORE_CARDS, {
    variables: {
      fields: {
        positionID: positionID,
      },
    },
    skip: !positionID,
    onCompleted: (data) => {
      const categoriesObj: QuestionGroupedByCategory = {};

      types.map((type) =>
        (categoriesObj[type] = data?.findCardMemories?.filter(
          (cardMemory: QuestionSuggest) => cardMemory.type === type
        )).sort(
          (a: QuestionSuggest, b: QuestionSuggest) => a.priority - b.priority
        )
      );

      const categories: Category[] = [];

      types.map((type) =>
        categories.push({
          name: type,
          bullets: categoriesObj[type].map((question) => question.content),
        })
      );
      setCategories(categories);
      setQuestions(categoriesObj);
      setOriginalQuestions(categoriesObj);
    },
  });

  useEffect(() => {
    setEditQuestionIndex(null);
  }, [index]);

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    setQuestions((prevQuestions) => {
      const newQuestions: QuestionGroupedByCategory = { ...prevQuestions };

      newQuestions[types[index]] = newQuestions[types[index]].map(
        (question, i) => {
          if (i === editQuestionIndex) {
            return {
              ...question,
              [name]: value,
            };
          }
          return question;
        }
      );

      return newQuestions;
    });
  };

  const handleAddQuestion = (category: string) => {
    setEditQuestionIndex(questions[category].length);
    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: [
        ...prevQuestions[category],
        {
          content: "",
          scoreCriteria: `b${prevQuestions[category].length + 1}`,
          authorCard: { userID: "string" },
          priority: 3,
          type: category,
          _id: "",
        },
      ],
    }));
  };

  const handleDeleteQuestion = () => {
    if (deleteQuestionIndex !== null) {
      const _newArr = [...questions[types[index]]];

      _newArr.splice(deleteQuestionIndex, 1);

      setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
        ...prevQuestions,
        [types[index]]: _newArr,
      }));
      deleteScoreCardMutation({
        variables: {
          fields: {
            _id: questions[types[index]][deleteQuestionIndex]._id,
          },
        },
      });

      setIsDeleteModalOpen(false);
      setDeleteQuestionIndex(null);
    }
  };

  const handleEditQuestion = (position: number) => {
    setEditQuestionIndex(position);
  };

  const handleSaveChanges = () => {
    if (!submitting) {
      setSubmitting(true);
      const batchCards: BatchCardType[] = [];

      questions[types[index]].map((question) => {
        if (question._id === "") {
          batchCards.push({
            content: question.content,
            scoreCriteria: "",
            type: types[index],
            priority: 3,
          });
        } else if (
          originalQuestions[types[index]].filter(
            (oriQuestion) =>
              oriQuestion._id === question._id &&
              oriQuestion.content !== question.content
          ).length > 0
        ) {
          batchCards.push({
            cardMemoryID: question._id,
            content: question.content,
            scoreCriteria: "",
          });
        }
      });

      addEditScoreCardsMutation({
        variables: {
          fields: {
            positionID,
            updateCandidatesPosition: true,
            batchCards,
          },
        },
      });
    }
  };

  useEffect(() => {
    onChange(convertCategoryToText(categories, questions));
  }, [categories, questions]);

  useEffect(() => {
    if (index === Object.keys(questions).length - 1) {
      onLastStep(true);
    } else {
      onLastStep(false);
    }
  }, [index]);

  return (
    <div className="relative mt-6 w-full pt-3">
      {findScorecardsLoading && (
        <EdenAiProcessingModal
          open={findScorecardsLoading}
          title="Compiling candidate checklist"
        >
          <div className="text-center">
            <p>{`These are the criteria you & I will use to benchmark all of the candidates. I'm generating this list based on everything you've just told me prior - of course you'll be able to add, delete & edit!`}</p>
          </div>
        </EdenAiProcessingModal>
      )}
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        closeOnEsc
      >
        <p className="text-md">
          Are you sure you want to delete this question?
        </p>
        <div className="flex flex-row justify-end gap-3">
          <Button
            variant="default"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setDeleteQuestionIndex(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleDeleteQuestion()}>
            Delete
          </Button>
        </div>
      </Modal>
      {!findScorecardsLoading && questions && (
        <div className="whitespace-pre-wrap">
          <Tab.Group
            defaultIndex={0}
            selectedIndex={index}
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
                          name="content"
                          title="content"
                          disabled={editQuestionIndex !== __index}
                          value={question.content.toString()}
                          onChange={(e) => handleQuestionChange(e)}
                          className={classNames(
                            "w-10/12 resize-none bg-transparent px-2",
                            editQuestionIndex === __index
                              ? "border-edenGray-200 border-box rounded-md border"
                              : ""
                          )}
                          ref={
                            editQuestionIndex === __index
                              ? editTextareaRef
                              : null
                          }
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
                          onClick={
                            () => {
                              setDeleteQuestionIndex(__index);
                              setIsDeleteModalOpen(true);
                            }
                            // handleDeleteQuestion(category, __index)
                          }
                          className="!bg-edenPink-300 text-utilityRed ml-2 flex h-6 w-6 items-center justify-center rounded-md !p-0 hover:opacity-60"
                        >
                          <RiDeleteBin2Line size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="tertiary"
                    onClick={() => {
                      setIsAddQuestion(true);
                      handleAddQuestion(category);
                    }}
                    className="float-right text-sm"
                  >
                    + Add a Question
                  </Button>
                  {/* <Button
                    className="absolute bottom-8 right-8 z-30 mx-auto"
                    variant={"primary"}
                    loading={scrapingSave}
                    onClick={() => handleSaveChanges()}
                  >
                    Save Changes
                  </Button> */}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      )}
      {index !== Object.keys(questions).length - 1 && (
        <div className={"pointer-events-none fixed bottom-0 w-full max-w-2xl"}>
          <Button
            variant={"primary"}
            // disabled={submitting}
            className={"bg-bgColor pointer-events-auto mx-auto block"}
            onClick={handleSaveChanges}
          >
            {submitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      )}
    </div>
  );
};

const convertCategoryToText = (
  categories: Category[],
  categoriesObj: QuestionGroupedByCategory
) => {
  let content = "";

  let idx = 0;
  let bulletIdx = 0;

  for (const category of categories) {
    idx += 1;
    content += `<Category ${idx}: ${category.name}>\n`;

    const bullets = categoriesObj[category.name];

    for (const bullet of bullets) {
      bulletIdx += 1;

      content += `- b${bulletIdx}: ${bullet.content}\n`;
    }
  }

  return content;
};

// function convertTextCategoriesToObj(text: string) {
//   // function convertTextCategoriesToObj(text: string): QuestionGroupedByCategory {
//   const categories: Category[] = [];

//   // Split the text into lines

//   const lines = text.split("\n");

//   let currentCategory: Category | null = null;

//   // Process each line
//   lines.forEach((line) => {
//     // Remove leading/trailing white spaces and colons
//     const trimmedLine = line.trim();

//     // Check if it's a category line
//     if (trimmedLine.startsWith("Category")) {
//       const categoryName = trimmedLine
//         .substring(trimmedLine.indexOf(":") + 1)
//         .trim();

//       currentCategory = { name: categoryName, bullets: [] };
//       categories.push(currentCategory);
//     }

//     // Check if it's a bullet point line
//     if (trimmedLine.startsWith("•")) {
//       if (currentCategory) {
//         const bulletText = trimmedLine
//           .replace("•", "")
//           .substring(trimmedLine.indexOf(":") + 1)
//           .trim();

//         currentCategory.bullets.push(bulletText);
//       }
//     }
//   });

//   const categoriesObj: QuestionGroupedByCategory = categories.reduce(
//     (acc, category) => {
//       acc[category.name] = category.bullets.map((bullet) => ({
//         question: bullet,
//       }));

//       return acc;
//     },
//     {} as QuestionGroupedByCategory
//   );

//   return {
//     categoriesObj: categoriesObj,
//     categories: categories,
//   };
// }
