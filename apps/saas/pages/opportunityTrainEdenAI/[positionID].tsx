import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { Members, Mutation } from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Button,
  Card,
  ChatMessage,
  EdenAiProcessingModal,
  EdenTooltip,
  FillSocialLinks,
  // CountdownTimer,
  InterviewEdenAI,
  // ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  TextArea,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HiBadgeCheck } from "react-icons/hi";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../_app";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
  // const [progress, setProgress] = useState<number>(0);
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

  // const handleProgress = (_step: any) => {
  //   switch (_step) {
  //     case 1:
  //       setProgress(25);
  //       break;
  //     case 2:
  //       setProgress(50);
  //       break;
  //     case 3:
  //       setProgress(75);
  //       break;
  //     case 4:
  //       setProgress(100);
  //       break;
  //     default:
  //   }
  // };

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

  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleCopyLink = (positionID: string) => {
    // const url = window.location.href;
    const url = window.location.origin + "/interview/" + positionID;

    navigator.clipboard.writeText(url);
    setNotificationOpen(true);
    setTimeout(() => {
      setNotificationOpen(false);
    }, 3000);
  };

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
          <div className="h-full w-full px-8">
            {/* <div className="absolute left-0 top-0 w-full">
              <ProgressBarGeneric progress={progress} />
            </div> */}
            <Wizard
              showStepsHeader
              canPrev={false}
              // onStepChange={handleProgress}
            >
              <WizardStep label={"Upload Description"}>
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
                  <EdenAiProcessingModal
                    open={scraping}
                    title="Give me 30 seconds!"
                  >
                    <div className="text-center">
                      <p>
                        I&apos;m reading your job description, writing down
                        additional questions I have for you so I can draft the
                        ideal interview for your candidates!
                      </p>
                    </div>
                  </EdenAiProcessingModal>
                </div>
              </WizardStep>

              {/* <WizardStep nextDisabled={!interviewEnded} label={"chat"}> */}
              <WizardStep label={"Eden Convo"}>
                <div className="mx-auto h-[70vh] max-w-lg">
                  <InterviewEdenAIContainer
                    handleEnd={handleInterviewEnd}
                    interviewQuestionsForPosition={
                      interviewQuestionsForPosition
                    }
                  />
                </div>
              </WizardStep>

              <WizardStep label={"Priorities & TradeOffs"}>
                <div className="mx-auto h-full max-w-lg">
                  <h2 className="mb-4 text-xl font-medium">Key Priorities</h2>
                  <p className="mb-8 text-sm leading-tight text-gray-500">
                    Here’s what I got your priorities are - please re-arrange as
                    you see fit.
                  </p>
                  <PrioritiesAndTradeOffsContainer />
                </div>
              </WizardStep>

              <WizardStep label={"Eden Alignment"}>
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

              <WizardStep label={"Edit Eden’s Suggestions"}>
                <div className="mx-auto h-full max-w-lg">
                  <h2 className="mb-4 text-xl font-medium">
                    Eden Seed Interview Questions
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
              <WizardStep label={"Final Details"}>
                <div className="mx-auto max-w-3xl">
                  <h2 className="mb-4 text-xl font-medium">
                    Final Important Details
                  </h2>
                  <FinalFormContainer />
                </div>
              </WizardStep>
              <WizardStep label={"Share Interview Link"}>
                <div className="flex h-full flex-col items-center justify-center pb-28">
                  <div className="max-w-lg">
                    <h2 className="mb-4 text-center text-xl font-medium">
                      Let&apos;s get the interviews rolling! 🎉
                    </h2>
                    <p className="mb-8 text-center">
                      Copy & share this link wherever you want candidates to
                      kickoff their first interview.
                    </p>
                  </div>
                  <div className="flex w-2/3 justify-center">
                    <div className="mr-2 flex w-full items-center overflow-x-scroll rounded-md border border-gray-400 bg-gray-200 px-2 text-sm text-gray-500">
                      {window.location.origin + "/interview/" + positionID}
                    </div>
                    <Button
                      size="md"
                      className="bg-soilBlue border-soilBlue scrollbar-hide relative flex h-10 items-center whitespace-nowrap !text-sm text-white"
                      variant="default"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(positionID as string);
                      }}
                    >
                      <div className="flex w-full items-center justify-center">
                        {!notificationOpen ? (
                          <>
                            <HiOutlineLink className="mr-1" />
                            <span>interview link</span>
                          </>
                        ) : (
                          <span className="text-sm">Link copied!</span>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
                <Button
                  className="absolute bottom-8 right-8 z-30 mx-auto"
                  variant={"primary"}
                  onClick={() => {
                    router.push(`/dashboard/${positionID}`);
                  }}
                >
                  Continue to Dashboard
                </Button>
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
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { HiOutlineLink } from "react-icons/hi2";

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse;
}) {
  const session = await getSession(ctx);

  const url = ctx.req.url;

  if (!session) {
    return {
      redirect: {
        destination: `/?redirect=${url}`,
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

  console.log("findPositionData = ", findPositionData);

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

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
        {/* <div className="flex justify-center">
          <ProgressBarGeneric
            color="accentColor"
            progress={
              (100 *
                (findPositionData?.findPosition?.questionsToAsk.length -
                  questions.length)) /
              findPositionData?.findPosition?.questionsToAsk.length
            }
          />
        </div> */}
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_GPT4_ONLY}
            experienceTypeID={experienceTypeID}
            handleChangeChat={(_chat: any) => {
              setChatN(_chat);
            }}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <p className=" bg-cottonPink text-edenGreen-600 rounded-lg p-1 text-center font-medium">
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
        {/* <CountdownTimer /> */}
      </div>
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

export const FIND_PRIORITIES_TRAIN_EDEN_AI = gql`
  mutation FindPrioritiesTrainEdenAI($fields: findPrioritiesTrainEdenAIInput) {
    findPrioritiesTrainEdenAI(fields: $fields) {
      success
      priorities {
        priority
        reason
      }
      tradeOffs {
        tradeOff1
        tradeOff2
        reason
      }
    }
  }
`;

interface PriorityObj {
  priority: string;
  reason: string;
}

interface TradeOffsObj {
  tradeOff1: string;
  tradeOff2: string;
  reason: string;
}

interface IPrioritiesAndTradeOffsContainerProps {}

const PrioritiesAndTradeOffsContainer =
  ({}: IPrioritiesAndTradeOffsContainerProps) => {
    const { currentUser } = useContext(UserContext);
    // eslint-disable-next-line no-unused-vars
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const [scraping, setScraping] = useState<boolean>(false);

    const [priorities, setPriorities] = useState<PriorityObj[]>([]);

    const [tradeOffs, setTradeOffs] = useState<TradeOffsObj[]>([]);

    // eslint-disable-next-line no-unused-vars
    const { register, watch, control, setValue, getValues } = useForm<Members>({
      defaultValues: { ...currentUser },
    });

    const { positionID } = router.query;

    const [FindPrioritiesTrainEdenAI] = useMutation(
      FIND_PRIORITIES_TRAIN_EDEN_AI,
      {
        onCompleted({ findPrioritiesTrainEdenAI }) {
          console.log(
            "findPrioritiesTrainEdenAI = ",
            findPrioritiesTrainEdenAI
          );

          setScraping(false);

          // let jobDescription =
          //   FindPrioritiesTrainEdenAI.report.replace(/<|>/g, "");

          // //Change - to •
          // jobDescription = jobDescription.replace(/-\s/g, "• ");

          setPriorities(findPrioritiesTrainEdenAI.priorities);

          setTradeOffs(findPrioritiesTrainEdenAI.tradeOffs);

          setSelected(
            findPrioritiesTrainEdenAI.tradeOffs.map(
              (tradeOff: TradeOffsObj) => tradeOff.tradeOff2
            )
          );
        },
      }
    );

    // console.log("tradeOffs = ", tradeOffs);

    useEffect(() => {
      setScraping(true);

      console.log("positionID 2= ", positionID);

      FindPrioritiesTrainEdenAI({
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

    const [selected, setSelected] = useState<string[]>(
      tradeOffs.map((tradeOff) => tradeOff.tradeOff2)
    );

    const handleSelect = (index: number, option: string) => {
      const newSelected = [...selected];

      newSelected[index] = option;
      setSelected(newSelected);
    };

    const permutePriorities = (index1: number, index2: number) => {
      if (
        index1 < 0 ||
        index1 >= priorities.length ||
        index2 < 0 ||
        index2 >= priorities.length
      ) {
        throw new Error("Invalid index");
      }

      const newArray = [...priorities];

      [newArray[index1], newArray[index2]] = [
        newArray[index2],
        newArray[index1],
      ];

      setPriorities(newArray);
    };

    return (
      // <ul className="space-y-2">
      //   {priorities.map((priority, index) => (
      //     <li
      //       key={index}
      //       className="relative cursor-pointer"
      //       onMouseEnter={() => setHoveredIndex(index)}
      //       onMouseLeave={() => setHoveredIndex(null)}
      //     >
      //       <div className="font-bold">{priority.priority}</div>
      //       {hoveredIndex === index && (
      //         <div className="absolute left-0 top-full rounded-md bg-white p-2 shadow-lg">
      //           {priority.reason}
      //         </div>
      //       )}
      //     </li>
      //   ))}
      // </ul>
      // <ul className="space-y-4">
      //   {priorities.map((priority, index) => (
      //     <li
      //       key={index}
      //       className="relative cursor-pointer text-xl"
      //       onMouseEnter={() => setHoveredIndex(index)}
      //       onMouseLeave={() => setHoveredIndex(null)}
      //     >
      //       <div className="font-bold">
      //         {index + 1}. {priority.priority}
      //       </div>
      //       {hoveredIndex === index && (
      //         <div className="absolute left-0 top-full z-50 rounded-md bg-white p-2 shadow-lg">
      //           {priority.reason}
      //         </div>
      //       )}
      //     </li>
      //   ))}
      // </ul>
      <>
        {scraping && (
          <EdenAiProcessingModal
            open={scraping}
            title="Calculating criteria"
          ></EdenAiProcessingModal>
        )}
        <ul className="mb-8">
          {priorities &&
            priorities.length > 0 &&
            priorities.map((priority, index) => (
              <li
                key={index}
                className="group relative cursor-pointer py-1 pl-10 text-xl"
              >
                <EdenTooltip
                  id={priority.reason.split(" ").join("")}
                  innerTsx={
                    <div className="w-60">
                      <h3>Reason for Priority: </h3>
                      <p>{priority.reason}</p>
                    </div>
                  }
                  place="top"
                  effect="solid"
                  backgroundColor="white"
                  border
                  borderColor="#e5e7eb"
                  padding="0.5rem"
                  offset={{ left: 100 }}
                >
                  <div className="w-full">
                    <div className="text-lg font-bold">
                      {index + 1}. {priority.priority}
                    </div>
                    <div className="absolute left-2 top-0 hidden text-gray-400 group-hover:block">
                      <div className="hover:text-gray-600">
                        <div
                          className={classNames(
                            "hover:text-gray-600",
                            index === 0 ? "hidden" : ""
                          )}
                        >
                          <BiChevronUp
                            onClick={() => {
                              permutePriorities(index, index - 1);
                            }}
                          />
                        </div>
                      </div>
                      <div className="hover:text-gray-600">
                        <div
                          className={classNames(
                            "hover:text-gray-600",
                            index === priorities.length - 1 ? "hidden" : "",
                            index === 0 ? "mt-4" : ""
                          )}
                        >
                          <BiChevronDown
                            onClick={() => {
                              permutePriorities(index, index + 1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </EdenTooltip>
              </li>
            ))}
        </ul>

        <h2 className="mb-4 text-xl font-medium">Tradeoffs</h2>
        <p className="mb-8 text-sm leading-tight text-gray-500">
          From what I gathered, these are your tradeoff preferences - feel free
          to adjust
        </p>

        {/* <div className="flex flex-col items-center justify-center">
          {tradeOffs.map((tradeOff, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-row items-center gap-4">
                <label className="flex items-center gap-2 text-lg">
                  <input
                    type="radio"
                    name={`tradeoff-${index}`}
                    value={tradeOff.tradeOff1}
                    checked={selected[index] === tradeOff.tradeOff1}
                    onChange={() => handleSelect(index, tradeOff.tradeOff1)}
                  />
                  <span className="text-xl">{tradeOff.tradeOff1}</span>
                </label>
                <label className="flex items-center gap-2 text-lg">
                  <input
                    type="radio"
                    name={`tradeoff-${index}`}
                    value={tradeOff.tradeOff2}
                    checked={selected[index] === tradeOff.tradeOff2}
                    onChange={() => handleSelect(index, tradeOff.tradeOff2)}
                  />
                  <span className="text-xl">{tradeOff.tradeOff2}</span>
                </label>
              </div>
            </div>
          ))}
        </div> */}
        <div className="flex flex-col items-center justify-center">
          {tradeOffs &&
            tradeOffs.length > 0 &&
            tradeOffs.map((tradeOff, index) => (
              <EdenTooltip
                key={index}
                id={`tradeoff-${index}`}
                innerTsx={
                  <div className="w-60">
                    <p>{tradeOff.reason}</p>
                  </div>
                }
                place="top"
                effect="solid"
                backgroundColor="white"
                border
                borderColor="#e5e7eb"
                padding="0.5rem"
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-1">
                    <label className="flex cursor-pointer items-center justify-end text-lg">
                      <span className="text-xl">{tradeOff.tradeOff1}</span>
                      <input
                        type="radio"
                        name={`tradeoff-${index}`}
                        value={tradeOff.tradeOff1}
                        checked={selected[index] === tradeOff.tradeOff1}
                        onChange={() => handleSelect(index, tradeOff.tradeOff1)}
                        className="ml-2"
                      />
                    </label>
                  </div>
                  <div className="col-span-1">
                    <label className="flex cursor-pointer items-center text-lg">
                      <input
                        type="radio"
                        className="mr-2"
                        name={`tradeoff-${index}`}
                        value={tradeOff.tradeOff2}
                        checked={selected[index] === tradeOff.tradeOff2}
                        onChange={() => handleSelect(index, tradeOff.tradeOff2)}
                      />
                      <span className="text-xl">{tradeOff.tradeOff2}</span>
                    </label>
                  </div>
                </div>
              </EdenTooltip>
            ))}
        </div>
      </>

      // <div className="w-full">
      //   {scraping && (
      //     <p className="text-center text-gray-400">
      //       Clculating criteria{" "}
      //       <svg
      //         className="inline-block animate-spin"
      //         xmlns="http://www.w3.org/2000/svg"
      //         width="21px"
      //         height="21px"
      //         viewBox="0 0 24 24"
      //         fill="none"
      //       >
      //         <path
      //           opacity="0.2"
      //           fillRule="evenodd"
      //           clipRule="evenodd"
      //           d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      //           fill="#000000"
      //         />
      //         <path
      //           d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
      //           fill="#000000"
      //         />
      //       </svg>
      //     </p>
      //   )}
      //   {report && (
      //     <div className="whitespace-pre-wrap">
      //       {convertTextCategoriesToHTML(report)}
      //     </div>
      //   )}
      // </div>
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
        <EdenAiProcessingModal
          open={scraping}
          title="Calculating criteria"
        ></EdenAiProcessingModal>
      )}
      {report && (
        <div className="whitespace-pre-wrap">
          {convertTextCategoriesToHTML(report)}
        </div>
      )}
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
        <EdenAiProcessingModal
          open={scraping}
          title="Loading questions"
        ></EdenAiProcessingModal>
      )}
      <Button
        className="absolute bottom-8 right-8 z-30 mx-auto"
        variant={"primary"}
        loading={scrapingSave}
        onClick={handleSaveChanges}
      >
        Save Changes
      </Button>
      <div className="">
        {Object.keys(questions).map((category) => (
          <div key={category + questions[category].length}>
            <h2 className="mb-2 text-xl font-medium">{category}</h2>
            {questions[category].map((question, index) => (
              <div key={`${category}_${index}`} className="relative mb-2">
                <textarea
                  name="question"
                  defaultValue={question.question.toString()}
                  onChange={(event) =>
                    handleQuestionChange(event, index, category)
                  }
                  className="w-full resize-none hover:resize focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(category, index)}
                  className="absolute -left-10 top-1 flex h-4 w-4 rotate-45 cursor-pointer items-center justify-center rounded-full border-[2px] border-gray-400 bg-white pb-[2px] font-bold text-gray-400 hover:bg-gray-400 hover:text-white hover:opacity-80"
                >
                  +
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddQuestion(category)}
              className="bg-accentColor mx-auto mb-2 block h-8 w-8 rounded-full font-bold text-white hover:opacity-80"
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function convertTextCategoriesToHTML(text: string): JSX.Element {
  interface Category {
    name: string;
    bullets: string[];
  }
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

  // Render the elements
  const elements = categories.map((category, index) => (
    <div key={index} className="mb-4">
      <h3 className="text-xl font-medium">{category.name}</h3>
      <ul>
        {category.bullets.map((bullet: string, bulletIndex: number) => (
          <li className="list-disc" key={bulletIndex}>
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  ));

  // Render the elements inside a div
  return <div>{elements}</div>;
}

interface IFinalFormContainerProps {}

const FinalFormContainer = ({}: IFinalFormContainerProps) => {
  return (
    <form className="grid grid-cols-2 gap-16">
      <div className="col-span-1">
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Targetted Start Date</label>
          <input
            type="date"
            name="targettedStartDate"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
          />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Visa Requirements</label>
          <input
            type="text"
            name="visaRequirements"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
          />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Office Locations</label>
          <input
            type="text"
            name="officeLocations"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
          />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Office Policy</label>
          <select
            name="officePolicy"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            defaultValue={""}
          >
            <option value={""} disabled hidden>
              Select an option...
            </option>
            <option value="on-site">On site</option>
            <option value="remote">Remote</option>
            <option value="hybrid-1-day-office">Hybrid - 1 day office</option>
            <option value="hybrid-2-day-office">Hybrid - 2 day office</option>
            <option value="hybrid-3-day-office">Hybrid - 3 day office</option>
            <option value="hybrid-4-day-office">Hybrid - 4 day office</option>
          </select>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Contract Type</label>
          <select
            name="contractType"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
            defaultValue={""}
          >
            <option value={""} disabled hidden>
              Select an option...
            </option>
            <option value="fulltime">Full time</option>
            <option value="parttime">Part time</option>
            <option value="freelance">Freelance</option>
            <option value="intern">Intern</option>
          </select>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <label className="w-2/5 pr-2">Contract Duration</label>
          <input
            type="text"
            name="contractDuration"
            className="input-primary focus-within:border-accentColor focus-within:ring-soilGreen-500 w-3/5 rounded-full pl-4"
          />
        </div>
      </div>
      <div className="col-span-1">
        <label>Key Company Links</label>
        <FillSocialLinks />
      </div>
    </form>
  );
};
