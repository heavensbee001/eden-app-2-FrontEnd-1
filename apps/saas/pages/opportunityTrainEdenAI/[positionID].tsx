import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Members, Mutation } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Button,
  Card,
  ChatMessage,
  CountdownTimer,
  InterviewEdenAI,
  Modal,
  ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  TextArea,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiBadgeCheck } from "react-icons/hi";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../_app";

export const WEBPAGE_TO_MEMORY = gql`
  mutation ($fields: websiteToMemoryCompanyInput!) {
    websiteToMemoryCompany(fields: $fields) {
      report
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
    }
  }
`;

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
        }
      }
    }
  }
`;

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID } = router.query;
  // eslint-disable-next-line no-unused-vars
  const [interviewEnded, setInterviewEnded] = useState(false);
  // const [cvEnded, setCvEnded] = useState<Boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  // const [titleRole, setTitleRole] = useState(null);
  // const [topSkills, setTopSkills] = useState([]);

  // console.log("cvEnded = ", cvEnded);
  const {
    // data: findPositionData,
    // error: findPositionError,
  } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !positionID,
  });

  const handleInterviewEnd = () => {
    console.log("interview end");

    setInterviewEnded(true);
  };

  const handleProgress = (_step: any) => {
    switch (_step) {
      case 1:
        setProgress(25);
        break;
      case 2:
        setProgress(50);
        break;
      case 3:
        setProgress(75);
        break;
      case 4:
        setProgress(100);
        break;
      default:
    }
  };

  // const [webpageLink, setWebpageLink] = useState("");
  const [pastedText, setPastedText] = useState("");

  // const [webPageText, setWebPageText] = useState("");
  const [scraping, setScraping] = useState<boolean>(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line no-unused-vars
  const [report, setReport] = useState<string | null>(null);

  const [interviewQuestionsForPosition, setInterviewQuestionsForPosition] =
    useState<Question[]>([]);

  // const { currentUser } = useContext(UserContext);

  const [websiteToMemoryCompany] = useMutation(WEBPAGE_TO_MEMORY, {
    onCompleted({ websiteToMemoryCompany }) {
      console.log(
        "websiteToMemoryCompany.report",
        websiteToMemoryCompany.report
      );
      let jobDescription = websiteToMemoryCompany.report.replace(/<|>/g, "");

      //Change - to •
      jobDescription = jobDescription.replace(/-\s/g, "• ");

      setReport(jobDescription);

      setScraping(false);

      let questionsChange =
        websiteToMemoryCompany.interviewQuestionsForPosition.map(
          (question: any) => {
            return {
              _id: question?.originalQuestionID,
              content: question?.personalizedContent,
              bestAnswer: "",
            };
          }
        );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setInterviewQuestionsForPosition(questionsChange);
    },
  });

  // eslint-disable-next-line no-unused-vars
  // const handleWebpageLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setWebpageLink(e.target.value);
  // };

  const handlePastedTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPastedText(e.target.value);
  };

  // const handleLinkSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setScraping(true);

  //   const queryParams = new URLSearchParams({ url: webpageLink }).toString();

  //   try {
  //     const response = await fetch(
  //       `/api/webpage_scraper/webpage_scraper?${queryParams}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     if (!response.ok) {
  //       let error;

  //       try {
  //         const { error: serverError } = await response.json();

  //         error = serverError;
  //       } catch (jsonError) {
  //         error = "An error occurred while decoding the response JSON";
  //       }
  //       setError(`HTTP error! status: ${response.status}, error: ${error}`);
  //       throw new Error(
  //         `HTTP error! status: ${response.status}, error: ${error}`
  //       );
  //     }

  //     console.log("API response:", response);

  //     const { textResponse } = await response.json();

  //     websiteToMemoryCompany({
  //       variables: {
  //         // fields: { message: textResponse, userID: currentUser?._id },
  //         fields: {
  //           message: textResponse,
  //           positionID: positionID,
  //         },
  //       },
  //     });

  //     // setReport(textResponse);
  //   } catch (error) {
  //     setError(
  //   `An error occurred while fetching the LinkedIn profile: ${
  //     (error as Error).message
  //   }

  //   Please copy the text from the job post page manually and paste it in the textfield below`
  // );
  //   }
  // };

  const handleTextSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pastedText !== "") {
      try {
        console.log("pastedText", pastedText);

        websiteToMemoryCompany({
          variables: {
            fields: { message: pastedText, positionID: positionID },
          },
        });
        setPastedText("");
        setScraping(true);
      } catch (error) {
        setScraping(false);
        setError(
          ` Error:  ${(error as Error).message}
  
          Please try again`
        );
      }
    }
  };

  // console.log(
  //   "interviewQuestionsForPosition  =  223 0",
  //   interviewQuestionsForPosition
  // );

  // console.log("progress = ", progress);
  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:3442218,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      </Head>
      <SEO />
      <Card
        className="mx-auto mt-2 h-[90vh] w-full max-w-5xl overflow-y-scroll bg-white"
        shadow
      >
        {currentUser && (
          <div className="h-full w-full p-8">
            <div className="absolute left-0 top-0 w-full">
              <ProgressBarGeneric progress={progress} />
            </div>
            <Wizard canPrev={false} onStepChange={handleProgress}>
              <WizardStep label={"welcome0"}>
                <div className="flex h-full items-center justify-center">
                  <form className="w-4/12" onSubmit={handleTextSubmit}>
                    <p className="mb-4 text-center">
                      Hi - {currentUser.discordName}.<br />
                      Tell me about your opportunity. 👀
                    </p>

                    <TextArea
                      value={pastedText}
                      onChange={handlePastedTextChange}
                      placeholder="Copy/paste your job description here."
                      className="mb-4 pb-20 pl-4 pt-32 text-sm"
                    />

                    <Button
                      loading={scraping}
                      variant="secondary"
                      type="submit"
                      className="mx-auto"
                    >
                      Submit Your Description
                    </Button>
                  </form>
                  {/* {report && (
                      <div className="whitespace-pre-wrap">{report}</div>
                    )} */}
                  <div>
                    {report && (
                      <p className="text-gray-500">
                        Job description was processed successfully.{" "}
                        <HiBadgeCheck
                          className="inline-block"
                          size={24}
                          color="#40f837"
                        />
                        <br />
                        Click Next to continue.
                      </p>
                    )}
                    {error && <div className="text-red-500">{error}</div>}
                  </div>
                  <Modal open={scraping} closeOnEsc={false}>
                    <div className="px-20 py-10 text-center">
                      <Image
                        width={80}
                        height={80}
                        className="mx-auto mb-4"
                        src="/eden-logo.png"
                        alt=""
                      />
                      <p>
                        Give me 30 seconds!
                        <br />
                        <br />
                        I&apos;m reading your job description, writing down
                        additional questions I have for you so I can draft the
                        ideal interview for your candidates!
                      </p>
                    </div>
                  </Modal>
                </div>
              </WizardStep>

              {/* <WizardStep nextDisabled={!interviewEnded} label={"chat"}> */}
              <WizardStep label={"chat"}>
                <div className="mx-auto h-[70vh] max-w-lg">
                  <InterviewEdenAIContainer
                    handleEnd={handleInterviewEnd}
                    interviewQuestionsForPosition={
                      interviewQuestionsForPosition
                    }
                  />
                </div>
              </WizardStep>

              <WizardStep label={"profile"}>
                <div className="mx-auto h-full max-w-lg">
                  <h2 className="mb-4 text-xl font-medium">
                    Complete Checks & Balances List
                  </h2>
                  <p className="mb-8 text-sm leading-tight text-gray-500">
                    Here&apos;s a list of all the must & nice to haves that I
                    will look for in the candidate based in the info you&apos;ve
                    provided to me. Feel free to edit any line by changing,
                    deleting or adding elements that might be missing.
                  </p>
                  <ProfileQuestionsContainer />
                </div>
              </WizardStep>

              <WizardStep label={"createQuestions"}>
                <div className="mx-auto h-full max-w-lg">
                  <h2 className="mb-4 text-xl font-medium">
                    Eden&apos;s suggested interview questions
                  </h2>
                  <p className="mb-8 text-sm leading-tight text-gray-500">
                    Here&apos;s a list of all the questions Eden will ask to
                    understand the candidate. These questions might get adapted
                    in real time based on the information that the candidate
                    already gives to ensure getting the most out of the
                    conversation.
                  </p>
                  <CreateQuestions />
                </div>
              </WizardStep>

              {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
            </Wizard>
          </div>
        )}
      </Card>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url?.replace("/", "");

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${url}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

// ------- Interview Chat --------

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      interviewQuestionsForPosition {
        originalQuestionID
        originalContent
        personalizedContent
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
    }
  }
