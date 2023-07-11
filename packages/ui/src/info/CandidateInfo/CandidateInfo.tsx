import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@eden/package-graphql";
import {
  SummaryQuestionType,
  TalentListType,
} from "@eden/package-graphql/generated";
import {
  AskEdenTab,
  Avatar,
  // Button,
  CandidateTypeSkillMatch,
  // Dropdown,
  EdenChatTab,
  GraphTab,
  InfoTab,
  LongText,
  MatchTab,
  MeetingNotes,
  ReportNotes,
} from "@eden/package-ui";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsCalendarPlus } from "react-icons/bs";
import { FaChevronLeft } from "react-icons/fa";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoMdAdd, IoMdAddCircle } from "react-icons/io";
import ReactTooltip from "react-tooltip";

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
  handleCreateNewList: () => void;
  talentListsAvailables: TalentListType[];
  handleAddCandidatesToList: () => Promise<void>;
  handleChkSelection?: (candidate) => void;
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
    {
      tab: "Ask Eden",
      Content: () => (
        <AskEdenTab member={dataMember?.findMember} candidate={candidate} />
      ),
    },
    {
      tab: "Transcript",
      Content: () => (
        <EdenChatTab
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

  // console.log("dataMember LLLLLLLLLLLL", dataMember);

  return (
    <>
      <div className="font-Inter absolute z-20 h-56 w-full flex-col bg-white text-center">
        <FaChevronLeft
          className="absolute left-2 top-4 cursor-pointer text-gray-500 hover:text-gray-400"
          onClick={onClose}
        />

        <div className="px-8 py-4">
          <div className="items-end text-left">
            <Avatar src={dataMember?.findMember.discordAvatar!} size={`md`} />
            <div className="">
              <h1 className=" text-lg font-semibold">
                {dataMember?.findMember?.discordName}
              </h1>
              <div className="flex items-center  space-x-1 text-sm text-gray-400">
                <p>{dataMember?.findMember?.location} </p>
                {dataMember?.findMember?.timeZone && (
                  <p> ({dataMember?.findMember?.timeZone})</p>
                )}
              </div>

              <div className="max-h-20 overflow-y-scroll">
                <LongText
                  cutText={100}
                  text={(dataMember?.findMember?.bio as string) || ""}
                  className={`whitespace-pre-wrap text-sm`}
                />
              </div>
            </div>
          </div>

          <div className="absolute right-8 top-4 flex gap-4">
            {/* ------- add to talent pool button ------- */}
            <div className="">
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

              {/* ------- Add candidate to list ------- */}

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
                        onClick={() => handleAddCandidatesToList(list._id!)}
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

            {/* ------- schedule 2nd interview button ------- */}
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
          </div>
        </div>

        {/* <div className="grid w-full grid-cols-3 bg-white">
          <div className="col-1 mt-5 w-full py-2 text-center">
            {!router.pathname.includes("/talentlist") && !qualified ? (
              <div className="flex w-full justify-end">
                <Button
                  className="border-none bg-red-400 text-sm font-bold text-white hover:bg-red-500"
                  radius="pill"
                  onClick={handleRejectCandidate}
                >
                  REJECT
                </Button>
              </div>
            ) : null}
          </div>
          <div className="col-2 p-2 pb-1">
            <div className="flex w-full justify-center">
              <Avatar src={dataMember?.findMember.discordAvatar!} size={`lg`} />
            </div>
          </div>
          <div className="col-3 mt-5 w-full py-2 text-center text-sm">
            {!router.pathname.includes("/talentlist") && !qualified ? (
              <div className="flex w-full justify-start">
                <Button
                  variant="primary"
                  radius="pill"
                  className="border-none font-bold text-white"
                  onClick={handleApproveCandidate}
                >
                  APPROVE
                </Button>
              </div>
            ) : null}
          </div>
        </div> */}

        {/* <div className="flex w-full justify-center px-4"></div>
        <TextHeading3 className="w-full justify-center px-4 !text-sm font-bold text-gray-400">
          {dataMember?.findMember?.memberRole?.title}
        </TextHeading3> */}
      </div>
      <div className="bg-background h-full w-full">
        <Tab.Group
          defaultIndex={index}
          onChange={(index: number) => {
            console.log("Changed selected tab to:", index);
            setIndex(index);
          }}
        >
          <Tab.List className="absolute top-56 z-20 flex h-8  w-full justify-between bg-white text-lg">
            {tabs.map(({ tab }, index) => (
              <Tab
                key={index}
                className={({ selected }) =>
                  classNames(
                    "pt-px text-[14px]",
                    selected
                      ? "border-b-soilGreen-700 w-full border-b-2 bg-lime-50 text-gray-600 outline-none"
                      : "font-avenir-roman w-full border-b-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <div className="bg-background relative top-64">
              {tabs.map(({ Content }, index) => (
                <Tab.Panel key={index}>
                  {/* <div className="h-[calc(100vh-17rem)]"> */}
                  {/* <div className="relative"> */}
                  <div className="abolute px-6">
                    <Content />
                  </div>
                  {/* </div> */}
                </Tab.Panel>
              ))}
            </div>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};
