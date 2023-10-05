import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import {
  AI_INTERVIEW_SERVICES,
  AppUserLayout,
  Badge,
  Button,
  // ChatMessage,
  // CountdownTimer,
  CVUploadGPT,
  EdenAiProcessingModal,
  InterviewEdenAI,
  Loading,
  Modal,
  // ProgressBarGeneric,
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
import ReCAPTCHA from "react-google-recaptcha";

// import { rawDataPersonProject } from "../../utils/data/rawDataPersonProject";
import type { NextPageWithLayout } from "../../_app";

const HomePage: NextPageWithLayout = () => {
  const { currentUser } = useContext(UserContext);
  const router = useRouter();
  const { positionID, panda } = router.query;
  // eslint-disable-next-line no-unused-vars
  const [interviewEnded, setInterviewEnded] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cvEnded, setCvEnded] = useState<Boolean>(false);
  const [insightsChecked, setInsightsChecked] = useState<Boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [showStartInterviewModal, setShowStartInterviewModal] =
    useState<boolean>(false);
  const [showInterviewModal, setShowInterviewModal] = useState<boolean>(false);
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
  const [generalDetails, setGeneralDetails] = useState<any>({});

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
    setStep(1);
  };

  const handleInterviewEnd = () => {
    // console.log("interview end");
    setInterviewEnded(true);
  };

  const [updateMember, { loading: submittingGeneralDetails }] = useMutation(
    UPDATE_MEMBER,
    {
      onCompleted({ updateMember }: Mutation) {
        if (!updateMember) console.log("updateMember is null");
        setStep(step + 1);
      },
      onError: () => {
        toast.error("Server error");
      },
    }
  );

  const handleGeneralDetailsSubmit = () => {
    const fields: UpdateMemberInput = {};

    if (generalDetails?._id) fields._id = generalDetails?._id;
    if (generalDetails?.budget?.perHour)
      fields.budget = { perHour: Number(generalDetails?.budget?.perHour || 0) };
    if (generalDetails?.hoursPerWeek)
      fields.hoursPerWeek = Number(generalDetails?.hoursPerWeek || 0);
    if (generalDetails?.location) fields.location = generalDetails?.location;
    if (generalDetails?.timeZone) fields.timeZone = generalDetails?.timeZone;
    if (generalDetails?.experienceLevel?.total)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            total: +generalDetails?.experienceLevel?.total,
          }
        : {
            total: +generalDetails?.experienceLevel?.total,
          };
    if (generalDetails?.experienceLevel?.years)
      fields.experienceLevel = fields.experienceLevel
        ? {
            ...fields.experienceLevel,
            years: +generalDetails?.experienceLevel?.years,
          }
        : {
            years: +generalDetails?.experienceLevel?.years,
          };

    updateMember({
      variables: {
        fields: fields,
      },
    });
  };

  function handleStartInterviewStep() {
    setShowStartInterviewModal(true);
  }

  function handleFinishInterviewStep() {
    setShowInterviewModal(true);
  }

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
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
      <div className="scrollbar-hide relative mx-auto h-screen w-full max-w-7xl overflow-y-scroll p-8">
        {/* <Card className="mx-auto mt-3 h-[88vh] w-full max-w-7xl overflow-y-scroll rounded-none px-4 pt-4"> */}
        {currentUser && (
          <div className="relative h-full w-full">
            {step === 0 && (
              <div className="pt-8">
                <h1 className="text-edenGreen-600 text-center">
                  {`Let's get you onboarded to the ${findPositionData?.findPosition?.name} Talent Oasis, ${currentUser.discordName}!`}
                </h1>
                <p className="text-edenGray-900 text-center">
                  {`You’re a bout to do an interview with Eden to join ${findPositionData?.findPosition?.company?.name}. `}
                </p>
              </div>
            )}
            <div
              className={classNames(
                "w-full",
                step === 0 ? "h-[calc(100%-6rem)]" : "h-full"
              )}
            >
              <Wizard
                showStepsHeader={step !== 0}
                forceStep={step}
                canPrev={false}
                onStepChange={(_stepNum: number) => {
                  if (_stepNum !== step) {
                    setStep(_stepNum);
                  }
                }}
                animate
              >
                <WizardStep
                  navigationDisabled={!panda}
                  nextDisabled={!cvEnded}
                  label={"CV UPLOAD"}
                >
                  <UploadCVContainer
                    setTitleRole={setTitleRole}
                    setTopSkills={setTopSkills}
                    setContent={setContent}
                    handleCvEnd={handleCvEnd}
                    position={findPositionData?.findPosition}
                  />
                </WizardStep>
                <WizardStep
                  navigationDisabled={!panda}
                  label={"EDEN INSIGHTS"}
                  nextDisabled={!insightsChecked}
                  nextButton={
                    <Button
                      disabled={!insightsChecked}
                      variant="secondary"
                      className="mx-auto"
                      onClick={handleStartInterviewStep}
                    >
                      Start Interview
                    </Button>
                  }
                >
                  <ApplicationStepContainer
                    topSkills={topSkills}
                    titleRole={titleRole}
                    position={findPositionData?.findPosition}
                    content={content}
                  />
                  <div className="absolute -bottom-10 left-0 flex w-full justify-center rounded-md px-4 py-2 text-xs text-gray-500 ">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        setInsightsChecked(e.target.checked);
                      }}
                      className="mr-3"
                    />
                    <p>
                      I acknowledge that my CV and responses can be stored and
                      shared with hiring managers by Eden
                      <span className="mx-1 text-red-600">*</span>
                    </p>
                  </div>
                  <Modal open={showStartInterviewModal} closeOnEsc={false}>
                    <div className="px-4 py-8">
                      <h2 className="text-center text-edenGreen-600">
                        {"You're about to head into your interview with Eden."}
                      </h2>
                      <p className="text-center">
                        {"This will take around 10-15 minutes."}
                      </p>
                      <p className="text-center text-sm mb-12">
                        {"Just be your smashing self. You look great btw ;)"}
                      </p>
                      <div className="flex justify-evenly">
                        <Button
                          onClick={() => {
                            setShowStartInterviewModal(false);
                          }}
                          variant="tertiary"
                          className="bg-utilityRed text-utilityRed hover:bg-utilityRed bg-opacity-10 hover:bg-opacity-100 hover:text-white"
                        >
                          {"Let me put on pants 1st"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowStartInterviewModal(false);
                            setStep(step + 1);
                          }}
                        >
                          {"Let's do this!"}
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </WizardStep>
                {/* <WizardStep navigationDisabled nextDisabled={!interviewEnded} label={"chat"}> */}
                <WizardStep
                  navigationDisabled={!panda}
                  label={"INTERVIEW"}
                  nextButton={
                    <Button
                      variant="secondary"
                      className="mx-auto"
                      onClick={() => {
                        handleFinishInterviewStep();
                      }}
                    >
                      Finish Interview
                    </Button>
                  }
                >
                  <div className="mx-auto h-full max-w-lg">
                    <InterviewEdenAIContainer handleEnd={handleInterviewEnd} />
                  </div>

                  <Modal open={showInterviewModal} closeOnEsc={false}>
                    <div className="px-4 py-8">
                      <h2 className="mb-12 text-center">
                        Are you sure you want to end the interview?
                      </h2>
                      <div className="flex justify-evenly">
                        <Button
                          onClick={() => {
                            setShowInterviewModal(false);
                          }}
                          variant="primary"
                        >
                          {"I'm not done yet"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowInterviewModal(false);
                            setStep(step + 1);
                          }}
                        >
                          Finish Interview
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </WizardStep>

                <WizardStep
                  navigationDisabled={!panda}
                  label={"FINAL DETAILS"}
                  nextButton={
                    <Button
                      variant="secondary"
                      // type="submit"
                      className="mx-auto"
                      onClick={() => {
                        handleGeneralDetailsSubmit();
                      }}
                      disabled={
                        !(
                          generalDetails?.budget?.perHour &&
                          generalDetails?.hoursPerWeek &&
                          generalDetails?.location &&
                          generalDetails?.timeZone &&
                          (generalDetails?.experienceLevel?.years ||
                            generalDetails?.experienceLevel?.years === 0) &&
                          (generalDetails?.experienceLevel?.total ||
                            generalDetails?.experienceLevel?.years === 0)
                        )
                      }
                    >
                      Save & Continue
                    </Button>
                  }
                >
                  <p className="mb-8 text-center text-sm">
                    {
                      "All done, this is the final step. Fill in some quick information and we’re off!"
                    }
                  </p>
                  <ProfileQuestionsContainer
                    onChange={(data) => {
                      setGeneralDetails(data);
                    }}
                  />
                  {submittingGeneralDetails && (
                    <EdenAiProcessingModal
                      title="Saving data"
                      open={submittingGeneralDetails}
                    />
                  )}
                </WizardStep>
                <WizardStep navigationDisabled={!panda} label={"ALL DONE"}>
                  {/* <FinalContainer /> */}
                  <ConnectTelegramContainer
                    candidateTelegramID={
                      currentUser.conduct?.telegramChatID || undefined
                    }
                  />
                </WizardStep>

                {/* <WizardStep label={"end"}>
              <section className="flex h-full flex-col items-center justify-center">
                <h2 className="mb-8 text-2xl font-medium">Thanks</h2>
              </section>
            </WizardStep> */}
              </Wizard>
              {panda && (
                <Button
                  className="absolute bottom-0 left-0 !border-white !bg-white text-gray-300 hover:!text-gray-200"
                  variant="secondary"
                  onClick={() => {
                    setStep(step + 1);
                  }}
                >
                  Next
                </Button>
              )}
            </div>
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
  const [recaptcha, setRecaptcha] = useState<string | null>(null);

  return (
    <div className="pt-8">
      <section className="grid grid-cols-3 gap-6">
        <div className="bg-edenPink-100 col-span-1 h-full rounded-md p-4">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Min Requirements
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            {position?.positionsRequirements?.roleDescription
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-edenPink-100 col-span-1 h-full rounded-md p-4">
          <h3 className="text-edenGreen-600 mb-4 text-center text-2xl font-semibold">
            Benefits & Perks
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            {position?.positionsRequirements?.benefits
              ?.slice(0, 10)
              .map((item, index) => (
                <li key={index} className="mb-2">
                  {item}
                </li>
              ))}
          </ul>
        </div>
        <div className="bg-edenPink-300 col-span-1 h-full rounded-md p-4">
          <h3 className="text-edenGreen-600 text-center text-2xl font-semibold">
            Upload Resume to get instant feedback
          </h3>
          <ul className="text-edenGray-900 list-disc pl-4 text-sm">
            <li className="mb-2">Probability of landing this job</li>
            <li className="mb-2">What to not miss to maximize your chances</li>
            <li className="mb-2">Strong suit about your profile</li>
          </ul>
        </div>
      </section>
      <section className="mb-4 flex h-[25vh] w-full flex-col items-center justify-center rounded-md p-4">
        {!recaptcha && ReCAPTCHA ? (
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY || ""}
            onChange={(val: any) => {
              if (val) {
                setRecaptcha(val);
              }
            }}
          />
        ) : (
          <CVUploadGPT
            onDataReceived={handleDataFromCVUploadGPT}
            handleEnd={handleCvEnd}
            positionID={positionID}
          />
        )}
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
  // eslint-disable-next-line no-unused-vars
  position,
  content,
}: ApplicationStepContainerProps) => {
  // const router = useRouter();
  // const { currentUser } = useContext(UserContext);

  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  // const today = new Date();

  const getMatchText = () => {
    if (content.matchPercentage! >= 80) {
      return "Very High";
    } else if (content.matchPercentage! >= 60) {
      return "High";
    } else if (content.matchPercentage! >= 40) {
      return "Average";
    } else if (content.matchPercentage! >= 20) {
      return "Low";
    } else if (content.matchPercentage! < 20) {
      return "Very Low";
    } else {
      return "";
    }
  };
  const matchText = getMatchText();

  const [openSections, setOpenSections] = useState<{
    areasToImprove: boolean;
    growth: boolean;
    strongSuit: boolean;
  }>({
    areasToImprove: true,
    growth: false,
    strongSuit: false,
  });

  return (
    <>
      <div>
        <div className="grid w-full grid-cols-12 gap-2">
          <div className="col-span-9 pt-8">
            <h1 className="text-edenGreen-600">
              Before you dive into the interview
            </h1>
            <p className="text-edenGray-900 mb-10 text-sm">
              A couple of quick notes to set you up for success
            </p>
            <section
              className="bg-edenPink-100 relative mb-2 cursor-pointer rounded-sm p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  areasToImprove: !openSections.areasToImprove,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.areasToImprove ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkMinusFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Missing from your resume
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Make sure to address this in your interview
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.areasToImprove ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.improvementPoints}
              </p>
            </section>
            <section
              className="border-edenGreen-100 relative mb-2 cursor-pointer border-b p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  growth: !openSections.growth,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.growth ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkBarGraphFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Your opportunity to grow
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Find out about the areas you can grow in
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.growth ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.growthAreas}
              </p>
            </section>
            <section
              className="border-edenGreen-100 relative mb-2 cursor-pointer border-b p-4"
              onClick={() =>
                setOpenSections({
                  ...openSections,
                  strongSuit: !openSections.strongSuit,
                })
              }
            >
              <div className="absolute right-4 top-4 cursor-pointer p-1">
                {openSections.strongSuit ? (
                  <BiChevronUp color="#626262" size={"1.2rem"} />
                ) : (
                  <BiChevronDown color="#626262" size={"1.2rem"} />
                )}
              </div>
              <h3 className="text-edenGreen-600 text-lg font-semibold">
                <BsFillFileEarmarkPlusFill
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                What already stands out about you
              </h3>
              <p className="text-edenGray-500 mb-2 text-sm">
                Find out about the areas you are strong at
              </p>
              <p
                className={classNames(
                  "text-edenGray-900 overflow-hidden whitespace-pre-wrap transition-all ease-in-out",
                  openSections.strongSuit ? "max-h-[80vh]" : "max-h-0"
                )}
              >
                {content.strongFit}
              </p>
            </section>
          </div>
          <div className="border-edenGreen-100 col-span-3 rounded-sm border">
            <section className="border-edenGreen-100 mb-2 rounded-md border-b p-4 text-center">
              <h2 className="text-edenGreen-600 mb-4 text-center">
                Probability of Passing
              </h2>
              <div className="border-edenGreen-400 text-edenGreen-600 font-Moret inline-block border px-3 py-1 text-center text-lg">
                {matchText.toUpperCase()}
              </div>
            </section>
            {(position?.generalDetails?.yearlySalary ||
              position?.generalDetails?.yearlySalary === 0) && (
              <section className="mb-2 p-4">
                <h3 className="text-edenGreen-600 mb-2">
                  <IoWallet size="1.3rem" className="mr-2 inline" />
                  Yearly Salary
                </h3>
                <p className="text-lg font-medium">
                  ${position?.generalDetails?.yearlySalary}
                </p>
              </section>
            )}
            {/* <section className="mb-2 p-4">
              <h3 className="text-edenGreen-600 mb-2">
                <BiCalendarExclamation
                  color="#00462C"
                  size="1.3rem"
                  className="-mt-1 mr-2 inline"
                />
                Timeline
              </h3>
              <div>
                <div className="">
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[today.getMonth()]
                    } ${today.getDate()}`}</p>
                    <p className="text-sm">Recruiting + Eden AI Chat</p>
                  </div>
                  <BiChevronDown
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-auto"
                  />
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 3)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 3)
                    ).getDate()}`}</p>
                    <p className="text-sm">HR Interviews</p>
                  </div>
                  <BiChevronDown
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-auto"
                  />
                  <div>
                    <p className="text-xs text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 14)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 14)
                    ).getDate()}`}</p>
                    <p className="text-sm">Onboarding</p>
                  </div>
                </div>
              </div>
            </section> */}
            <section className="mb-2 w-full p-4">
              <h3 className="text-edenGreen-600 mb-2">
                <FaStar
                  size="1.3rem"
                  color="#00462C"
                  className="-mt-1 mr-2 inline"
                />
                Your Top skills
              </h3>
              <div>
                {topSkills !== null &&
                  topSkills.map((skill: any, index: number) => (
                    <Badge key={index} text={skill} cutText={20} />
                  ))}
              </div>
            </section>
          </div>
        </div>
        {/* <div className="grid grid-cols-12 gap-2">
          <div className="col-span-3 bg-edenGreen-100 mb-2 rounded-md p-4">
            <h2 className="text-center text-edenGreen-600 mb-6">
              Probability of passing
            </h2>
            <div className="bg-white text-center p-4 rounded-md">
              {matchText}
            </div>
          </div>
          <div className="col-span-9 grid grid-cols-12 gap-2">
            <section className="w-full border border-edenGray-100 rounded-md bg-white p-4 col-span-12">
              <h3 className="text-edenGreen-600 mb-2">Your Top skills</h3>
              <div>
                {topSkills !== null &&
                  topSkills.map((skill: any, index: number) => (
                    <Badge key={index} text={skill} cutText={20} />
                  ))}
              </div>
            </section>
            <section className="w-full border border-edenGray-100 rounded-md bg-white mb-2 p-4 col-span-4">
              <h3 className="text-edenGreen-600 mb-2">Yearly Salary</h3>
              <p className="text-lg font-medium">
                ${position?.generalDetails?.yearlySalary}
              </p>
            </section>
            <section className="w-full border border-edenGray-100 rounded-md bg-white mb-2 p-4 col-span-8">
              <h3 className="text-edenGreen-600 mb-2">Timeline</h3>
              <div>
                <div className="flex flex-nowrap items-center">
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[today.getMonth()]
                    } ${today.getDate()}`}</p>
                    <p>Recruiting + Eden AI Chat</p>
                  </div>
                  <BiChevronRight
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-5"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 3)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 3)
                    ).getDate()}`}</p>
                    <p>HR Interviews</p>
                  </div>
                  <BiChevronRight
                    size={"1.6rem"}
                    color="#00462C"
                    className="mx-5"
                  />
                  <div>
                    <p className="text-sm text-gray-500">{`${
                      monthNames[
                        new Date(
                          new Date().setDate(today.getDate() + 14)
                        ).getMonth()
                      ]
                    } ${new Date(
                      new Date().setDate(today.getDate() + 14)
                    ).getDate()}`}</p>
                    <p>Onboarding</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div> */}
        {/* <section className="h-64 w-full overflow-x-scroll whitespace-nowrap">
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Strong suit
            </h3>
            <p className="whitespace-pre-wrap">{content.strongFit}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Areas to improve
            </h3>
            <p className="whitespace-pre-wrap">{content.improvementPoints}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll mr-2">
            <h3 className="text-edenGreen-600 text-lg font-semibold">Growth</h3>
            <p className="whitespace-pre-wrap">{content.growthAreas}</p>
          </div>
          <div className="border border-edenGray-100 rounded-md bg-white p-4 w-72 h-full inline-block align-top overflow-y-scroll">
            <h3 className="text-edenGreen-600 text-lg font-semibold">
              Personal Experience
            </h3>
            <p className="whitespace-pre-wrap">{content.experienceAreas}</p>
          </div>
        </section> */}
      </div>
    </>
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
      generalDetails {
        yearlySalary
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

// const UPDATE_CONTACT = gql`
//   mutation UpdateMember($fields: updateMemberInput!) {
//     updateMember(fields: $fields) {
//       _id
//     }
//   }
// `;

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

  // eslint-disable-next-line no-unused-vars
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
  const [chatN, setChatN] = useState<ChatMessage>([]);

  console.log("CHAT N", chatN);

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

  const [experienceTypeID] = useState<string>("");

  // console.log("chatN = ", chatN);

  // console.log("conversationID = ", conversationID);

  const { loading: findConversationsLoading } = useQuery(FIND_CONVERSATIONS, {
    variables: {
      fields: {
        // _id: [conversationID],
        positionID: positionID,
        userID: [currentUser?._id],
      },
    },
    onCompleted: (_data) => {
      setChatN(
        _data.findConversations[
          _data.findConversations.length - 1
        ].conversation.map((_mess: ConversationType) => ({
          user: _mess.role === "assistant" ? "01" : "02",
          message: _mess.content,
          date: _mess.date,
        }))
      );
    },
    ssr: false,
  });

  return (
    <div className="h-full w-full">
      <div className="relative h-full">
        {/* <div className="absolute left-0 top-2 z-20 w-full">
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
        {!findConversationsLoading && (
          <InterviewEdenAI
            key={experienceTypeID}
            // aiReplyService={AI_INTERVIEW_SERVICES.INTERVIEW_EDEN_AI}
            aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_GPT4_ONLY}
            experienceTypeID={experienceTypeID}
            // eslint-disable-next-line no-unused-vars
            handleChangeChat={(_chat: any) => {
              // setChatN(_chat);
            }}
            changeChatN={chatN}
            sentMessageToEdenAIobj={sentMessageToEdenAIobj}
            setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
            placeholder={
              <div className="pt-4">
                <Loading title="Loading Eden AI" />
              </div>
            }
            questions={questions}
            setQuestions={setQuestions}
            userID={currentUser?._id}
            positionID={positionID}
            positionTrainEdenAI={false}
            conversationID={conversationID}
            setConversationID={setConversationID}
            handleEnd={() => {
              if (handleEnd) handleEnd();
            }}
            headerText={`Interview with Eden AI`}
          />
        )}
      </div>
      {/* <CountdownTimer /> */}
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

import { FIND_CONVERSATIONS, UPDATE_MEMBER } from "@eden/package-graphql";
import {
  ConversationType,
  Members,
  Mutation,
  Position,
  UpdateMemberInput,
} from "@eden/package-graphql/generated";
import { ChatMessage } from "@eden/package-ui/src/components/InterviewEdenAI/InterviewEdenAI";
import { classNames } from "@eden/package-ui/utils";
// import { classNames } from "@eden/package-ui/utils";
import { locations } from "@eden/package-ui/utils/locations";
import Head from "next/head";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { BiChevronDown, BiChevronRight, BiChevronUp } from "react-icons/bi";
import {
  BsFillFileEarmarkBarGraphFill,
  BsFillFileEarmarkMinusFill,
  BsFillFileEarmarkPlusFill,
  BsLightningFill,
} from "react-icons/bs";
import { FaStar } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
// import { HiMail } from "react-icons/hi";
import { toast } from "react-toastify";

// import { IS_PRODUCTION } from "../../../constants";

interface IProfileQuestionsContainerProps {
  // eslint-disable-next-line no-unused-vars
  onChange: (val: any) => void;
}

const ProfileQuestionsContainer = ({
  onChange,
}: IProfileQuestionsContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const [userState, setUserState] = useState<Members>();
  // const [valid, setValid] = useState<boolean>(false);
  // const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  // const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const { register, watch, control, setValue, getValues } = useForm<Members>({
    defaultValues: { ...currentUser },
  });

  useEffect(() => {
    if (currentUser) {
      setUserState(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const subscription = watch((data: any) => {
      // console.log("WATCH ---- data", data);
      if (data) setUserState(data as Members);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // useEffect(() => {
  //   if (
  //     userState?.budget?.perHour &&
  //     userState?.hoursPerWeek &&
  //     userState?.location &&
  //     userState?.timeZone &&
  //     (userState?.experienceLevel?.years ||
  //       userState?.experienceLevel?.years === 0) &&
  //     (userState?.experienceLevel?.total ||
  //       userState?.experienceLevel?.years === 0)
  //   ) {
  //     console.log("VALID");

  //     setValid(true);
  //   } else {
  //     console.log("NOT VALID");

  //     setValid(false);
  //   }
  // }, [userState]);

  useEffect(() => {
    onChange(userState);
  }, [userState]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8">
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Your Desired Salary</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              min={0}
              defaultValue={currentUser?.budget?.perHour || ""}
              type="number"
              id="budget"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("budget.perHour")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>$/year</span>
            </div>
          </div>
        </section>
        <section className="mb-4 inline-block">
          <p className="mb-2 text-xs">Your Availability</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              type="number"
              defaultValue={currentUser?.hoursPerWeek || ""}
              min={0}
              max={40}
              id="hoursPerWeek"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("hoursPerWeek")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>hours/week</span>
            </div>
          </div>
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 inline-block w-4/5 pr-12">
          <p className="mb-2 text-xs">Your Location</p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <input
              type="text"
              defaultValue={currentUser?.location || ""}
              id="location"
              className="h-[34px] w-full bg-transparent p-2"
              required
              {...register("location")}
            />
          </div>
        </section>
        <section className="mb-4 inline-block w-1/5">
          <p className="font-Unica mb-2 h-full resize-none bg-transparent text-xs outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none">
            Your Timezone
          </p>
          <div className="border-EdenGray-100 flex w-full items-center rounded-md border bg-white text-xs">
            <Controller
              name={"timeZone"}
              control={control}
              render={() => (
                <select
                  defaultValue={
                    currentUser?.timeZone && currentUser?.location
                      ? `(${currentUser?.timeZone}) ${currentUser?.location}`
                      : ""
                  }
                  id="timeZone"
                  className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none"
                  required
                  onChange={(e) => {
                    const _gmt = e.target.value.split(" ")[0].slice(1, -1);

                    // const _location = e.target.value
                    //   .split(" ")
                    //   .splice(1)
                    //   .join(" ");

                    setValue("timeZone", _gmt);
                    // setValue("location", _location);
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
          </div>
        </section>
      </div>
      <div className="mb-8">
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Years of Experience</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
            <input
              type="number"
              defaultValue={currentUser?.experienceLevel?.years || ""}
              min={0}
              id="hoursPerWeek"
              className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
              {...register("experienceLevel.years")}
            />
            <div className="border-edenGray-100 ml-auto border-l px-3">
              <span>years</span>
            </div>
          </div>
        </section>
        <section className="mb-4 mr-12 inline-block">
          <p className="mb-2 text-xs">Experience Level</p>
          <div className="border-EdenGray-100 flex w-48 items-center rounded-md border bg-white text-xs">
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
                    className="font-Unica h-full w-full resize-none bg-transparent p-2 outline-none"
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
      {/* <div className="absolute bottom-4 mx-auto z-20 w-full max-w-2xl text-center">
        <Button
          className="mx-auto"
          variant="primary"
          onClick={handleSubmit}
          disabled={!valid}
        >
          Submit
        </Button>
      </div> */}

      {/* {submitting && (
        <EdenAiProcessingModal title="Submitting" open={submitting} />
      )} */}
    </div>
  );
};

// interface IFinalContainerProps {}

// const FinalContainer = ({}: IFinalContainerProps) => {
//   const router = useRouter();
//   // const positionID = router.query.positionID;
//   const { currentUser } = useContext(UserContext);

//   const [submitting, setSubmitting] = useState(false);
//   const [selected, setSelected] =
//     useState<"email" | "whatsapp" | "telegram">("email");
//   const [contact, setContact] = useState("");

//   const [updateContact] = useMutation(UPDATE_CONTACT, {
//     onCompleted: () => {
//       // setSubmitting(false);
//       router.push(`/interview/${router.query.positionID}/submitted`);
//     },
//     onError: () => {
//       setSubmitting(false);
//       toast.error("Server error while submitting");
//     },
//   });

//   const handleSubmit = () => {
//     setSubmitting(true);

//     const _fields = {
//       _id: currentUser?._id,
//       conduct: {
//         whatsappNumber: "",
//         telegram: "",
//         email: "",
//       },
//     };

//     if (selected === "email") {
//       _fields.conduct.email = contact;
//     } else if (selected === "whatsapp") {
//       _fields.conduct.whatsappNumber = contact;
//     } else if (selected === "telegram") {
//       _fields.conduct.telegram = contact;
//     }
//     updateContact({
//       variables: {
//         fields: _fields,
//       },
//     });
//   };

//   const valid = !!contact;

//   return (
//     <div className="w-full max-w-2xl mx-auto pt-10">
//       <div className="text-center">
//         <div
//           className={
//             "mx-auto mb-2 h-20 w-20 text-edenGreen-600 bg-edenPink-100 flex items-center justify-center rounded-full"
//           }
//         >
//           <BsLightningFill size={"2rem"} />
//         </div>
//         <h1 className="text-edenGreen-600">Radical!</h1>
//         <p className="mb-6">
//           {"We're all set! expect to hear from us by x days"}
//           <br />
//           {"Select your preferred communication line"}
//         </p>
//       </div>
//       <div className="">
//         <div className="flex justify-between w-52 mx-auto mb-8">
//           <label htmlFor="whatsapp">
//             <div
//               className={classNames(
//                 "cursor-pointer h-12 w-12 text-edenGreen-600 bg-edenPink-300 flex items-center justify-center rounded-md hover:bg-edenPink-200",
//                 selected === "whatsapp"
//                   ? "!bg-edenGreen-500 text-edenPink-300"
//                   : ""
//               )}
//             >
//               <BsWhatsapp size={"1.4rem"} />
//             </div>
//           </label>
//           <input
//             type="radio"
//             name="contactType"
//             id="whatsapp"
//             value="whatsapp"
//             className="hidden"
//             onChange={(e) => {
//               console.log(e.target.checked);

//               if (e.target.checked) {
//                 setSelected("whatsapp");
//                 setContact("");
//               }
//             }}
//           />
//           <label htmlFor="email">
//             <div
//               className={classNames(
//                 "cursor-pointer h-12 w-12 text-edenGreen-600 bg-edenPink-300 flex items-center justify-center rounded-md hover:bg-edenPink-200",
//                 selected === "email"
//                   ? "!bg-edenGreen-500 text-edenPink-300"
//                   : ""
//               )}
//             >
//               <HiMail size={"1.4rem"} />
//             </div>
//           </label>
//           <input
//             type="radio"
//             name="contactType"
//             id="email"
//             value="email"
//             className="hidden"
//             onChange={(e) => {
//               if (e.target.checked) {
//                 setSelected("email");
//                 setContact("");
//               }
//             }}
//           />
//           <label htmlFor="telegram">
//             <div
//               className={classNames(
//                 "cursor-pointer h-12 w-12 text-edenGreen-600 bg-edenPink-300 flex items-center justify-center rounded-md hover:bg-edenPink-200",
//                 selected === "telegram"
//                   ? "!bg-edenGreen-500 text-edenPink-300"
//                   : ""
//               )}
//             >
//               <BsTelegram size={"1.4rem"} />
//             </div>
//           </label>
//           <input
//             type="radio"
//             name="contactType"
//             id="telegram"
//             value="telegram"
//             className="hidden"
//             onChange={(e) => {
//               if (e.target.checked) {
//                 setSelected("telegram");
//                 setContact("");
//               }
//             }}
//           />
//         </div>
//         <div className="text-xs max-w-[20rem] mx-auto h-8 flex items-center border border-EdenGray-100 rounded-md bg-white">
//           <div className="ml-auto border-r border-edenGray-100 px-3 text-edenGreen-600">
//             <span>
//               {selected === "whatsapp" && <BsWhatsapp size={"1rem"} />}
//             </span>
//             <span>{selected === "email" && <HiMail size={"1rem"} />}</span>
//             <span>
//               {selected === "telegram" && <BsTelegram size={"1rem"} />}
//             </span>
//           </div>
//           <input
//             type="text"
//             id="contact"
//             className="h-full w-full bg-transparent outline-none"
//             value={contact}
//             onChange={(e) => setContact(e.target.value)}
//           />
//         </div>
//         {selected === "whatsapp" && (
//           <p className="mt-2 text-edenGray-500 text-2xs text-center">
//             You must include country prefix on phone number
//           </p>
//         )}
//       </div>
//       <div className="absolute z-20 bottom-4 left-0 w-full flex justify-center">
//         <Button
//           className=""
//           variant="secondary"
//           onClick={handleSubmit}
//           disabled={!valid}
//         >
//           Submit
//         </Button>
//       </div>
//       <div className="absolute bottom-4 mx-auto z-20 w-full max-w-2xl text-center">
//         {submitting && (
//           <EdenAiProcessingModal title="Submitting" open={submitting} />
//         )}
//       </div>
//     </div>
//   );
// };

export const INITIATE_CONNECTION_TG = gql`
  mutation ($fields: initiateConnectionTelegramInput) {
    initiateConnectionTelegram(fields: $fields) {
      done
      _id
      name
      telegram
      telegramChatID
      authTelegramCode
    }
  }
`;

export const MEMBER_DATA_CONNECTED_TG = gql`
  subscription ($fields: memberDataConnectedTGInput) {
    memberDataConnectedTG(fields: $fields) {
      _id
      conduct {
        telegram
        telegramChatID
        telegramConnectionCode
      }
    }
  }
`;

interface IConnectTelegramContainerProps {
  candidateTelegramID: string | undefined;
}

const ConnectTelegramContainer = ({
  candidateTelegramID = undefined,
}: IConnectTelegramContainerProps) => {
  const { currentUser } = useContext(UserContext);
  const userID = currentUser?._id;
  const router = useRouter();
  const { positionID } = router.query;

  const [submitting, setSubmitting] = useState(false);

  const [telegramAuthCode, setTelegramAuthCode] = useState<String>("");
  const [flagFinishTGconnection, setFlagFinishTGconnection] =
    useState<Boolean>(false);

  const [initiateConnectionTelegram, {}] = useMutation(INITIATE_CONNECTION_TG, {
    onCompleted({ initiateConnectionTelegram }) {
      console.log("data tl= ", initiateConnectionTelegram);

      if (initiateConnectionTelegram.authTelegramCode) {
        setTelegramAuthCode(initiateConnectionTelegram.authTelegramCode);
      }
    },
  });

  useSubscription(MEMBER_DATA_CONNECTED_TG, {
    variables: {
      fields: {},
    },
    onData: ({ data }) => {
      if (data?.data?.memberDataConnectedTG) {
        if (data?.data?.memberDataConnectedTG?._id == userID) {
          setFlagFinishTGconnection(true);
        }
      }
    },
  });

  const handleTelegramClick = () => {
    initiateConnectionTelegram({
      variables: {
        fields: {
          memberID: userID,
        },
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl pt-10">
      {!telegramAuthCode && (
        <>
          <div className="text-center">
            {" "}
            <div
              className={
                "text-edenGreen-600 bg-edenPink-100 mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full"
              }
            >
              <BsLightningFill size={"2rem"} />
            </div>
            <h1 className="text-edenGreen-600">Radical!</h1>
            <p className="mb-6">
              {"We're all set!"}
              {/* {"We're all set! expect to hear from us by x days"} */}
            </p>
          </div>
          {!candidateTelegramID ? (
            <p className="mb-4 text-center">
              {
                "We are only missing your Telegram account so we can communicate you any updates"
              }
            </p>
          ) : (
            <p className="mb-4 text-center">
              {"We'll reach you via Telegram if there are any updates"}
            </p>
          )}
        </>
      )}
      {/* To be removed */}
      {flagFinishTGconnection == false && !!candidateTelegramID && (
        <>
          {!telegramAuthCode ? (
            <Button
              variant="secondary"
              className="fixed bottom-4 right-4 z-40 mx-auto block opacity-0 hover:opacity-10"
              onClick={handleTelegramClick}
            >
              Connect Telegram
            </Button>
          ) : (
            telegramAuthCode && (
              <>
                <p className="mb-6 text-center">
                  Open EdenAI bot on Telegram and click{" "}
                  <span className="text-edenGreen-500 font-bold">/start</span>
                </p>
                <p className="mb-8 text-center">
                  <Link
                    target="_blank"
                    href={`https://t.me/${process.env.NEXT_PUBLIC_EDEN_TG_BOT}`}
                    className="inline text-center"
                  >
                    <Button variant="primary">
                      Go to Telegram
                      <BiChevronRight size="1.4rem" className="ml-2 inline" />
                    </Button>
                  </Link>
                </p>
                <p className="text-edenGray-500 text-center">
                  Your activation code is:
                </p>
                <div className="flex items-center justify-center">
                  <h2 className="text-edenGreen-600 text-center text-[5rem] tracking-widest">
                    {telegramAuthCode}
                  </h2>

                  <div>Hi!</div>

                  <Button
                    variant="primary"
                    className=" h-fit  w-fit border-none font-medium text-black "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        telegramAuthCode.toString()
                      );
                      toast.success("Telegram Code copied to clipboard");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={45}
                      height={45}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                      />
                    </svg>
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}
      {/* ---------- */}
      {flagFinishTGconnection == false && !candidateTelegramID && (
        <>
          {!telegramAuthCode ? (
            <Button
              variant="secondary"
              className="mx-auto block"
              onClick={handleTelegramClick}
            >
              Connect Telegram
            </Button>
          ) : (
            telegramAuthCode && (
              <>
                <p className="mb-6 text-center">
                  Open EdenAI bot on Telegram and click{" "}
                  <span className="text-edenGreen-500 font-bold">/start</span>
                </p>
                <p className="mb-8 text-center">
                  <Link
                    target="_blank"
                    href={`https://t.me/${process.env.NEXT_PUBLIC_EDEN_TG_BOT}`}
                    className="inline text-center"
                  >
                    <Button variant="primary">
                      Go to Telegram
                      <BiChevronRight size="1.4rem" className="ml-2 inline" />
                    </Button>
                  </Link>
                </p>

                <p className="text-edenGray-500 text-center">
                  Your activation code is:
                </p>
                <div className="flex items-center justify-center">
                  <h2 className="text-edenGreen-600 text-center text-[5rem] tracking-widest">
                    {telegramAuthCode}
                  </h2>

                  <Button
                    variant="primary"
                    className=" h-fit  w-fit border-none font-medium text-black "
                    onClick={() => {
                      navigator.clipboard.writeText(
                        telegramAuthCode.toString()
                      );
                      toast.success("Telegram Code copied to clipboard");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      width={45}
                      height={45}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                      />
                    </svg>
                  </Button>
                </div>
              </>
            )
          )}
        </>
      )}

      {flagFinishTGconnection == true && (
        <p className="mb-4 text-center">Telegram Connected</p>
      )}

      <div className="absolute bottom-4 left-0 z-20 flex w-full justify-center">
        <Button
          className=""
          variant="secondary"
          onClick={() => {
            setSubmitting(true);
            router.push(`/interview/${positionID}/submitted`);
          }}
          disabled={!candidateTelegramID}
        >
          Submit
        </Button>
      </div>
      <div className="absolute bottom-4 z-20 mx-auto w-full max-w-2xl text-center">
        {submitting && (
          <EdenAiProcessingModal title="Submitting" open={submitting} />
        )}
      </div>
    </div>
  );
};
