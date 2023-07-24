import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Badge,
  Button,
  ChatMessage,
  CountdownTimer,
  CVUploadGPT,
  InterviewEdenAI,
  ProgressBarGeneric,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiOutlineLock } from "react-icons/ai";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID } = router.query;
  const [interviewEnded, setInterviewEnded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cvEnded, setCvEnded] = useState<Boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [titleRole, setTitleRole] = useState<string>("");
  const [topSkills, setTopSkills] = useState<any[]>([]);
  const [content, setContent] = useState<{
    matchPercentage: number | null;
    improvementPoints: string | null;
    strongFit: string | null;
    growthAreas: string | null;
    experienceAreas: string | null;
  }>({
    matchPercentage: null,
    improvementPoints: null,
    strongFit: null,
    growthAreas: null,
    experienceAreas: null,
  });

  // console.log("cvEnded = ", cvEnded);
  const {
    data: findPositionData,
    // error: findPositionError,
  } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: !positionID,
  });

  const handleCvEnd = () => {
    // console.log("cv end");

    setCvEnded(true);
  };
  const handleInterviewEnd = () => {
    // console.log("interview end");

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
      <div className="relative mx-auto h-screen w-full max-w-5xl overflow-y-scroll p-8">
        {/* <Card className="mx-auto mt-3 h-[88vh] w-full max-w-7xl overflow-y-scroll rounded-none px-4 pt-4"> */}
        {currentUser && (
          <div className="h-full w-full">
            <div className="mb-4 w-full">
              <ProgressBarGeneric progress={progress} />
            </div>
            <Wizard canPrev={false} onStepChange={handleProgress} animate>
              <WizardStep
                // nextDisabled={!cvEnded}
                label={"cv"}
              >
                <UploadCVContainer
                  setTitleRole={setTitleRole}
                  setTopSkills={setTopSkills}
                  setContent={setContent}
                  handleCvEnd={handleCvEnd}
                  position={findPositionData?.findPosition}
                />
              </WizardStep>
              <WizardStep label={"welcome"}>
                <ApplicationStepContainer
                  topSkills={topSkills}
                  titleRole={titleRole}
                  position={findPositionData?.findPosition}
                  content={content}
                />
              </WizardStep>
              {/* <WizardStep label={"instructions"}>
              <section className="flex h-full flex-col items-center justify-center">
                {findPositionData?.findPosition?.name && (
                  <h3 className="mb-8 text-lg font-medium">
                    Your first interview with {findPositionData.findPosition.name}{" "}
                    will be a discussion with Eden AI
                  </h3>
                )}
                <div className="mt-8 flex h-[70%] w-full justify-center">
                  <RawDataGraph
                    rawData={rawDataPersonProject}
                    disableZoom={true}
                  />
                </div>
              </section>
            </WizardStep> */}

              <WizardStep nextDisabled={!interviewEnded} label={"chat"}>
                <div className="mx-auto h-[70vh] max-w-lg">
                  <InterviewEdenAIContainer handleEnd={handleInterviewEnd} />
                </div>
              </WizardStep>

              <WizardStep label={"profile"}>
                <p className="mb-8 text-center">Just a few questions missing</p>
                <ProfileQuestionsContainer />
              </WizardStep>

              {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
            </Wizard>
          </div>
        )}
      </div>
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

interface UploadCVContainerProps {
  setTitleRole: Dispatch<SetStateAction<string>>;
  setTopSkills: Dispatch<SetStateAction<any>>;
  setContent: Dispatch<SetStateAction<any>>;
  handleCvEnd: () => void;
  position: Position;
}

const UploadCVContainer = ({
  setTitleRole,
  setTopSkills,
  setContent,
  handleCvEnd,
  position,
}: UploadCVContainerProps) => {
  const router = useRouter();
  const { positionID } = router.query;
  const { currentUser } = useContext(UserContext);

  const handleDataFromCVUploadGPT = (data: any) => {
    const role = data.saveCVtoUser.titleRole;
    const skills = data.saveCVtoUser.mainSkills;

    setTitleRole(role);
    setTopSkills(skills);
    setContent({
      matchPercentage: data.saveCVtoUser.matchPercentage,
      improvementPoints: data.saveCVtoUser.improvementPoints,
      strongFit: data.saveCVtoUser.strongFit,
      growthAreas: data.saveCVtoUser.growthAreas,
      experienceAreas: data.saveCVtoUser.experienceAreas,
    });
  };

  return (
    <div className="">
      <section className="mb-4 flex h-[25vh] w-full flex-col items-center justify-center rounded-md border border-gray-300 bg-white p-4">
        <h3 className="mb-4 text-center text-lg font-medium">
          Hey {currentUser?.discordName}!
        </h3>
        <p className="mb-4 text-center">
          Congratulations! You&apos;ve been selected to
          <br />
          do a first interview with <strong>{position?.company?.name}</strong>
          {position?.name ? (
            <>
              <br />
              for the <strong>{position?.name}</strong> role
            </>
          ) : null}
        </p>
        <CVUploadGPT
          onDataReceived={handleDataFromCVUploadGPT}
          handleEnd={handleCvEnd}
          positionID={positionID}
        />
      </section>
      <section className="grid h-[50vh] grid-cols-3 gap-6">
        <div className="col-span-1 h-full rounded-md border border-gray-300 bg-white p-4">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Role Description
          </h3>
          <ul className="list-disc pl-4">
            {position?.positionsRequirements?.roleDescription
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-1 h-full rounded-md border border-gray-300 bg-white p-4">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Benefits & Perks
          </h3>
          <ul className="list-disc pl-4">
            {position?.positionsRequirements?.benefits
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="col-span-1 h-full rounded-md border border-gray-300 bg-white p-4">
          <h3 className="text-edenGreen-600 text-center text-2xl font-semibold">
            You x {position?.company?.name}
          </h3>
          <p className="mb-4 text-center text-gray-500">
            <AiOutlineLock className="mr-2 inline-block" />
            Upload your CV to unlock it
          </p>
          <ul className="list-disc pl-4">
            <li className="mb-2">Probability of landing this job</li>
            <li className="mb-2">What to improve to maximeze your chances</li>
            <li className="mb-2">
              Ask specific questions about company, opportunity & culture in
              real time chat
            </li>
            <li className="mb-2">Salary range + equity benefits</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

interface ApplicationStepContainerProps {
  titleRole: string;
  topSkills: any[];
  position: Position;
  content: {
    matchPercentage: number | null;
    improvementPoints: string | null;
    strongFit: string | null;
    growthAreas: string | null;
    experienceAreas: string | null;
  };
}

const ApplicationStepContainer = ({
  // eslint-disable-next-line no-unused-vars
  titleRole,
  // eslint-disable-next-line no-unused-vars
  topSkills,
  position,
  content,
}: ApplicationStepContainerProps) => {
  // const router = useRouter();
  // const { currentUser } = useContext(UserContext);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const today = new Date();

  return (
    <div className="grid h-full grid-cols-12 gap-6">
      <section className="col-span-3 max-h-[calc(88vh-5rem)] overflow-y-scroll">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-400">
            Your top skills:
          </h3>
          <div>
            {topSkills !== null &&
              topSkills.map((skill: any, index: number) => (
                <Badge
                  className="text-white"
                  key={index}
                  text={skill}
                  colorRGB="168, 85, 247"
                  cutText={20}
                />
              ))}
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-400">Salary range:</h3>
          <p className="text-xl font-medium">
            ${60000} - ${90000}
          </p>
        </div>
        <div>
          <div>
            <p>Recruiting + Eden AI chat</p>
            <p className="text-gray-500">{`${
              monthNames[today.getMonth()]
            } ${today.getDate()}`}</p>
          </div>
          <div>
            <p>Hiring manager interviews</p>
            <p className="text-gray-500">{`${
              monthNames[
                new Date(new Date().setDate(today.getDate() + 3)).getMonth()
              ]
            } ${new Date(
              new Date().setDate(today.getDate() + 3)
            ).getDate()}`}</p>
          </div>
          <div>
            <p>Onboarding</p>
            <p className="text-gray-500">{`${
              monthNames[
                new Date(new Date().setDate(today.getDate() + 14)).getMonth()
              ]
            } ${new Date(
              new Date().setDate(today.getDate() + 14)
            ).getDate()}`}</p>
          </div>
        </div>
      </section>
      <section className="relative col-span-6 h-full max-h-[calc(88vh-5rem)] overflow-y-scroll rounded-md bg-white">
        <div className="scrollbar-hide h-full overflow-y-scroll p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80px"
            height="80px"
            viewBox="0 0 24 24"
            className="mx-auto"
            style={{
              fill: "rgba(215, 254, 109, 1)",
              transform: "",
              msFilter: "",
            }}
          >
            <path d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.215 2 10.535 2 12s.802 2.785 2.035 3.479A3.976 3.976 0 0 0 4 16c0 2.379 2.138 4.283 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.283 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.785 22 13.465 22 12s-.802-2.785-2.035-3.479zm-9.01 7.895-3.667-3.714 1.424-1.404 2.257 2.286 4.327-4.294 1.408 1.42-5.749 5.706z"></path>
          </svg>
          <h2 className="mb-4 text-center text-2xl font-medium">
            Looking great!
          </h2>
          {position?.name ? (
            <>
              <p className="text-center">Your probability of passing is:</p>
              {content.matchPercentage &&
                (content.matchPercentage > 50 ? (
                  <p className="mb-4 text-center text-[50px] text-lime-400">{`${content.matchPercentage}%`}</p>
                ) : (
                  <p className="mb-4 text-center text-[50px] text-red-600">{`${content.matchPercentage}%`}</p>
                ))}

              <section className="h-[42vh] overflow-y-scroll">
                <div className="px-8">
                  <h3 className="text-edenGreen-600 text-lg font-semibold">
                    Strong suit:
                  </h3>
                  <p className="mb-4 whitespace-pre-wrap">
                    {content.strongFit}
                  </p>
                </div>
                <div className="px-8">
                  <h3 className="text-edenGreen-600 text-lg font-semibold">
                    Areas to improve:
                  </h3>
                  <p className="mb-8 whitespace-pre-wrap">
                    {content.improvementPoints}
                  </p>
                </div>
              </section>
            </>
          ) : null}
        </div>
        <div className="absolute bottom-0 left-0 flex w-full justify-center rounded-md bg-white px-4 py-2 text-xs text-gray-500 ">
          <input type="checkbox" className="mr-3" />
          <p>
            I acknowledge That my CV & responses will be stored and shared by
            Eden
            <span className="mx-1 text-red-600">*</span>
          </p>
        </div>
      </section>
      <section className="col-span-3 max-h-[calc(88vh-5rem)] overflow-y-scroll">
        <div className="mb-8">
          <h3 className="mb-2 text-lg font-semibold text-gray-400">
            What you will get:
          </h3>
          <div className="mb-4 rounded-md bg-white p-2">
            <h3 className="text-lg font-semibold text-gray-400">Growth:</h3>
            <p className="whitespace-pre-wrap">{content.growthAreas}</p>
          </div>
          <div className="mb-4 rounded-md bg-white p-2">
            <h3 className="text-lg font-semibold text-gray-400">
              Personal experience:
            </h3>
            <p className="whitespace-pre-wrap">{content.experienceAreas}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

// ------- Interview Chat --------

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
      _id
      name
      company {
        name
      }
      questionsToAsk {
        bestAnswer
        question {
          _id
          content
        }
      }
      positionsRequirements {
        roleDescription
        benefits
      }
    }
  }
`;

const ADD_CANDIDATE_TO_POSITION = gql`
  mutation ($fields: addCandidatesPositionInput) {
    addCandidatesPosition(fields: $fields) {
      _id
      name
      candidates {
        user {
          _id
          discordName
          discordAvatar
        }
        overallScore
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

type Question = {
  _id: string;
  content: string;
  bestAnswer: string;
};

interface MessageObject {
  message: string;
  sentMessage: boolean;
  user?: string;
}

interface InterviewEdenAIContainerProps {
  handleEnd?: () => void;
}

const InterviewEdenAIContainer = ({
  handleEnd,
}: InterviewEdenAIContainerProps) => {
  const [sentMessageToEdenAIobj, setSentMessageToEdenAIobj] =
    useState<MessageObject>({ message: "", sentMessage: false, user: "" });

  // --------- Position and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { positionID } = router.query;
  // --------- Position and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const { data: findPositionData } = useQuery(FIND_POSITION, {
    variables: {
      fields: {
        _id: positionID,
      },
    },
    skip: positionID == "" || positionID == null,
    onCompleted: (data) => {
      let questionsChange = data.findPosition.questionsToAsk.map(
        (question: any) => {
          return {
            _id: question?.question?._id,
            content: question?.question?.content,
            bestAnswer: question?.bestAnswer,
          };
        }
      );

      questionsChange = questionsChange.filter((question: any) => {
        return question._id != null;
      });

      setQuestions(questionsChange);
    },
  });

  const [addCandidateToPosition] = useMutation(ADD_CANDIDATE_TO_POSITION, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  const [conversationID, setConversationID] = useState<String>("");

  // SOS 🆘 -> the candidate is not been added to the position // return back before publish code
  useEffect(() => {
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      positionID != undefined &&
      conversationID != ""
    ) {
      console.log("change conversationID= ", conversationID);
      addCandidateToPosition({
        variables: {
          fields: {
            positionID: positionID,
            candidates: [
              {
                userID: currentUser?._id,
                conversationID: conversationID,
              },
            ],
          },
        },
      });
    }
  }, [positionID, currentUser?._id, conversationID]);

  // console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  console.log("conversationID = ", conversationID);

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
              <p className="bg-cottonPink text-edenGreen-600 rounded-sm p-1 text-center font-medium">
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

import { UPDATE_MEMBER } from "@eden/package-graphql";
import {
  Members,
  Mutation,
  Position,
  UpdateMemberInput,
} from "@eden/package-graphql/generated";
import { locations } from "@eden/package-ui/utils/locations";
import Head from "next/head";
import { Controller, useForm } from "react-hook-form";

interface IProfileQuestionsContainerProps {}

const ProfileQuestionsContainer = ({}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [userState, setUserState] = useState<Members>();
  const [valid, setValid] = useState<boolean>(false);
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  useEffect(() => {
    if (currentUser) {
      setUserState(currentUser);
    }
  }, [currentUser]);

  const [updateMember] = useMutation(UPDATE_MEMBER, {
    onCompleted({ updateMember }: Mutation) {
      if (!updateMember) console.log("updateMember is null");
      router.push(`/interview/${router.query.positionID}/submitted`);
      setSubmitting(false);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const handleSubmit = () => {
    setSubmitting(true);
    const fields: UpdateMemberInput = {};

    if (userState?._id) fields._id = userState?._id;
    if (userState?.budget?.perHour)
      fields.budget = { perHour: Number(userState?.budget?.perHour || 0) };
    if (userState?.hoursPerWeek)
      fields.hoursPerWeek = Number(userState?.hoursPerWeek || 0);
    if (userState?.location) fields.location = userState?.location;
    if (userState?.timeZone) fields.timeZone = userState?.timeZone;
    if (userState?.experienceLevel?.total)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            total: +userState?.experienceLevel?.total,
          }
        : {
            total: +userState?.experienceLevel?.total,
          };
    if (userState?.experienceLevel?.years)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            years: +userState?.experienceLevel?.years,
          }
        : {
            years: +userState?.experienceLevel?.years,
          };

    updateMember({
      variables: {
        fields: fields,
      },
    });
  };

  useEffect(() => {
    const subscription = watch((data: any) => {
      console.log("WATCH ---- data", data);
      if (data) setUserState(data as Members);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (
      userState?.budget?.perHour &&
      userState?.hoursPerWeek &&
      userState?.location &&
      userState?.timeZone &&
      (userState?.experienceLevel?.years ||
        userState?.experienceLevel?.years === 0) &&
      (userState?.experienceLevel?.total ||
        userState?.experienceLevel?.years === 0)
    ) {
      console.log("VALID");

      setValid(true);
    } else {
      console.log("NOT VALID");

      setValid(false);
    }
  }, [userState]);

  return (
    <div className="w-full">
      <div className="mb-8">
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">What is your desired salary</p>
          <div className="flex items-center">
            <input
              min={0}
              defaultValue={currentUser?.budget?.perHour || ""}
              type="number"
              id="budget"
              className="font-Unica focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
              required
              {...register("budget.perHour")}
            />
            <span>$/hour</span>
          </div>
        </section>
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">Share your availability</p>
          <div className="flex items-center">
            <input
              type="number"
              defaultValue={currentUser?.hoursPerWeek || ""}
              min={0}
              max={40}
              id="hoursPerWeek"
              className="font-Unica focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
              required
              {...register("hoursPerWeek")}
            />
            <span>hours/week</span>
          </div>
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">What is your location?</p>
          <Controller
            name={"location"}
            control={control}
            render={() => (
              <select
                defaultValue={
                  currentUser?.timeZone && currentUser?.location
                    ? `(${currentUser?.timeZone}) ${currentUser?.location}`
                    : ""
                }
                id="location"
                className="font-Unica focus:border-accentColor focus:ring-soilGreen-500 block flex w-full resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
                required
                onChange={(e) => {
                  const _gmt = e.target.value.split(" ")[0].slice(1, -1);

                  const _location = e.target.value
                    .split(" ")
                    .splice(1)
                    .join(" ");

                  setValue("timeZone", _gmt);
                  setValue("location", _location);
                }}
              >
                <option value={""} disabled hidden>
                  Select a location...
                </option>
                {locations.map((loc, index) => (
                  <option
                    value={`(${loc.gmt}) ${loc.location}`}
                    key={index}
                  >{`(${loc.gmt}) ${loc.location}`}</option>
                ))}
              </select>
            )}
          />
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">
            How many years of experience do you have in total?
          </p>
          <div className="flex items-center">
            <input
              type="number"
              min={0}
              // max={40}
              // id="hoursPerWeek"
              defaultValue={currentUser?.experienceLevel?.years || ""}
              className="font-Unica focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
              // required
              {...register("experienceLevel.years")}
            />
            <span>years</span>
          </div>
        </section>
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">What is you experience level?</p>
          <div className="flex items-center">
            <Controller
              name={"experienceLevel"}
              control={control}
              render={() => {
                let _defaultValue: number | string = "";

                if (currentUser?.experienceLevel?.total == 3) _defaultValue = 3;
                if (currentUser?.experienceLevel?.total == 6) _defaultValue = 6;
                if (currentUser?.experienceLevel?.total == 9) _defaultValue = 9;

                return (
                  <select
                    id="experienceLevel"
                    className="font-Unica focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 w-full resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
                    required
                    onChange={(e) => {
                      const _val = {
                        ...getValues("experienceLevel"),
                        total: +e.target.value,
                      };

                      setValue("experienceLevel", _val);
                    }}
                    defaultValue={_defaultValue}
                  >
                    <option value={""} disabled hidden>
                      Select one...
                    </option>
                    <option value={3}>Junior</option>
                    <option value={6}>Mid-level</option>
                    <option value={9}>Senior</option>
                  </select>
                );
              }}
            />
          </div>
        </section>
      </div>
      <Button
        className="absolute bottom-4 right-4 z-20"
        variant="primary"
        onClick={handleSubmit}
        disabled={!valid}
      >
        Submit
      </Button>
    </div>
  );
};
