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
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
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
      <div className="h-full w-full flex-col overflow-y-scroll">
        <div className="bg-edenGreen-100 hover:bg-edenGreen-200 absolute right-10 top-9 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md">
          <IoClose color="#19563F" size={"1rem"} onClick={onClose} />
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
                <LongText
                  cutText={80}
                  text={(dataMember?.findMember?.bio as string) || ""}
                  className={`text-edenGray-900 w-full whitespace-pre-wrap text-sm`}
                />
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
      </div>
      <div className="">
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
      </div>
    </div>
  );
};
