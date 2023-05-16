import { gql, useMutation, useQuery } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Button,
  Card,
  ChatMessage,
  CountdownTimer,
  CVUploadGPT,
  InterviewEdenAI,
  // RawDataGraph,
  SEO,
  Wizard,
  WizardStep,
} from "@eden/package-ui";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { companyID } = router.query;
  const [interviewEnded, setInterviewEnded] = useState(false);

  const {
    data: findCompanyData,
    // error: findCompanyError,
  } = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: !companyID,
  });

  const handleEnd = () => {
    console.log("interview end");

    setInterviewEnded(true);
  };

  return (
    <>
      <SEO />
      <Card className="mx-auto mt-3 h-[88vh] w-full max-w-5xl bg-white" shadow>
        <div className="h-full w-full p-8">
          <Wizard canPrev={false}>
            <WizardStep label={"welcome"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">{`Hi! I'm Eden. 👋`}</h2>
                {findCompanyData?.findCompany?.name ? (
                  <>
                    <p>
                      I am the AI that&lsquo;s here to help you unlock your next
                      dream opportunity
                    </p>
                    <br />
                    <p>
                      🎉 You&lsquo;ve been invited to take the next steps with{" "}
                      <b>{findCompanyData.findCompany.name}.</b> 🎉
                    </p>
                    <br />
                    <p>
                      If you need a refresher, here&lsquo;s the{" "}
                      <Link href={"https://google.com"} target="_blank">
                        <b className="underline hover:text-slate-600">
                          opportunity
                        </b>
                      </Link>{" "}
                      info
                    </p>
                    <br />
                    <br />
                    <br />
                    <p>
                      When you&lsquo;re ready, click next and you&lsquo;ll be
                      doing your first interview with me!
                    </p>
                  </>
                ) : (
                  <p> </p>
                )}
              </section>
            </WizardStep>
            {/* <WizardStep label={"instructions"}>
              <section className="flex h-full flex-col items-center justify-center">
                {findCompanyData?.findCompany?.name && (
                  <h3 className="mb-8 text-lg font-medium">
                    Your first interview with {findCompanyData.findCompany.name}{" "}
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
            <WizardStep label={"cv"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h3 className="mb-8 text-center text-lg font-medium">
                  Hey {currentUser?.discordName}!
                </h3>
                <p className="mb-8 text-center">
                  In order for me to be able to ask relevant questions,
                  <br />
                  please upload your CV first.
                </p>
                <CVUploadGPT />
              </section>
            </WizardStep>
            <WizardStep nextDisabled={!interviewEnded} label={"chat"}>
              <div className="mx-auto h-[70vh] max-w-lg">
                <InterviewEdenAIContainer handleEnd={handleEnd} />
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
      </Card>
    </>
  );
};

HomePage.getLayout = (page) => <AppUserLayout>{page}</AppUserLayout>;

export default HomePage;

import { IncomingMessage, ServerResponse } from "http";
import Link from "next/link";
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

const FIND_COMPANY = gql`
  query ($fields: findCompanyInput) {
    findCompany(fields: $fields) {
      _id
      name
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

const ADD_CANDIDATE_TO_COMPANY = gql`
  mutation ($fields: addCandidatesCompanyInput) {
    addCandidatesCompany(fields: $fields) {
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
  _id: number;
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

  // --------- Company and User ------------
  const { currentUser } = useContext(UserContext);

  console.log("currentUser = ", currentUser?._id);

  const router = useRouter();
  const { companyID } = router.query;
  // --------- Company and User ------------

  const [questions, setQuestions] = useState<Question[]>([]);

  const {} = useQuery(FIND_COMPANY, {
    variables: {
      fields: {
        _id: companyID,
      },
    },
    skip: companyID == "" || companyID == null,
    onCompleted: (data) => {
      let questionsChange = data.findCompany.questionsToAsk.map(
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

  // const {} = useMutation(ADD_CANDIDATE_TO_COMPANY, {
  //   variables: {
  //     fields: {
  //       _id: companyID,
  //       candidates: [
  //         {
  //           userID: currentUser?._id,
  //         },
  //       ],
  //     },
  //   },
  //   skip: companyID == "" || companyID == null || currentUser?._id != "",
  //   // onCompleted: (data) => {
  //   //   console.log("data = ", data);
  //   // },
  // });
  const [addCandidateToCompany] = useMutation(ADD_CANDIDATE_TO_COMPANY, {
    onCompleted: (data) => {
      console.log("data = ", data);
      setAddCandidateFlag(true);
    },
  });

  const [addCandidateFlag, setAddCandidateFlag] = useState<boolean>(false);

  useEffect(() => {
    if (
      addCandidateFlag == false &&
      currentUser?._id != undefined &&
      companyID != undefined
    ) {
      addCandidateToCompany({
        variables: {
          fields: {
            companyID: companyID,
            candidates: [
              {
                userID: currentUser?._id,
              },
            ],
          },
        },
      });
    }
  }, [companyID, currentUser?._id]);

  // console.log("companyID = ", companyID);

  const [experienceTypeID] = useState<string>("");

  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("chatN = ", chatN);

  return (
    <div className="w-full">
      {/* <h1 className="mb-4 text-3xl font-bold">
        Help Eden with some questions to know you better
      </h1> */}
      <div className="h-[68vh]">
        {
          <InterviewEdenAI
            key={experienceTypeID}
            aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
            experienceTypeID={experienceTypeID}
            //   extraNodes={extraNodes}
            //   handleChangeNodes={(_nodeObj: any) => {
            //     // console.log("handleChangeNodes:", nodeObj);
            //     setNodeObj(_nodeObj);
            //   }}
            handleChangeChat={(_chat: any) => {
              // console.log("handleChangeChat:", _chat);
              setChatN(_chat);
            }}
            //   setShowPopupSalary={setShowPopup}
            //   setMode={setMode}
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
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
          />
        }
      </div>
      <CountdownTimer />
    </div>
  );
};

