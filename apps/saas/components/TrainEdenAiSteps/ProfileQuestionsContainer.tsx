"use-client";

import { gql, useMutation } from "@apollo/client";
import { Button, EdenAiProcessingModal } from "@eden/package-ui";
import { classNames } from "@eden/package-ui/utils";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import { RiDeleteBin2Line } from "react-icons/ri";

export const POSITION_TEXT_CONVO_TO_REPORT = gql`
  mutation ($fields: positionTextAndConvoToReportCriteriaInput!) {
    positionTextAndConvoToReportCriteria(fields: $fields) {
      success
      report
    }
  }
`;

type QuestionSuggest = {
  question: String;
  IDCriteria?: String;
};
type QuestionGroupedByCategory = {
  [category: string]: QuestionSuggest[];
};

interface IProfileQuestionsContainerProps {}

export const ProfileQuestionsContainer =
  ({}: IProfileQuestionsContainerProps) => {
    // const { currentUser } = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const [scraping, setScraping] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [editQuestionIndex, setEditQuestionIndex] =
      useState<number | null>(null);
    const [questions, setQuestions] = useState<QuestionGroupedByCategory>({});

    // const { register, watch, control, setValue, getValues } = useForm<Members>({
    //   defaultValues: { ...currentUser },
    // });

    const { positionID } = router.query;

    const [positionTextAndConvoToReportCriteria] = useMutation(
      POSITION_TEXT_CONVO_TO_REPORT,
      {
        onCompleted({ positionTextAndConvoToReportCriteria }) {
          // console.log(
          //   "positionTextAndConvoToReportCriteria = ",
          //   positionTextAndConvoToReportCriteria
          // );
          debugger;

          setScraping(false);

          let jobDescription =
            positionTextAndConvoToReportCriteria.report.replace(/<|>/g, "");

          //Change - to •
          jobDescription = jobDescription.replace(/-\s/g, "• ");

          setQuestions(convertTextCategoriesToObj(jobDescription));
        },
        onError() {
          setScraping(false);
        },
      }
    );

    // const handleClick = () => {
    //   console.log("change =");

    //   setScraping(true);

    //   positionTextAndConvoToReportCriteria({
    //     variables: {
    //       // fields: { message: textResponse, userID: currentUser?._id },
    //       fields: {
    //         positionID: positionID,
    //       },
    //     },
    //   });
    // };

    useEffect(() => {
      setEditQuestionIndex(null);
    }, [index]);

    useEffect(() => {
      if (scraping == false) {
        setScraping(true);

        positionTextAndConvoToReportCriteria({
          variables: {
            // fields: { message: textResponse, userID: currentUser?._id },
            fields: {
              positionID: positionID,
            },
          },
        });
        return () => {
          setScraping(false);
        };
      }
    }, []);

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
          {
            question: "",
            IDCriteria: `b${prevQuestions[category].length + 1}`,
          },
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

    return (
      <div className="w-full">
        {scraping && (
          <EdenAiProcessingModal
            open={scraping}
            title="Compiling candidate checklist"
          >
            <div className="text-center">
              <p>{`These are the criteria you & I will use to benchmark all of the candidates. I'm generating this list based on everything you've just told me prior - of course you'll be able to add, delete & edit!`}</p>
            </div>
          </EdenAiProcessingModal>
        )}
        {!scraping && questions && (
          <div className="whitespace-pre-wrap">
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
                            onClick={() =>
                              handleDeleteQuestion(category, __index)
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
        )}
      </div>
    );
  };

interface Category {
  name: string;
  bullets: string[];
}
function convertTextCategoriesToObj(text: string): QuestionGroupedByCategory {
  const categories: Category[] = [];

  // Split the text into lines
  const lines = text.split("\n");

  let currentCategory: Category | null = null;

  // Process each line
  lines.forEach((line) => {
    // Remove leading/trailing white spaces and colons
    const trimmedLine = line.trim();

    // Check if it's a category line
    if (trimmedLine.startsWith("Category")) {
      const categoryName = trimmedLine
        .substring(trimmedLine.indexOf(":") + 1)
        .trim();

      currentCategory = { name: categoryName, bullets: [] };
      categories.push(currentCategory);
    }

    // Check if it's a bullet point line
    if (trimmedLine.startsWith("•")) {
      if (currentCategory) {
        const bulletText = trimmedLine
          .replace("•", "")
          .substring(trimmedLine.indexOf(":") + 1)
          .trim();

        currentCategory.bullets.push(bulletText);
      }
    }
  });

  const categoriesObj: QuestionGroupedByCategory = categories.reduce(
    (acc, category) => {
      acc[category.name] = category.bullets.map((bullet) => ({
        question: bullet,
      }));

      return acc;
    },
    {} as QuestionGroupedByCategory
  );

  // Render the elements
  // const elements = categories.map((category, index) => (
  //   <div key={index} className="mb-6">
  //     <div className="border-edenGreen-300 flex justify-between border-b px-4">
  //       <h3 className="text-edenGreen-500 mb-3">{category.name}</h3>
  //     </div>
  //     <ul>
  //       {category.bullets.map((bullet: string, bulletIndex: number) => (
  //         <li
  //           className="border-edenGray-100 w-full rounded-md border-b px-4"
  //           key={bulletIndex}
  //         >
  //           <div className="flex w-full columns-2 items-center justify-between py-4">
  //             <p className="w-full pr-4 text-sm">{bullet}</p>
  //           </div>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // ));

  // Render the elements inside a div
  return categoriesObj;
}