`;

// interface cardsDataType {
//   title: string;
//   trust: number;
//   time: number;
//   completed: boolean;
//   firstMessage: string;
//   experienceTypeID: string;
// }

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface InterviewEdenAIContainerProps {
  handleEnd?: () => void;
  interviewQuestionsForPosition?: Question[];
}

const InterviewEdenAIContainer = ({
  handleEnd,
  interviewQuestionsForPosition,
}: InterviewEdenAIContainerProps) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);

  // console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  // console.log(
  //   "interviewQuestionsForPosition = 223 ",
  //   interviewQuestionsForPosition
  // );

  const { data: findPositionData } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data) => {
      console.log("data = ", data);
      let questionsChange = data.findPosition.interviewQuestionsForPosition.map(
        (question: any) => {
          return {
            _id: question?.originalQuestionID,
            content: question?.originalContent,
            bestAnswer: "",
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      if (questionsChange.length > 0) {
        setQuestions(questionsChange);
      }
    },
  });

  const [conversationID, setConversationID] = useState<String>("");

  // console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  // console.log("chatN = ", chatN);

  // console.log("conversationID = ", conversationID);

  useEffect(() => {
    if (
      interviewQuestionsForPosition &&
      interviewQuestionsForPosition?.length > 0
    ) {
      console.log("Yea I am here = 223");
      setQuestions(interviewQuestionsForPosition);
    }
  }, [interviewQuestionsForPosition]);

  // console.log("questions = 223 -1", questions);
  // console.log(
  //   findPositionData?.findPosition?.questionsToAsk.length,
  //   questions.length,
  //   findPositionData?.findPosition?.questionsToAsk.length
  // );

  return (
    <div className="w-full">
      <div className="relative h-[68vh]">
        <div className="absolute left-0 top-2 z-20 w-full">
          <ProgressBarGeneric
            color="accentColor"
            progress={
              (100 *
                (findPositionData?.findPosition?.questionsToAsk.length -
                  questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length
            }
          />
        </div>
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
            experienceTypeID={experienceTypeID}
            handleChangeChat={(_chat: any) => {
              setChatN(_chat);
            }}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <p className="bg-accentColor rounded-lg p-1 text-center font-medium">
                Hi! I&apos;m Eden AI. Say &quot;Hello&quot; to start the
                interview
              </p>
            }
            questions={questions}
            setQuestions={setQuestions}
            userID={currentUser?._id}
            positionID={positionID}
            conversationID={conversationID}
            setConversationID={setConversationID}
            positionTrainEdenAI={true}
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
          />
        }
      </div>
      <CountdownTimer />
      {/* <div className="absolute right-0 top-32 pr-6">
        <span>
          progress{" "}
          {(100 *
            (findPositionData?.findPosition?.questionsToAsk.length -
              questions.length)) /
            findPositionData?.findPosition?.questionsToAsk.length}
        </span>
      </div> */}
    </div>
  );
};

export const POSITION_TEXT_CONVO_TO_REPORT = gql`
  mutation ($fields: positionTextAndConvoToReportCriteriaInput!) {
    positionTextAndConvoToReportCriteria(fields: $fields) {
      success
      report
    }
  }