import { UPDATE_MEMBER } from "@eden/package-graphql";
import {
  Members,
  Mutation,
  UpdateMemberInput,
} from "@eden/package-graphql/generated";
import { locations } from "@eden/package-ui/utils/locations";
import { Controller, useForm } from "react-hook-form";

interface IProfileQuestionsContainerProps {}

const ProfileQuestionsContainer = ({}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [userState, setUserState] = useState<Members>();
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
      router.push("/thanks");
      setSubmitting(false);
    },
    onError: () => {
      setSubmitting(false);
    },
  });

  const handleSubmit = () => {
    setSubmitting(true);
    const fields: UpdateMemberInput = {};

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

  return (
    <div className="w-full">
      <div className="mb-8">
        <section className="mb-4 inline-block w-1/2 pr-12">
          <p className="mb-2">What is your desired salary</p>
          <div className="flex items-center">
            <input
              type="number"
              id="budget"
              className="font-Inter text-soilBody focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
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
              min={0}
              max={40}
              id="hoursPerWeek"
              className="font-Inter text-soilBody focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
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
                  userState?.timeZone && userState?.location
                    ? `(${userState?.timeZone}) ${userState?.location}`
                    : ""
                }
                id="location"
                className="font-Inter text-soilBody focus:border-accentColor focus:ring-soilGreen-500 block flex w-full resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
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
                <option disabled value={""} hidden>
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
              // min={0}
              // max={40}
              // // id="hoursPerWeek"
              className="font-Inter text-soilBody focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
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

                if (userState?.experienceLevel?.total == 3) _defaultValue = 3;
                if (userState?.experienceLevel?.total == 6) _defaultValue = 6;
                if (userState?.experienceLevel?.total == 9) _defaultValue = 9;

                return (
                  <select
                    id="experienceLevel"
                    className="font-Inter text-soilBody focus:border-accentColor focus:ring-soilGreen-500 mr-2 block flex w-20 w-full resize-none rounded-md border border-zinc-400/50 px-2 py-1 text-base focus:outline-transparent focus:ring focus:ring-opacity-50"
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
      >
        Submit
      </Button>
    </div>
  );
};
