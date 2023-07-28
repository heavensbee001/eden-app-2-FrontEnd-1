import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { UserContext } from "@eden/package-context";
import { FIND_MEMBER } from "@eden/package-graphql";
import {
  Members,
  SummaryQuestionType,
  TalentListType,
} from "@eden/package-graphql/generated";
import {
  AI_INTERVIEW_SERVICES,
  AskEdenTab,
  Avatar,
  // Button,
  CandidateTypeSkillMatch,
  ChatMessage,
  // Dropdown,
  EdenChatTab,
  EdenIconExclamationAndQuestion,
  EdenIconQuestion,
  GraphTab,
  InfoTab,
  InterviewEdenAI,
  LongText,
  MatchTab,
  MeetingNotes,
  ReportNotes,
} from "@eden/package-ui";
import { Tab, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

import { EdenAiLetter } from "../../components/EdenAiLetter";

type NodeDisplay = {
  nameRelevantNode: string;
  nameOriginalNode: string;
  score: number;
  color: string;
};

type relevantNodeObj = {
  [key: string]: {
    nodes: NodeDisplay[];
  };
};

export interface ICandidateInfoProps {
  memberID: string;
  percentage?: number | null;
  summaryQuestions?: SummaryQuestionType[];
  mostRelevantMemberNode?: relevantNodeObj;
  candidate?: CandidateTypeSkillMatch;
  onClose?: () => void;
  // eslint-disable-next-line no-unused-vars
  rejectCandidateFn?: (memberID: string) => void;
  // eslint-disable-next-line no-unused-vars
  approveCandidateFn?: (memberID: string) => void;
  qualified?: boolean;
  handleCreateNewList?: () => void;
  talentListsAvailables?: TalentListType[];
  handleAddCandidatesToList?: (listID: string) => Promise<void>;
  handleChkSelection?: (candidate: any) => void;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const CandidateInfo = ({
  memberID,
  summaryQuestions,
  mostRelevantMemberNode,
  candidate,
  onClose,
  rejectCandidateFn,
  approveCandidateFn,
  handleChkSelection,

  talentListsAvailables,
  handleCreateNewList,
  handleAddCandidatesToList,
  // eslint-disable-next-line no-unused-vars
  qualified = false,
}: ICandidateInfoProps) => {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [addToListOpen, setAddToListOpen] = useState<boolean>(false);

  const [letterType, setLetterType] = useState<
    "rejection" | "nextInterviewInvite" | undefined
  >(undefined);

  const handleRejectionLetter = () => {
    setLetterType("rejection");
    setIsOpen(!isOpen);
  };

  const handleSecondInterviewLetter = () => {
    setLetterType("nextInterviewInvite");
    setIsOpen(!isOpen);
  };

  const handleGreenButtonPress = () => {
    setAddToListOpen(true);
    if (handleChkSelection) {
      handleChkSelection(candidate);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();

  const { data: dataMember } = useQuery(FIND_MEMBER, {
    variables: {
      fields: {
        _id: memberID,
      },
    },
    skip: !Boolean(memberID),
    ssr: false,
  });

  const tabs = [
    {
      tab: "Background",
      Content: () => (
        <InfoTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          mostRelevantMemberNode={mostRelevantMemberNode}
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Fit",
      Content: () => (
        <ReportNotes
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Interview",
      Content: () => (
        <MatchTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          summaryQuestions={summaryQuestions}
        />
      ),
    },
    {
      tab: "Skill Match",
      Content: () => (
        <GraphTab
          member={
            {
              ...candidate,
              user: dataMember?.findMember,
            } as CandidateTypeSkillMatch
          }
          candidate={candidate}
        />
      ),
    },
    {
      tab: "Culture Fit",
      Content: () => (
        <MeetingNotes member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    // {
    //   tab: "Ask Eden",
    //   Content: () => (
    //     <AskEdenTab member={dataMember?.findMember} candidate={candidate} />
    //   ),
    // },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTab
          member={dataMember?.findMember}
          memberImg={dataMember?.findMember.discordAvatar}
          conversationID={candidate?.conversationID || undefined}
        />
      ),
    },
  ];

  const handleRejectCandidate = () => {
    rejectCandidateFn && rejectCandidateFn(memberID);
  };

  const handleApproveCandidate = () => {
    approveCandidateFn && approveCandidateFn(memberID);
  };

  // let cutOffText;

  // if (dataMember?.findMember?.bio) {
  //   const text = dataMember?.findMember?.bio;

  //   if (text.length > 60) {
  //     cutOffText = text.substring(0, 60) + "..."; // "This is a long strin..."
  //   } else {
  //     cutOffText = text;
  //   }
  // } else {
  //   cutOffText =
  //     "On a mission to empower anyone anywhere to do meaningful work";
  // }

  return (
    <div className="bg-white">
      <section className="h-full w-full flex-col overflow-y-scroll">
        <div
          onClick={onClose}
          className="bg-edenGreen-100 hover:bg-edenGreen-200 absolute right-10 top-9 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md"
        >
          <IoClose color="#19563F" size={"1rem"} />
        </div>

        {/* ---- Header ---- */}
        <div>
          <div className="mb-6 flex p-8 pb-4">
            <div className="mr-3">
              <Avatar src={dataMember?.findMember.discordAvatar!} size={`md`} />
            </div>
            <div className="w-full">
              <h3 className="font-Unica text-edenGreen-600">
                {dataMember?.findMember?.discordName}
              </h3>
              <div>
                <p className="text-edenGray-700 text-xs">
                  <span>{dataMember?.findMember?.location}</span>
                  {dataMember?.findMember?.timeZone && " | "}
                  <span>{dataMember?.findMember?.timeZone}</span>
                </p>
              </div>
              <div>
                {dataMember?.findMember?.oneLiner ? (
                  <p className="text-edenGray-900 w-full whitespace-pre-wrap text-sm">
                    {dataMember?.findMember?.oneLiner}
                  </p>
                ) : (
                  <LongText
                    cutText={80}
                    text={(dataMember?.findMember?.bio as string) || ""}
                    className={`text-edenGray-900 w-full whitespace-pre-wrap text-sm`}
                  />
                )}
              </div>
            </div>
          </div>

          {/* <div className="absolute right-8 top-4 flex gap-4">
            ------- add to talent pool button -------
            <div>
              <span
                // onClick={() => {
                //   setAddToListOpen(true);
                // }}
                className="cursor-pointer text-xs"
                data-tip={"Add to talent pool"}
                data-for={`badgeTip-add-to-talent-pool`}
              >
                <IoMdAddCircle
                  size={28}
                  className="text-accentColor hover:text-black"
                  // onClick={handleApproveCandidate}
                  onClick={handleGreenButtonPress}
                />
                <ReactTooltip
                  id={`badgeTip-add-to-talent-pool`}
                  place="left"
                  effect="solid"
                  padding="0.25rem"
                ></ReactTooltip>
              </span>

              ------- Add candidate to list -------

              {addToListOpen && (
                <div
                  className="fixed left-0 top-0 z-30 h-full w-full"
                  onClick={() => {
                    setAddToListOpen(false);
                  }}
                ></div>
              )}
              {addToListOpen && (
                <div
                  className={classNames(
                    "scrollbar-hide absolute left-0 top-6 z-40 max-h-[120px] w-[140px] overflow-y-scroll rounded-md border border-gray-200 bg-white hover:text-gray-600",
                    addToListOpen ? "" : "h-0"
                  )}
                >
                  <div
                    className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                    onClick={handleCreateNewList}
                  >
                    <p className="">
                      <HiOutlineDocumentPlus
                        size={16}
                        className="mb-1 mr-1 inline"
                      />
                      New list
                    </p>
                  </div>
                  {talentListsAvailables &&
                    talentListsAvailables.map((list, index) => (
                      <div
                        key={index}
                        className="cursor-pointer border-b border-gray-200 p-1 last:border-0 hover:bg-gray-100"
                        onClick={() =>
                          handleAddCandidatesToList &&
                          handleAddCandidatesToList(list._id!)
                        }
                      >
                        <p className="">{list.name}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <span
              className="cursor-pointer text-xs"
              data-tip={"Reject gracefully"}
              data-for={`badgeTip-reject`}
            >
              <IoMdAdd
                onClick={handleRejectionLetter}
                size={28}
                className="rotate-45 text-red-400"
                // onClick={handleRejectCandidate}
              />
              <ReactTooltip
                id={`badgeTip-reject`}
                place="left"
                effect="solid"
                padding="0.25rem"
              ></ReactTooltip>
            </span>

           ------- schedule 2nd interview button -------
            <span
              className="cursor-pointer text-xs"
              data-tip={"Schedule 2nd interview"}
              data-for={`badgeTip-schedule`}
            >
              <EdenAiLetter
                member={dataMember?.findMember}
                isModalOpen={isOpen}
                letterType={letterType}
              />
              <BsCalendarPlus
                onClick={handleSecondInterviewLetter}
                size={25}
                className="text-gray-600 hover:text-gray-500"
              />
              <ReactTooltip
                id={`badgeTip-schedule`}
                place="left"
                effect="solid"
                padding="0.25rem"
              ></ReactTooltip>
            </span>
          </div> */}
        </div>
      </section>
      <section className="">
        <Tab.Group
          defaultIndex={index}
          onChange={(index: number) => {
            // console.log("Changed selected tab to:", index);
            setIndex(index);
          }}
        >
          <Tab.List className="border-edenGreen-300 flex h-8 w-full justify-between border-b">
            {tabs.map(({ tab }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "text-edenGreen-400 -mb-px w-full pb-2 text-xs",
                    selected
                      ? " !text-edenGreen-600 border-edenGreen-600 border-b outline-none"
                      : "hover:text-edenGreen-500 hover:border-edenGreen-600 hover:border-b"
                  )
                }
              >
                {tab.toUpperCase()}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <div className="">
              {tabs.map(({ Content }, index) => (
                <Tab.Panel key={index}>
                  <div className="px-8 py-4">
                    <Content />
                  </div>
                </Tab.Panel>
              ))}
            </div>
          </Tab.Panels>
        </Tab.Group>
      </section>
      <section>
        {dataMember?.findMember && (
          <AskEdenPopUp member={dataMember?.findMember} />
        )}
      </section>
    </div>
  );
};

// ----- Ask Eden component -----

const FIND_POSITION = gql`
  query ($fields: findPositionInput) {
    findPosition(fields: $fields) {
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

// interface InterviewEdenAIContainerProps {
//   handleEnd?: () => void;
// }
interface Props {
  member?: Members;
}

const AskEdenPopUp = ({ member }: Props) => {
  const [open, setOpen] = useState(false);

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

  const [conversationID, setConversationID] = useState<String>("");

  // console.log("positionID = ", positionID);

  const [experienceTypeID] = useState<string>("");

  // eslint-disable-next-line no-unused-vars
  const [chatN, setChatN] = useState<ChatMessage>([]);

  // console.log("chatN = ", chatN);

  console.log("conversationID = ", conversationID);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40">
        <div
          className={classNames(
            "bg-edenPink-400 flex h-12 w-12 transform cursor-pointer items-center justify-center rounded-full drop-shadow-sm transition-all ease-in-out",
            open ? "-rotate-45" : "rotate-0"
          )}
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <EdenIconQuestion className="h-8 w-8" />
          ) : (
            <EdenIconExclamationAndQuestion className="h-8 w-8" />
          )}
        </div>
        <Transition
          show={open}
          as={Fragment}
          enter="transition-w transition-h ease-in-out duration-300"
          enterFrom="w-0 h-0"
          enterTo="w-[30rem] h-[70vh]"
          leave="transition-w transition-h ease-in-out duration-300"
          leaveFrom="w-[30rem] h-[70vh]"
          leaveTo="w-0 h-0"
        >
          <div className="absolute bottom-14 right-0 max-w-lg overflow-hidden">
            <InterviewEdenAI
              key={experienceTypeID}
              aiReplyService={AI_INTERVIEW_SERVICES.ASK_EDEN_USER_POSITION}
              experienceTypeID={experienceTypeID}
              handleChangeChat={(_chat: any) => {
                setChatN(_chat);
              }}
              sentMessageToEdenAIobj={sentMessageToEdenAIobj}
              setSentMessageToEdenAIobj={setSentMessageToEdenAIobj}
              placeholder={
                <p className="bg-cottonPink text-edenGreen-600 rounded-lg p-1 text-center font-medium">
                  Ask me any question about the Candidate
                </p>
              }
              questions={questions}
              setQuestions={setQuestions}
              userID={member?._id}
              positionID={positionID}
              conversationID={conversationID}
              setConversationID={setConversationID}
              // handleEnd={() => {
              //   if (handleEnd) handleEnd();
              // }}
            />
          </div>
        </Transition>
      </div>
      {open && (
        <div
          className="fixed left-0 top-0 z-30 h-screen w-screen"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        ></div>
      )}
    </>
  );
};