`;

interface IProfileQuestionsContainerProps {}

const ProfileQuestionsContainer = ({}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [scraping, setScraping] = useState<boolean>(false);

  const [report, setReport] = useState<string | null>(null);

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  const { positionID } = router.query;

  const [positionTextAndConvoToReportCriteria] = useMutation(
    POSITION_TEXT_CONVO_TO_REPORT,
    {
      onCompleted({ positionTextAndConvoToReportCriteria }) {
        console.log(
          "positionTextAndConvoToReportCriteria = ",
          positionTextAndConvoToReportCriteria
        );

        setScraping(false);

        let jobDescription =
          positionTextAndConvoToReportCriteria.report.replace(/<|>/g, "");

        //Change - to •
        jobDescription = jobDescription.replace(/-\s/g, "• ");

        setReport(jobDescription);
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
  }, []);

  return (
    <div className="w-full">
      {/* <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Recalculate Criteria
      </Button> */}

      {scraping && (
        <p className="text-center text-gray-400">
          Recalculating criteria{" "}
          <svg
            className="inline-block animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="21px"
            height="21px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#000000"
            />
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="#000000"
            />
          </svg>
        </p>
      )}
      {report && <div className="whitespace-pre-wrap">{report}</div>}
    </div>
  );
};

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
  question: String;
  IDCriteria: String;
};
type QuestionGroupedByCategory = {
  [category: string]: QuestionSuggest[];
};

interface QuestionSuSQL {
  category: string;
  question: string;
  IDCriteria: string;
}

interface ICreateQuestions {}

const CreateQuestions = ({}: ICreateQuestions) => {
  const { currentUser } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const [scraping, setScraping] = useState<boolean>(false);
  const [scrapingSave, setScrapingSave] = useState<boolean>(false);

  const [questions, setQuestions] = useState<QuestionGroupedByCategory>({});

  const handleQuestionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
    setQuestions((prevQuestions: QuestionGroupedByCategory) => ({
      ...prevQuestions,
      [category]: [
        ...prevQuestions[category],
        { question: "", IDCriteria: `b${prevQuestions[category].length + 1}` },
      ],
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  const { positionID } = router.query;

  const [positionSuggestQuestionsAskCandidate] = useMutation(
    POSITION_SUGGEST_QUESTIONS,
    {
      onCompleted({ positionSuggestQuestionsAskCandidate }) {
        // console.log(
        //   "positionSuggestQuestionsAskCandidate = ",
        //   positionSuggestQuestionsAskCandidate
        // );

        setScraping(false);

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
    }
  );

  // eslint-disable-next-line no-unused-vars
  const handleClick = () => {
    console.log("change =");

    setScraping(true);

    positionSuggestQuestionsAskCandidate({
      variables: {
        // fields: { message: textResponse, userID: currentUser?._id },
        fields: {
          positionID: positionID,
        },
      },
    });
  };

  useEffect(() => {
    setScraping(true);

    positionSuggestQuestionsAskCandidate({
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
  }, []);

  // console.log("questionsSuggest = ", questionsSuggest);

  const [updateQuestionsPosition] = useMutation(ADD_QUESTIONS_TO_POSITION, {
    onCompleted({ updateNodesToMember }: Mutation) {
      console.log("updateNodesToMember = ", updateNodesToMember);
      setScrapingSave(false);
    },
    // skip: positionID == "" || positionID == null,
  });

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
      setScrapingSave(true);

      const questionsToAsk: any[] = [];

      // Object.keys(questions).forEach((category) => {
      for (const category in questions) {
        const categoryQuestions = questions[category];

        for (let j = 0; j < categoryQuestions.length; j++) {
          const question = categoryQuestions[j];

          questionsToAsk.push({
            questionContent: question.question,
            bestAnswer: "",
          });
        }
      }
      updateQuestionsPosition({
        variables: {
          fields: {
            positionID: positionID_,
            questionsToAsk: questionsToAsk,
          },
        },
      });
    }
  };

  // console.log("questions 1001= ", questions);

  return (
    <div className="w-full">
      {/* <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={handleClick}
      >
        Click me
      </button> */}
      {/* <Button
        variant="primary"
        className="w-fit"
        type="submit"
        onClick={handleClick}
        loading={scraping}
      >
        Suggest Questions
      </Button> */}
      {scraping && (
        <p className="text-center text-gray-400">
          Loading questions{" "}
          <svg
            className="inline-block animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            width="21px"
            height="21px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              opacity="0.2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              fill="#000000"
            />
            <path
              d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
              fill="#000000"
            />
          </svg>
        </p>
      )}
      <Button
        className="absolute bottom-8 right-8 z-30 mx-auto"
        variant={"primary"}
        loading={scrapingSave}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
        {Object.keys(questions).map((category) => (
          <div key={category}>
            <h2 className="text-3xl font-bold">{category}</h2>
            {questions[category].map((question, index) => (
              <div key={`${category}_${index}`} className="mb-4">
                <div className="rounded-lg bg-white p-4 shadow">
                  <div className="mb-4 text-lg">
                    <input
                      name="question"
                      defaultValue={question.question.toString()}
                      onChange={(event) =>
                        handleQuestionChange(event, index, category)
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddQuestion(category)}
              className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
